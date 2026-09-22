/**
 * UI wiring, state and the in-page self-test.
 *
 * State lives in the URL hash so a scale is shareable and reproducible;
 * localStorage only remembers the last session for when you arrive without a
 * hash. The hash always wins.
 */

import { codeToOklch, contrast, fromHex, luminance, parseCss, toHex } from './color.js';
import {
	DEFAULTS,
	InfeasibleLadderError,
	LEVELS,
	buildLadder,
	buildScale,
	feasibility,
	mirrorStep,
	verify,
} from './core.js';
import { GUARANTEE, exportCss, exportTokens, formatColor } from './export.js';

const $ = (id) => document.getElementById(id);
/**
 * Bumped whenever the shape of the saved state changes. A stored session or a
 * shared link from an older shape is discarded rather than half-restored --
 * otherwise removed settings linger and old example colors keep coming back.
 */
const STATE_VERSION = 2;
const STORAGE_KEY = `bitstorm.color-tokens.v${STATE_VERSION}`;

/* ----------------------------------------------------------------- state */

const DEFAULT_STATE = {
	n: 12,
	level: 'AA',
	bg: '#f6f6f6',
	fg: '#161319',
	colors: [
		{ name: 'blue', css: '#406cc4' },
		{ name: 'purple', css: '#7b58c9' },
		{ name: 'red', css: '#ba473e' },
	],
	format: 'hex',
	mirror: 1,
	layer: 1,
	kind: 'css',
	preview: 'auto',
};

let state = { ...DEFAULT_STATE };

function encodeState(s) {
	const compact = {
		v: STATE_VERSION,
		n: s.n, lv: s.level,
		bg: s.bg, fg: s.fg,
		c: s.colors.map((c) => [c.name, c.css]),
		f: s.format, mi: s.mirror, l: s.layer, k: s.kind,
	};
	return encodeURIComponent(JSON.stringify(compact));
}

function decodeState(raw) {
	try {
		const c = JSON.parse(decodeURIComponent(raw));
		if (!c || typeof c !== 'object') return null;
		if (c.v !== STATE_VERSION) return null;
		return {
			...DEFAULT_STATE,
			n: c.n ?? DEFAULT_STATE.n,
			level: c.lv ?? DEFAULT_STATE.level,
			bg: c.bg ?? DEFAULT_STATE.bg,
			fg: c.fg ?? DEFAULT_STATE.fg,
			colors: Array.isArray(c.c)
				? c.c.map(([name, css]) => ({ name, css }))
				: DEFAULT_STATE.colors,
			format: c.f ?? DEFAULT_STATE.format,
			mirror: c.mi ?? DEFAULT_STATE.mirror,
			layer: c.l ?? DEFAULT_STATE.layer,
			kind: c.k ?? DEFAULT_STATE.kind,
		};
	} catch {
		return null;
	}
}

function loadState() {
	// The hash is the source of truth when there is one.
	if (location.hash.length > 1) {
		const fromHash = decodeState(location.hash.slice(1));
		if (fromHash) return fromHash;
	}
	try {
		// Drop sessions saved under an older shape so they do not accumulate.
		for (let i = localStorage.length - 1; i >= 0; i--) {
			const key = localStorage.key(i);
			if (key?.startsWith('bitstorm.color-tokens.') && key !== STORAGE_KEY) {
				localStorage.removeItem(key);
			}
		}
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			const s = decodeState(stored);
			if (s) return s;
		}
	} catch {
		/* private mode, blocked storage — defaults are fine */
	}
	return { ...DEFAULT_STATE };
}

let suppressHash = false;
function persist() {
	const encoded = encodeState(state);
	suppressHash = true;
	history.replaceState(null, '', `#${encoded}`);
	suppressHash = false;
	try {
		localStorage.setItem(STORAGE_KEY, encoded);
	} catch {
		/* ignore */
	}
}

/* ------------------------------------------------------------ computing */

/**
 * The two tones sit one step outside the scale, so the whole range spans n+1
 * gaps: one down to the lightest token, n-1 between the tokens, one down to
 * the dark tone. That fixes the ratio per step from the tones and the step
 * count alone, and the guaranteed distance then follows from it.
 *
 * Equal distances therefore mean equal contrast within any one scale -- the
 * ladder is geometric -- while the distance needed for AA grows as you ask for
 * more steps across the same range.
 */
function ladderParams(s) {
	const { yMax, yMin } = bounds(s);
	const R = (yMax + 0.05) / (yMin + 0.05);
	const target = levelOf(s).text * QUANT_HEADROOM;
	const r = Math.pow(R, 1 / (s.n + 1));
	const d = Math.ceil(Math.log(target) / Math.log(r));
	// Hand buildLadder a target of exactly r^d so it reproduces this r.
	return { yMax, yMin, R, r, d, target: Math.pow(r, d) };
}

/** Fewest steps for which some pair is far enough apart to be guaranteed. */
function minSteps(s) {
	for (let n = 2; n <= MAX_STEPS; n++) {
		const p = ladderParams({ ...s, n });
		if (p.d <= n - 1) return n;
	}
	return Infinity;
}

/** Most steps the slider will offer, whatever the tones allow. */
const MAX_STEPS = 15;

/**
 * Headroom above the promised ratio, to survive rounding to 8-bit hex.
 *
 * The exact floor is the threshold itself when every step can be rounded in
 * its safe direction, and threshold / (1 - PHI_MAX) = threshold x 1.0080 when
 * some step is both the light and the dark member of a guaranteed pair. 1%
 * clears both, and it is free: at AA it still allows the same 6 steps that a
 * zero margin would.
 */
const QUANT_HEADROOM = 1.01;

/** The thresholds the chosen WCAG level demands. */
function levelOf(s) {
	return LEVELS[s.level] ?? LEVELS.AA;
}

/**
 * Balance is fixed at 0.5 rather than exposed. It is the only value for which
 * the room left above step 1 equals the room left below step n, so a token and
 * its mirror carry identical contrast in both schemes. Every other value makes
 * one scheme weaker than the other, which for a tool that emits nothing but
 * mirrored light-dark() pairs is simply worse.
 */
const BETA = 0.5;

/** The internal target: the promise plus just enough to survive quantization. */
function effectiveTarget(s) {
	return levelOf(s).text * QUANT_HEADROOM;
}

/**
 * How many steps fit between the two tones. With the distance and the target
 * both fixed this depends only on the tones and the level, so the Steps slider
 * can be capped at it and the ladder is then always buildable.
 */
function maxSteps(s) {
	const { yMax, yMin } = bounds(s);
	const f = feasibility({
		n: 2, d: built.ladder.options.d, target: effectiveTarget(s), yMax, yMin,
		threshold: levelOf(s).text,
	});
	return Math.min(MAX_STEPS, f.nMax);
}

/**
 * The two anchor tones bound the ladder. They are the only thing that defines
 * the available range -- a separate pair of endpoint fields would be a second
 * control claiming the same job, and the two would disagree.
 *
 * The ladder still sits just inside them rather than touching them, so step 1
 * stays a usable soft tint instead of collapsing onto the page background.
 */
function bounds(s) {
	const hi = luminance(fromHex(s.bg) ?? [255, 255, 255]);
	const lo = luminance(fromHex(s.fg) ?? [0, 0, 0]);
	return { yMax: Math.max(hi, lo), yMin: Math.min(hi, lo) };
}

function buildEverything(s) {
	const p = ladderParams(s);
	const ladder = buildLadder({
		n: s.n,
		d: p.d,
		target: p.target,
		beta: BETA,
		yMax: p.yMax,
		yMin: p.yMin,
		threshold: levelOf(s).text,
	});

	const scales = s.colors
		.map((c) => {
			const code = parseCss(c.css);
			if (!code) return null;
			const [l, ch, hue] = codeToOklch(code);
			// Always preserve: the envelope is derived from the color you
			// picked, so a muted one stays muted and a vivid one stays vivid.
			// An achromatic input has no hue to preserve, so it yields a
			// neutral scale rather than being given an arbitrary one.
			const envelope =
				ch > 1e-4
					? { kind: 'preserve', base: { l, c: ch } }
					: { kind: 'fixed', cMax: 0 };
			return { scale: buildScale(ladder, { name: c.name, hue, envelope }), code };
		})
		.filter(Boolean);

	const anchors = { bg: { hex: s.bg }, fg: { hex: s.fg } };
	const report = verify({
		ladder,
		scales: scales.map((x) => x.scale),
		threshold: levelOf(s).text,
		large: levelOf(s).large,
	});

	return { ladder, scales, anchors, report };
}

/* ------------------------------------------------------------ rendering */

const fmtRatio = (v) => `${v.toFixed(2)}:1`;

function renderControls(s) {
	const lo = minSteps(s);
	$('steps').min = Number.isFinite(lo) ? lo : 2;
	$('steps').max = MAX_STEPS;
	$('steps').value = s.n;
	$('steps-val').textContent = s.n;
	$('level').value = s.level;
	$('format').value = s.format;
	$('mirror').value = String(s.mirror);
	$('layer').value = String(s.layer);
	$('export-kind').value = s.kind;
	$('preview').value = s.preview;
	$('anchor-bg').value = s.bg;
	$('anchor-fg').value = s.fg;
	$('anchor-bg-text').value = s.bg;
	$('anchor-fg-text').value = s.fg;
	$('layer').closest('.field').hidden = s.kind !== 'css';
}

function renderFeasibility(s) {
	const p = ladderParams(s);
	const f = feasibility({
		n: s.n, d: p.d, target: p.target,
		yMax: p.yMax, yMin: p.yMin, threshold: levelOf(s).text,
	});
	const box = $('ladder-error');

	if (f.feasible) {
		box.hidden = true;
		return f;
	}

	box.hidden = false;
	box.className = 'notice bad';
	const why = {
		'span-exceeds-range':
			`${s.bg} and ${s.fg} are too close together: they contrast ${f.R.toFixed(2)}:1, ` +
			`which cannot carry ${levelOf(s).text}:1 at any step count. ` +
			`Pick a lighter light tone or a darker dark one.`,
		'target-below-quantization-floor':
			`Internal target ${p.target.toFixed(3)} is below ${f.minTarget.toFixed(3)}, ` +
			`the floor that survives rounding to 8-bit color. This is a bug — please report it.`,
		'distance-out-of-range':
			`${s.n} steps across a ${f.R.toFixed(2)}:1 range are too fine to reach ` +
			`${levelOf(s).text}:1 within the scale — ${p.d} steps apart would be needed but only ` +
			`${s.n - 1} are available. Use fewer steps, or move the tones further apart.`,
		'n-too-small': 'A scale needs at least two steps.',
	}[f.reason];
	box.textContent = why ?? f.reason;
	return f;
}

/**
 * The two distances that matter: how far apart two tokens must be for body
 * text, and for large text and UI components. Both follow from the fixed
 * neighbor ratio, so they are properties of the scale, not of a given pair.
 */
function renderRules(s, built) {
	const ul = $('rules');
	ul.textContent = '';
	const lv = levelOf(s);
	const nominal = built.ladder.nominal;

	const stepsFor = (ratio) => {
		const i = nominal.findIndex((r) => r >= ratio);
		return i === -1 ? null : i + 1;
	};

	for (const [ratio, what] of [
		[lv.text, 'body text'],
		[lv.large, 'large text & UI'],
	]) {
		const k = stepsFor(ratio);
		// Show what this scale actually delivers at that distance, measured on
		// the generated hex values — not the threshold it had to clear. The two
		// differ because a distance is a whole number of steps and so rounds up.
		const actual = k ? built.report.byDistance[k - 1]?.worst : null;
		const li = document.createElement('li');
		li.innerHTML = k
			? `<strong>${k}</strong> <span class="unit">steps apart</span>` +
				`<span class="meets">${fmtRatio(actual ?? nominal[k - 1])} — ${what}</span>`
			: `<strong>—</strong> <span class="unit">out of reach</span>` +
				`<span class="meets">needs ${ratio}:1 — ${what}</span>`;
		ul.append(li);
	}

}

/** Index the drag started from, or null when no drag is in progress. */
let dragFrom = null;

function moveColor(from, to) {
	if (from === to) return;
	const next = [...state.colors];
	const [moved] = next.splice(from, 1);
	next.splice(to, 0, moved);
	state.colors = next;
	render();
}

function renderColors(s, built) {
	const wrap = $('colors');
	wrap.textContent = '';

	s.colors.forEach((c, i) => {
		const row = document.createElement('div');
		row.className = 'color-row';
		row.dataset.index = String(i);

		// Reordering: drag the handle, or focus it and use the arrow keys. The
		// keyboard path is not a fallback — dragging is unusable without a
		// pointer, and this panel is otherwise fully operable from the keyboard.
		const handle = document.createElement('button');
		handle.type = 'button';
		handle.className = 'icon handle';
		handle.draggable = true;
		handle.setAttribute('aria-label', `Reorder ${c.name || 'color'}, position ${i + 1} of ${s.colors.length}`);
		handle.innerHTML =
			'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 4h.01M10 4h.01M6 8h.01M10 8h.01M6 12h.01M10 12h.01"/></svg>';
		handle.addEventListener('keydown', (ev) => {
			const to = ev.key === 'ArrowUp' ? i - 1 : ev.key === 'ArrowDown' ? i + 1 : null;
			if (to === null || to < 0 || to >= s.colors.length) return;
			ev.preventDefault();
			moveColor(i, to);
			// Keep focus on the handle that moved, not on whatever took its place.
			requestAnimationFrame(() => {
				wrap.querySelectorAll('.handle')[to]?.focus();
			});
		});
		handle.addEventListener('dragstart', (ev) => {
			dragFrom = i;
			ev.dataTransfer.effectAllowed = 'move';
			ev.dataTransfer.setData('text/plain', String(i));
			ev.dataTransfer.setDragImage(row, 20, row.offsetHeight / 2);
			row.classList.add('dragging');
		});
		handle.addEventListener('dragend', () => {
			dragFrom = null;
			wrap.querySelectorAll('.color-row').forEach((el) =>
				el.classList.remove('dragging', 'drop-above', 'drop-below'),
			);
		});

		row.addEventListener('dragover', (ev) => {
			if (dragFrom === null || dragFrom === i) return;
			ev.preventDefault();
			ev.dataTransfer.dropEffect = 'move';
			row.classList.toggle('drop-above', i < dragFrom);
			row.classList.toggle('drop-below', i > dragFrom);
		});
		row.addEventListener('dragleave', () => {
			row.classList.remove('drop-above', 'drop-below');
		});
		row.addEventListener('drop', (ev) => {
			ev.preventDefault();
			const from = dragFrom;
			// The re-render below replaces this row, so dragend may never fire
			// on the handle. Clear the drag state here or it goes stale and
			// later hovers light up phantom drop targets.
			dragFrom = null;
			if (from === null || from === i) return;
			moveColor(from, i);
		});

		const code = parseCss(c.css);
		const picker = document.createElement('input');
		picker.type = 'color';
		picker.value = code ? toHex(code) : '#808080';
		picker.setAttribute('aria-label', `Color for ${c.name || 'unnamed'}`);
		picker.addEventListener('input', () => update({ colorAt: [i, { css: picker.value }] }));

		const name = document.createElement('input');
		name.type = 'text';
		name.value = c.name;
		name.setAttribute('aria-label', 'Token name');
		name.placeholder = 'name';
		name.addEventListener('input', () =>
			update({ colorAt: [i, { name: name.value.trim().replace(/\s+/g, '-') }] }, true),
		);

		const css = document.createElement('input');
		css.type = 'text';
		css.className = 'css-input';
		css.value = c.css;
		css.setAttribute('aria-label', 'Any CSS color');
		css.placeholder = '#hex, rgb(), oklch()';
		css.addEventListener('change', () => update({ colorAt: [i, { css: css.value }] }));
		if (!code) css.setAttribute('aria-invalid', 'true');

		const del = document.createElement('button');
		del.type = 'button';
		del.className = 'icon';
		del.innerHTML =
			'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 4.2l7.6 7.6M11.8 4.2l-7.6 7.6"/></svg>';
		del.setAttribute('aria-label', `Remove ${c.name || 'color'}`);
		del.disabled = s.colors.length < 2;
		del.addEventListener('click', () => update({ removeColor: i }));

		row.append(handle, picker, name, css, del);

		// Only say something when there is something wrong to say.
		if (!code) {
			const problem = document.createElement('p');
			problem.className = 'place';
			problem.textContent = 'Not a color this browser understands.';
			row.append(problem);
		}
		wrap.append(row);
	});
}

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

/** Which scheme the ladder is actually painted in right now. */
function effectiveScheme(s) {
	if (s.preview === 'light' || s.preview === 'dark') return s.preview;
	return darkQuery.matches ? 'dark' : 'light';
}

function renderLadder(s, built) {
	const el = $('ladder');
	el.textContent = '';
	el.dataset.scheme = s.preview;
	if (s.preview === 'auto') delete el.dataset.scheme;

	const scales = built.scales.map((x) => x.scale);
	const n = s.n;
	el.style.gridTemplateColumns = `auto repeat(${scales.length}, minmax(7.5rem, 1fr))`;

	el.append(document.createElement('span'));
	for (const sc of scales) {
		const h = document.createElement('span');
		h.className = 'head';
		h.textContent = sc.name;
		el.append(h);
	}

	for (let token = 1; token <= n; token++) {
		const rh = document.createElement('span');
		rh.className = 'rowhead';
		rh.textContent = token;
		el.append(rh);

		for (const sc of scales) {
			// Write the label in a color at least d steps away, so the grid
			// demonstrates the guarantee it claims.
			//
			// When n <= 2d-1 the middle tokens have no partner at distance d in
			// either direction -- they take part in no guaranteed pair at all.
			// There is then nothing in the palette that can prove anything, so
			// fall back to plain black or white, whichever contrasts more, and
			// say so in the tooltip rather than implying a promise.
			const hasPartner = token + built.ladder.options.d <= n || token - built.ladder.options.d >= 1;
			const d = built.ladder.options.d;
			const labelStep = token + d <= n ? token + d : token - d;
			const swatch = document.createElement('button');
			swatch.type = 'button';
			swatch.className = 'swatch';
			const lightHex = sc.swatches[token - 1].hex;
			const darkHex = sc.swatches[mirrorStep(token, n) - 1].hex;
			const extreme = (hex) =>
				contrast(luminance(fromHex(hex)), 0) > contrast(luminance(fromHex(hex)), 1)
					? '#000000'
					: '#ffffff';
			const labelLight = hasPartner ? sc.swatches[labelStep - 1].hex : extreme(lightHex);
			const labelDark = hasPartner
				? sc.swatches[mirrorStep(labelStep, n) - 1].hex
				: extreme(darkHex);
			swatch.style.background = `light-dark(${lightHex}, ${darkHex})`;
			swatch.style.color = `light-dark(${labelLight}, ${labelDark})`;

			const nm = document.createElement('span');
			nm.className = 'name';
			nm.textContent = `${sc.name}-${token}`;
			const val = document.createElement('span');
			val.className = 'val';
			// Show the value for the scheme actually on screen, so the label
			// never contradicts the color it is sitting on.
			val.textContent = formatColor(
				effectiveScheme(s) === 'dark' ? darkHex : lightHex,
				s.format,
			);
			swatch.append(nm, val);

			const ratio = contrast(
				luminance(fromHex(lightHex)),
				luminance(fromHex(labelLight)),
			);
			swatch.title = hasPartner
				? `${sc.name}-${token} — light ${lightHex}, dark ${darkHex}. Label is ${sc.name}-${labelStep}, ${fmtRatio(ratio)}. Click to copy.`
				: `${sc.name}-${token} — light ${lightHex}, dark ${darkHex}. No step sits ${built.ladder.options.d} apart from this one, so it is in no guaranteed pair; label falls back to ${labelLight} at ${fmtRatio(ratio)}. Click to copy.`;
			swatch.addEventListener('click', () => {
				const value = s.mirror
					? `light-dark(${formatColor(lightHex, s.format)}, ${formatColor(darkHex, s.format)})`
					: formatColor(lightHex, s.format);
				copy(value, `Copied ${sc.name}-${token}`);
			});
			el.append(swatch);
		}
	}
}

function renderVerification(s, built) {
	const r = built.report;
	const sum = $('verify-summary');
	sum.className = r.ok ? 'notice warn' : 'notice bad';
	sum.style.borderColor = '';
	if (r.ok) {
		sum.className = 'summary';
		sum.innerHTML =
			`<span class="badge ok">Proven</span><p>` +
			`All ${r.counts.pairs} pairs checked on their hex values. ` +
			`Every pair at distance ${built.ladder.options.d} or more reaches ${fmtRatio(r.byDistance[built.ladder.options.d - 1].worst)} or better` +
			(r.d3 ? `, and ${levelOf(s).large}:1 first holds at distance ${r.d3}.` : '.') +
			`</p>`;
	} else {
		sum.className = 'summary';
		sum.innerHTML =
			`<span class="badge bad">Failed</span><p>` +
			`${r.failures.length} pair(s) below ${levelOf(s).text}:1. ` +
			r.failures
				.slice(0, 5)
				.map((f) => `${f.a.scale}-${f.a.step} vs ${f.b.scale}-${f.b.step} = ${fmtRatio(f.ratio)}`)
				.join('; ') +
			`</p>`;
	}

	const t = $('distance-table');
	t.textContent = '';
	t.insertAdjacentHTML(
		'beforeend',
		`<caption>Worst pair at every index distance. Distances below ${built.ladder.options.d} are shown so it is clear what is <em>not</em> promised.</caption>
		<thead><tr><th>Distance</th><th>Worst</th><th>Pair</th><th>Pairs</th><th>Floor</th><th>Promise</th></tr></thead>`,
	);
	const body = document.createElement('tbody');
	for (const row of r.byDistance) {
		const promised = row.distance >= built.ladder.options.d;
		const tr = document.createElement('tr');
		tr.innerHTML =
			`<td>${row.distance}</td>` +
			`<td class="${promised ? (row.meetsAA ? 'pass' : 'fail') : ''}">${fmtRatio(row.worst)}</td>` +
			`<td>${row.worstPair ? `${row.worstPair.a.scale}-${row.worstPair.a.step} / ${row.worstPair.b.scale}-${row.worstPair.b.step}` : '—'}</td>` +
			`<td>${row.pairsChecked}</td>` +
			`<td>${row.guaranteedFloor.toFixed(2)}</td>` +
			`<td>${promised ? (row.meetsAA ? 'guaranteed' : 'FAILS') : row.meetsLarge ? `${levelOf(s).large}:1 only` : 'not promised'}</td>`;
		body.append(tr);
	}
	t.append(body);

	renderMatrix(s, built);
}

function renderMatrix(s, built) {
	if (!$('matrix-details').open) return;
	const scales = built.scales.map((x) => x.scale);
	const cells = [];
	for (const sc of scales) for (const w of sc.swatches) cells.push({ sc: sc.name, w });

	const t = $('matrix');
	t.textContent = '';
	const head = document.createElement('thead');
	head.innerHTML =
		'<tr><th></th>' +
		cells.map((c) => `<th>${c.sc}-${c.w.step}</th>`).join('') +
		'</tr>';
	t.append(head);
	const body = document.createElement('tbody');
	for (const a of cells) {
		const tr = document.createElement('tr');
		let html = `<th>${a.sc}-${a.w.step}</th>`;
		for (const b of cells) {
			const k = Math.abs(a.w.step - b.w.step);
			const ratio = contrast(luminance(fromHex(a.w.hex)), luminance(fromHex(b.w.hex)));
			const promised = k >= built.ladder.options.d;
			const bgTok = ratio >= levelOf(s).text ? 'var(--sage-1)' : ratio >= levelOf(s).large ? 'var(--navy-1)' : 'var(--background)';
			html += `<td style="background:${bgTok}" title="distance ${k}${promised ? ', guaranteed' : ''}">${k === 0 ? '—' : ratio.toFixed(1)}</td>`;
		}
		tr.innerHTML = html;
		body.append(tr);
	}
	t.append(body);
}

/* -------------------------------------------------------------- export */

function currentOutput(s, built) {
	const scales = built.scales.map((x) => x.scale);
	const opts = {
		format: s.format,
		mirror: !!s.mirror,
		layer: !!s.layer,
		d: built.ladder.options.d,
		n: s.n,
		threshold: levelOf(s).text,
	};
	if (s.kind === 'json') return JSON.stringify(exportTokens(scales, built.anchors, opts), null, '\t');
	return exportCss(scales, built.anchors, opts);
}

function renderExport(s, built) {
	const text = currentOutput(s, built);
	$('output').textContent = text;

	const badge = $('guarantee-badge');
	const status = GUARANTEE[s.format];
	if (status === 'proven-on-output') {
		// Nothing to say: hex and rgb are the values that were verified, so a
		// reassurance on every render is just noise. The warning below is not.
		badge.textContent = '';
		badge.hidden = true;
	} else {
		badge.hidden = false;
		badge.innerHTML =
			`<span class="badge warn">Proven on source only</span> <span class="small muted">Verified on the 8-bit hex values. The browser re-resolves ${s.format}() through its own pipeline, and on a wide-gamut display outside sRGB — so the shipped values are not the verified ones. Export as hex if the guarantee must travel.</span>`;
	}
	return text;
}

async function copy(text, message) {
	try {
		await navigator.clipboard.writeText(text);
		flash(message);
	} catch {
		flash('Copy failed — select the text and copy manually.');
	}
}

function flash(message) {
	$('export-status').textContent = message;
	$('copy-status').textContent = message;
	clearTimeout(flash.t);
	flash.t = setTimeout(() => {
		$('export-status').textContent = '';
		$('copy-status').textContent = '';
	}, 2500);
}

/* ----------------------------------------------------------- self-test */

function selfTest(s, built) {
	const checks = [];
	const add = (name, ok, detail) => checks.push({ name, ok, detail });

	// Ladder algebra: the ratio at the guaranteed distance is the same wherever
	// you take it, and it clears the promise. It is normally a little above the
	// promise, because the distance is a whole number of steps and so gets
	// rounded up.
	const lad = built.ladder;
	const d = lad.options.d;
	const atDistance = [];
	for (let i = 0; i + d < lad.c.length; i++) atDistance.push(lad.c[i] / lad.c[i + d]);
	const spread = atDistance.length
		? Math.max(...atDistance) - Math.min(...atDistance)
		: 0;
	const clears = atDistance.every((v) => v >= levelOf(s).text);
	add(
		'Ladder algebra',
		spread < 1e-12 && clears,
		`${fmtRatio(atDistance[0] ?? 0)} at distance ${d}, spread ${spread.toExponential(1)}`,
	);

	let decreasing = true;
	for (let i = 1; i < lad.y.length; i++) if (lad.y[i] >= lad.y[i - 1]) decreasing = false;
	add('Luminance strictly decreasing', decreasing, `${lad.y.length} steps`);

	// The reference ladder from the handoff, reproduced within 1e-4.
	const DOC = [0.77489, 0.44422, 0.2461, 0.1274, 0.05628, 0.01368];
	try {
		const ref = buildLadder({ n: 6, d: 3, target: 4.65, beta: DEFAULTS.beta, yMax: 1, yMin: 0 });
		const worst = Math.max(...ref.y.map((v, i) => Math.abs(v - DOC[i])));
		add(
			'Handoff reference ladder within 1e-4',
			worst <= 1e-4,
			`β ${DEFAULTS.beta}, max |ΔY| ${worst.toExponential(2)}`,
		);
	} catch (e) {
		add('Handoff reference ladder within 1e-4', false, e.message);
	}

	// Feasibility must name its inputs: the same d gives different answers.
	const f1 = feasibility({ n: 6, d: 3, target: 4.5, yMax: 1, yMin: 0 });
	const f2 = feasibility({ n: 6, d: 3, target: 4.65, yMax: 1, yMin: 0 });
	const f3 = feasibility({ n: 6, d: 3, target: 4.5, yMax: 0.921582, yMin: 0.007065 });
	add(
		'Feasibility depends on target and endpoints',
		f1.nMax === 7 && f2.nMax === 6 && f3.nMax === 6,
		`n_max 7 / 6 / 6`,
	);

	// Directed rounding must only ever move a step the helpful way.
	let roundingOk = true;
	for (const { scale } of built.scales) {
		for (const w of scale.swatches) {
			if (w.roundedBy === 'up' && w.y < w.targetY - 1e-12) roundingOk = false;
			if (w.roundedBy === 'down' && w.y > w.targetY + 1e-12) roundingOk = false;
		}
	}
	add('Rounding direction invariant', roundingOk, built.ladder.rounding.mode);

	// The mirror is only free when the ladder sits evenly between the tones.
	const gapTop = (built.ladder.options.yMax + 0.05) / (built.ladder.y[0] + 0.05);
	const gapBottom =
		(built.ladder.y[built.ladder.y.length - 1] + 0.05) / (built.ladder.options.yMin + 0.05);
	add(
		'Scale sits evenly between the tones',
		Math.abs(gapTop - gapBottom) < 1e-9,
		`${gapTop.toFixed(4)} vs ${gapBottom.toFixed(4)}`,
	);

	// The promise itself, on the hex values.
	const r = built.report;
	add(
		`Every pair at distance ≥ ${built.ladder.options.d}`,
		r.ok,
		r.ok ? `worst ${fmtRatio(r.byDistance[built.ladder.options.d - 1].worst)} over ${r.counts.pairs} pairs` : `${r.failures.length} failures`,
	);

	// Each distance must clear the floor the ladder promised in advance.
	const floorsOk = r.byDistance.every((row) => row.withinGuarantee);
	add('Within predicted floors', floorsOk, 'all distances');

	// Within one scale the ladder is geometric, so the same index distance is
	// the same contrast wherever you take it. That is the property the step
	// numbers rely on; the distance needed for AA is allowed to change with
	// the step count, and does.
	{
		const nominal = built.ladder.nominal;
		const r = built.ladder.r;
		const worst = Math.max(
			...nominal.map((v, i) => Math.abs(v - Math.pow(r, i + 1)) / v),
		);
		add(
			'Equal distance is equal contrast',
			worst < 1e-12,
			`${r.toFixed(3)}× per step, ${nominal.length} distances`,
		);
	}

	// Mirroring preserves index distance, which is why dark mode is covered.
	let mirrorOk = true;
	for (let i = 1; i <= s.n; i++) {
		for (let j = 1; j <= s.n; j++) {
			if (Math.abs(mirrorStep(i, s.n) - mirrorStep(j, s.n)) !== Math.abs(i - j)) mirrorOk = false;
		}
	}
	add('Mirror preserves distance', mirrorOk, `${s.n}×${s.n} index pairs`);

	// Round-trip: parse the emitted CSS back and re-prove it.
	try {
		const css = exportCss(
			built.scales.map((x) => x.scale),
			built.anchors,
			{ format: 'hex', mirror: true, layer: true, d: built.ladder.options.d, n: s.n, threshold: levelOf(s).text },
		);
		const parsed = {};
		for (const m of css.matchAll(/--([a-z0-9-]+)-(\d+):\s*light-dark\((#[0-9a-f]{6}),\s*(#[0-9a-f]{6})\)/gi)) {
			(parsed[m[1]] ??= [])[Number(m[2]) - 1] = m[3];
		}
		const names = Object.keys(parsed);
		const reScales = names.map((name) => ({
			name,
			ladderId: built.ladder.id,
			swatches: parsed[name].map((hex, i) => ({ step: i + 1, hex, y: luminance(fromHex(hex)), yError: 0 })),
		}));
		const reReport = verify({ ladder: built.ladder, scales: reScales, threshold: levelOf(s).text });
		const same =
			names.length === built.scales.length &&
			reReport.byDistance.every((row, i) => Math.abs(row.worst - r.byDistance[i].worst) < 1e-12);
		add('Export round-trip', same && reReport.ok, `${names.length} families re-verified`);
	} catch (e) {
		add('Export round-trip', false, e.message);
	}

	// Hand-editing a token must be caught. How big an edit it takes depends on
	// the headroom: the guaranteed distance is a whole number of steps, so the
	// real ratio sits a little above the promise. Rather than assume a fixed
	// nudge breaks it, walk one up until it does and report the tolerance.
	try {
		let caught = 0;
		for (let delta = 1; delta <= 80 && !caught; delta++) {
			const tampered = built.scales.map((x, idx) => {
				const sc = x.scale;
				if (idx !== 0) return sc;
				const swatches = sc.swatches.map((w, i) => {
					if (i !== 0) return w;
					const code = fromHex(w.hex).map((v) => Math.max(0, v - delta));
					return { ...w, hex: toHex(code), y: luminance(code) };
				});
				return { ...sc, swatches };
			});
			const bad = verify({
				ladder: built.ladder,
				scales: tampered,
				threshold: levelOf(s).text,
			});
			if (!bad.ok) caught = delta;
		}
		add(
			'Tampering is detected',
			caught > 0,
			caught ? `caught at ${caught} code value${caught === 1 ? '' : 's'}` : 'not caught',
		);
	} catch (e) {
		add('Tampering is detected', false, e.message);
	}

	return checks;
}

function renderChecks(checks) {
	const ul = $('checks');
	ul.textContent = '';
	for (const c of checks) {
		const li = document.createElement('li');
		li.innerHTML =
			`<span class="${c.ok ? 'pass' : 'fail'}" aria-hidden="true">${c.ok ? '✓' : '✗'}</span>` +
			`<span>${c.name}<span class="visually-hidden">: ${c.ok ? 'passed' : 'failed'}</span></span>` +
			`<span class="detail">${c.detail}</span>`;
		ul.append(li);
	}
}

/** The expensive one: a full hue sweep, behind a button. */
function runSweep(s) {
	const status = $('sweep-status');
	status.textContent = 'Running…';
	setTimeout(() => {
		try {
			const { yMax, yMin } = bounds(s);
			const ladder = buildLadder({
				n: s.n, d: built.ladder.options.d, target: effectiveTarget(s),
				beta: BETA, yMax, yMin, threshold: levelOf(s).text,
			});
			const scales = [];
			for (let hue = 0; hue < 360; hue += 3) {
				for (const cMax of [0.05, 0.12, 0.16, 0.28, 0.4]) {
					scales.push(buildScale(ladder, { name: `h${hue}c${cMax}`, hue, envelope: { kind: 'fixed', cMax } }));
				}
			}
			const rep = verify({ ladder, scales, threshold: levelOf(s).text, large: levelOf(s).large });
			status.textContent = rep.ok
				? `Pass — ${rep.counts.swatches} swatches, ${rep.counts.pairs.toLocaleString()} pairs, worst ${fmtRatio(rep.byDistance[p.d - 1].worst)} at distance ${p.d}.`
				: `FAIL — ${rep.failures.length} pairs below ${levelOf(s).text}:1.`;
			status.className = rep.ok ? 'small pass' : 'small fail';
		} catch (e) {
			status.textContent = `Could not run: ${e.message}`;
			status.className = 'small fail';
		}
	}, 16);
}

/* ------------------------------------------------------------- updating */

function update(change = {}, skipRerenderColors = false) {
	if (change.colorAt) {
		const [i, patch] = change.colorAt;
		state.colors = state.colors.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
	}
	if (change.removeColor !== undefined) {
		state.colors = state.colors.filter((_, i) => i !== change.removeColor);
		skipRerenderColors = false;
	}
	if (change.patch) Object.assign(state, change.patch);
	render(skipRerenderColors);
}

/** Blank every panel that depends on a ladder we could not build. */
function clearResults(f) {
	$('ladder').textContent = '';
	$('distance-table').textContent = '';
	$('matrix').textContent = '';
	$('checks').textContent = '';
	$('rules').textContent = '';
	$('output').textContent = '';
	$('guarantee-badge').textContent = '';
	$('sweep-status').textContent = '';
	const sum = $('verify-summary');
	sum.className = 'summary';
	sum.innerHTML =
		`<span class="badge bad">No ladder</span><p>` +
		`Nothing is verified while the settings above cannot produce a ladder` +
		(f && f.nMax ? ` — the most this configuration allows is ${f.nMax} steps.` : '.') +
		`</p>`;
}

function render(skipColors = false) {
	// Clamp the step count to what the tones can actually carry. Doing it here
	// rather than only on the slider means a stored state, a shared link or a
	// change of tone can never leave the ladder in an impossible position.
	// Below minSteps no pair is far enough apart to guarantee anything.
	const lo = minSteps(state);
	if (Number.isFinite(lo)) state.n = Math.min(Math.max(lo, state.n), MAX_STEPS);

	renderControls(state);
	const f = renderFeasibility(state);

	let built = null;
	try {
		built = buildEverything(state);
	} catch (e) {
		if (!(e instanceof InfeasibleLadderError)) throw e;
	}

	if (!built) {
		// Nothing downstream may keep showing the last good configuration:
		// a stale "Proven" panel next to an error is worse than no panel.
		if (!skipColors) renderColors(state, null);
		clearResults(f);
		render.built = null;
		persist();
		return;
	}

	if (!skipColors) renderColors(state, built);
	renderRules(state, built);
	renderLadder(state, built);
	renderVerification(state, built);
	renderExport(state, built);
	renderChecks(selfTest(state, built));
	persist();
	render.built = built;
}

/* --------------------------------------------------------------- wiring */

function bindRange(id, key, parse = Number) {
	$(id).addEventListener('input', () => update({ patch: { [key]: parse($(id).value) } }));
}

function init() {
	state = loadState();
	// Keep the distance sane if a stored state had more steps.
	state.d = Math.min(state.d, Math.max(1, state.n - 1));

	bindRange('steps', 'n');

	for (const [id, key, parse] of [
		['level', 'level', String],
		['format', 'format', String],
		['mirror', 'mirror', Number],
		['layer', 'layer', Number],
		['export-kind', 'kind', String],
		['preview', 'preview', String],
	]) {
		$(id).addEventListener('change', () => update({ patch: { [key]: parse($(id).value) } }));
	}

	for (const [pick, text, key] of [
		['anchor-bg', 'anchor-bg-text', 'bg'],
		['anchor-fg', 'anchor-fg-text', 'fg'],
	]) {
		$(pick).addEventListener('input', () => update({ patch: { [key]: $(pick).value } }));
		$(text).addEventListener('change', () => {
			const code = parseCss($(text).value);
			if (code) update({ patch: { [key]: toHex(code) } });
			else $(text).value = state[key];
		});
	}

	$('add-color').addEventListener('click', () => {
		const n = state.colors.length + 1;
		state.colors = [...state.colors, { name: `color-${n}`, css: '#7a5ea8' }];
		render();
	});

	$('copy').addEventListener('click', () => {
		if (render.built) copy(currentOutput(state, render.built), 'Copied to clipboard');
	});

	$('download').addEventListener('click', () => {
		if (!render.built) return;
		const name = `color-tokens.${state.kind === 'json' ? 'json' : 'css'}`;
		const blob = new Blob([currentOutput(state, render.built)], { type: 'text/plain' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = name;
		a.click();
		URL.revokeObjectURL(a.href);
		flash(`Downloaded ${name}`);
	});

	$('matrix-details').addEventListener('toggle', () => {
		if (render.built) renderMatrix(state, render.built);
	});

	$('run-sweep').addEventListener('click', () => runSweep(state));

	// Following the system scheme means re-labelling when the system changes.
	darkQuery.addEventListener('change', () => {
		if (state.preview === 'auto' && render.built) renderLadder(state, render.built);
	});

	window.addEventListener('hashchange', () => {
		if (suppressHash) return;
		const s = decodeState(location.hash.slice(1));
		if (s) {
			state = s;
			render();
		}
	});

	render();
}

init();
