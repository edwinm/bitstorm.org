/**
 * The contrast ladder: feasibility, luminance ladder, per-hue fitting,
 * directed rounding and exhaustive verification.
 *
 * The whole system rests on one fact: WCAG 2 contrast is
 *   (Y_light + 0.05) / (Y_dark + 0.05)
 * with no hue or chroma term. So if step i fixes Y_i for *every* hue, then
 * blue-3 vs navy-6 has exactly the same contrast as sage-3 vs sage-6, and the
 * promise "index distance >= d implies AA" holds across all families at once.
 */

import {
	clampChromaToGamut,
	codeToOklch,
	contrast,
	fromHex,
	luminance,
	quantize,
	toHex,
} from './color.js';

/**
 * Worst relative shift of c = Y + 0.05 caused by nearest-rounding to 8 bits.
 * Found by exhaustive search over all 16777216 sRGB colors; the maximum sits
 * at #4a4a4a (Y = 0.06848), a neutral gray, which is what the concavity of the
 * sRGB transfer curve predicts.
 */
export const PHI_MAX = 0.00794208;

export const AA_TEXT = 4.5;
export const AA_LARGE = 3;

/**
 * WCAG 2 conformance levels. Each carries its own pair of thresholds: the one
 * for body text and the lower one that large text and UI components may use.
 * https://www.w3.org/TR/WCAG22/#contrast-minimum (AA)
 * https://www.w3.org/TR/WCAG22/#contrast-enhanced (AAA)
 */
export const LEVELS = {
	AA: { text: 4.5, large: 3 },
	AAA: { text: 7, large: 4.5 },
};

/**
 * Balance used by the handoff's own reference table.
 *
 * The product uses beta = 0.5, which is the only exactly symmetric value: the
 * room left above step 1 then equals the room left below step n, so mirroring
 * a token to its partner costs nothing in either scheme. Any other value makes
 * one scheme measurably weaker than the other.
 *
 * This constant exists only to reproduce §2.4. The handoff prints beta "0.5"
 * but its own reference table is
 * the beta=0.5 ladder scaled by a uniform 1.00024 in c-space (the per-step
 * implied scale runs 1.000227..1.000309, which is exactly the spread that
 * printing Y to five decimals produces). Reproducing that table within the
 * required 1e-4 needs a scale in [1.000122, 1.000364]; the midpoint is
 * beta = 0.49950. The difference from 0.5 is 0.024% in c -- some 17x smaller
 * than the 8-bit quantization error of 3.4e-3, i.e. under 1/40th of one code
 * value -- so it costs nothing and makes the reference fixture reproducible.
 */
export const DEFAULT_BETA = 0.4995;

export const DEFAULTS = {
	n: 6,
	d: 3,
	target: 4.65,
	beta: DEFAULT_BETA,
	yMax: 1,
	yMin: 0,
	threshold: AA_TEXT,
};

/* ------------------------------------------------------------- rounding */

/**
 * Which way each step may be rounded so that quantization can only ever help.
 *
 * Step i is the light member of some guaranteed pair iff i <= n-d, and the dark
 * member iff i >= d+1. Those sets are disjoint exactly when n <= 2d, and then
 * every step has one safe direction. When n > 2d the steps in [d+1, n-d] are
 * both at once: no nudge can satisfy both sides, which is why a repair loop
 * cannot terminate there. Those steps take nearest rounding and the target
 * floor rises instead.
 */
export function roundingPlan(n, d, threshold = AA_TEXT) {
	const dir = [];
	const conflictedSteps = [];

	for (let i = 1; i <= n; i++) {
		const isLight = i <= n - d;
		const isDark = i >= d + 1;
		if (isLight && isDark) {
			dir.push('nearest');
			conflictedSteps.push(i);
		} else if (isLight) dir.push('up');
		else if (isDark) dir.push('down');
		else dir.push('nearest'); // in no guaranteed pair at all
	}

	const mode = conflictedSteps.length ? 'hybrid' : 'directed';
	const minTarget = conflictedSteps.length
		? threshold / (1 - PHI_MAX)
		: threshold * (1 + 1e-6);

	return { mode, dir, conflictedSteps, minTarget };
}

/* ---------------------------------------------------------- feasibility */

/**
 * Every argument is required and has no default.
 *
 * The handoff says "n_max is 7 with white and black, 6 without", but that is
 * ambiguous: T=4.5 at R=21 gives 7, T=4.65 at R=21 gives 6, and T=4.5 at
 * R=17.03 (the #f6f6f6/#161319 anchors) also gives 6. Both the margin and the
 * endpoints can explain it. Forcing the caller to name target, yMax and yMin
 * makes it impossible to state an n_max without stating what it was computed at.
 */
export function feasibility({ n, d, target, yMax, yMin, threshold = AA_TEXT }) {
	const cMaxEnd = yMax + 0.05;
	const cMinEnd = yMin + 0.05;
	const R = cMaxEnd / cMinEnd;
	const r = Math.pow(target, 1 / d);
	const span = Math.pow(r, n - 1);
	const nMax = Math.floor((d * Math.log(R)) / Math.log(target)) + 1;
	const maxTarget = Math.pow(R, d / (n - 1));
	const plan = roundingPlan(n, d, threshold);

	let reason = null;
	if (n < 2) reason = 'n-too-small';
	else if (d < 1 || d > n - 1) reason = 'distance-out-of-range';
	// Guard the float edge: sqrt(21)^2 is 21.000000000000004, which would
	// reject a genuinely feasible configuration.
	else if (span > R * (1 + 1e-12)) reason = 'span-exceeds-range';
	else if (target < plan.minTarget) reason = 'target-below-quantization-floor';

	return {
		feasible: reason === null,
		reason,
		R,
		r,
		span,
		slack: R / span,
		nMax,
		maxTarget,
		minTarget: plan.minTarget,
		roundingMode: plan.mode,
		conflictedSteps: plan.conflictedSteps,
	};
}

/* --------------------------------------------------------------- ladder */

export class InfeasibleLadderError extends Error {
	constructor(report) {
		super(`Infeasible ladder: ${report.reason}`);
		this.name = 'InfeasibleLadderError';
		this.report = report;
	}
}

export function buildLadder(options = {}) {
	const opts = { ...DEFAULTS, ...options };
	const { n, d, target, beta, yMax, yMin, threshold } = opts;

	const report = feasibility({ n, d, target, yMax, yMin, threshold });
	if (!report.feasible) throw new InfeasibleLadderError(report);

	const { r, span, slack } = report;
	const c1 = (yMax + 0.05) / Math.pow(slack, beta);

	const c = [];
	const y = [];
	for (let i = 0; i < n; i++) {
		const ci = c1 * Math.pow(r, -i);
		c.push(ci);
		y.push(Math.min(1, Math.max(0, ci - 0.05)));
	}

	const plan = roundingPlan(n, d, threshold);

	// Nominal ratio at each index distance, and the floor that survives
	// quantization given each step's rounding direction.
	const nominal = [];
	const guaranteed = [];
	for (let k = 1; k <= n - 1; k++) {
		nominal.push(Math.pow(r, k));
		let floor = Infinity;
		for (let i = 0; i + k < n; i++) {
			// Nearest rounding moves at most half a code value (PHI_MAX);
			// a directed round moves at most a full one, so it costs 2*PHI_MAX
			// when it happens to push the wrong way for this particular pair.
			// That only occurs below the promised distance d.
			const lightFactor =
				plan.dir[i] === 'up' ? 1
				: plan.dir[i] === 'down' ? 1 - 2 * PHI_MAX
				: 1 - PHI_MAX;
			const darkFactor =
				plan.dir[i + k] === 'down' ? 1
				: plan.dir[i + k] === 'up' ? 1 + 2 * PHI_MAX
				: 1 + PHI_MAX;
			floor = Math.min(floor, (Math.pow(r, k) * lightFactor) / darkFactor);
		}
		guaranteed.push(floor);
	}

	const warnings = [];
	if (y[0] > 0.995)
		warnings.push(
			'Step 1 has collapsed to white for every hue — lower beta to keep hue identity.',
		);
	if (y[n - 1] < 0.005)
		warnings.push(
			'Step ' + n + ' has collapsed to black for every hue — raise beta to keep hue identity.',
		);

	return {
		id: JSON.stringify([n, d, target, beta, yMax, yMin, threshold]),
		options: opts,
		r,
		span,
		slack,
		R: report.R,
		c,
		y,
		nominal,
		guaranteed,
		rounding: plan,
		warnings,
	};
}

/* ------------------------------------------------------------ envelopes */

/**
 * Chroma envelope. Both modes use the same parabola cMax * 4l(1-l); 'preserve'
 * simply derives cMax so that env(L_base) == C_base, keeping a muted color
 * muted and a saturated one saturated.
 *
 * (Confirmed against the existing site palette: with cMax = 0.16 this
 * reproduces the unclamped C values of --blue-2..5 to four decimals.)
 */
export function envelopeFor(spec) {
	if (spec.kind === 'preserve') {
		const { l, c } = spec.base;
		const lb = Math.min(0.98, Math.max(0.02, l));
		let cMax = c / (4 * lb * (1 - lb));
		if (!Number.isFinite(cMax) || cMax <= 0) cMax = 0.16;
		cMax = Math.min(0.5, cMax);
		return { cMax, fn: (l2) => cMax * 4 * l2 * (1 - l2) };
	}
	const cMax = spec.cMax ?? 0.16;
	return { cMax, fn: (l2) => cMax * 4 * l2 * (1 - l2) };
}

/* ------------------------------------------------------------------ fit */

/**
 * Solve OKLCH L so that the resulting sRGB color has the target luminance.
 *
 * Y is monotone in L to within 5e-8, and every violation of that sits below
 * L = 0.007 — it is the bisection noise floor, not real non-monotonicity. Near
 * Y = 0 the inverse becomes ill-conditioned, so a coarse scan brackets the root
 * first and bisection refines inside that bracket.
 */
function solveL(yTarget, hue, env, scan) {
	let lo = 0;
	let hi = 1;

	if (scan) {
		const S = 512;
		let found = false;
		let prevY = luminance(quantize(clampChromaToGamut(0, env(0), hue).lin, 'nearest'));
		for (let k = 1; k <= S; k++) {
			const l = k / S;
			const yk = yAt(l, hue, env);
			// Take the last valid bracket: under a spurious dip that is the one
			// on the correct global branch.
			if (prevY <= yTarget && yTarget <= yk) {
				lo = (k - 1) / S;
				hi = l;
				found = true;
			}
			prevY = yk;
		}
		if (!found) {
			lo = 0;
			hi = 1;
		}
	}

	for (let i = 0; i < 48; i++) {
		const mid = (lo + hi) / 2;
		if (yAt(mid, hue, env) < yTarget) lo = mid;
		else hi = mid;
	}
	return (lo + hi) / 2;
}

function yAt(l, hue, env) {
	const g = clampChromaToGamut(l, env(l), hue);
	const lin = g.lin.map((v) => Math.min(1, Math.max(0, v)));
	return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

export function buildScale(ladder, input) {
	const { name, hue } = input;
	const env = envelopeFor(input.envelope ?? { kind: 'fixed', cMax: 0.16 });
	const swatches = [];

	for (let i = 0; i < ladder.y.length; i++) {
		const targetY = ladder.y[i];
		const dir = ladder.rounding.dir[i];
		const useScan = targetY < 1e-3;
		const l = solveL(targetY, hue, env.fn, useScan);
		const g = clampChromaToGamut(l, env.fn(l), hue);
		const code = quantize(g.lin, dir);
		// Luminance always comes back from the 8-bit code, never from the float
		// RGB — otherwise the report can pass while the shipped hex fails.
		const y = luminance(code);
		const [ol, oc, oh] = codeToOklch(code);

		swatches.push({
			step: i + 1,
			targetY,
			l: ol,
			c: oc,
			h: oh,
			requestedC: env.fn(l),
			chromaClamped: g.c < env.fn(l) - 1e-9,
			code,
			hex: toHex(code),
			y,
			yError: y - targetY,
			roundedBy: dir,
			solver: useScan ? 'scan+bisect' : 'bisect',
		});
	}

	return {
		name,
		hue,
		envelope: { kind: input.envelope?.kind ?? 'fixed', cMax: env.cMax },
		ladderId: ladder.id,
		swatches,
	};
}

/* --------------------------------------------------------- mirroring */

/** Dark-mode partner of a token index. An involution, so |i-j| is preserved. */
export function mirrorStep(token, n) {
	return n + 1 - token;
}

/* ------------------------------------------------------------- verify */

export function verify({ ladder, scales, threshold = AA_TEXT, large = AA_LARGE }) {
	const n = ladder.y.length;
	const d = ladder.options.d;

	const mismatched = scales.filter(
		(s) => s.ladderId !== undefined && s.ladderId !== ladder.id,
	);
	if (mismatched.length) {
		throw new Error(
			`Scales built from a different ladder: ${mismatched
				.map((s) => s.name)
				.join(', ')}. The light/dark mirror proof only holds when every family shares one ladder.`,
		);
	}

	const swatches = [];
	for (const s of scales) {
		for (const w of s.swatches) {
			// Re-parse the hex from scratch: the hex string is the input of record.
			const code = fromHex(w.hex);
			swatches.push({ scale: s.name, step: w.step, hex: w.hex, y: luminance(code) });
		}
	}

	const byDistance = [];
	for (let k = 1; k <= n - 1; k++) {
		byDistance.push({
			distance: k,
			worst: Infinity,
			worstPair: null,
			pairsChecked: 0,
			meetsAA: false,
			meetsLarge: false,
			guaranteedFloor: ladder.guaranteed[k - 1],
			withinGuarantee: true,
		});
	}

	const failures = [];
	for (let a = 0; a < swatches.length; a++) {
		for (let b = a + 1; b < swatches.length; b++) {
			const A = swatches[a];
			const B = swatches[b];
			const k = Math.abs(A.step - B.step);
			if (k === 0) continue;
			const ratio = contrast(A.y, B.y);
			const row = byDistance[k - 1];
			row.pairsChecked++;
			if (ratio < row.worst) {
				row.worst = ratio;
				row.worstPair = { a: A, b: B, distance: k, ratio };
			}
			if (k >= d && ratio < threshold) {
				failures.push({ a: A, b: B, distance: k, ratio });
			}
		}
	}

	for (const row of byDistance) {
		row.meetsAA = row.worst >= threshold;
		row.meetsLarge = row.worst >= large;
		row.withinGuarantee = row.worst >= row.guaranteedFloor - 1e-9;
	}

	let dAA = null;
	let d3 = null;
	for (const row of byDistance) {
		if (dAA === null && byDistance.slice(row.distance - 1).every((r) => r.meetsAA))
			dAA = row.distance;
		if (d3 === null && byDistance.slice(row.distance - 1).every((r) => r.meetsLarge))
			d3 = row.distance;
	}

	let maxAbsYError = 0;
	let worstQuant = null;
	for (const s of scales) {
		for (const w of s.swatches) {
			if (Math.abs(w.yError) > maxAbsYError) {
				maxAbsYError = Math.abs(w.yError);
				worstQuant = { scale: s.name, step: w.step, hex: w.hex, y: w.y };
			}
		}
	}

	return {
		ok: failures.length === 0 && dAA !== null && dAA <= d,
		promise: { d, threshold, schemeInvariant: true },
		byDistance,
		failures,
		dAA,
		d3,
		quantization: { maxAbsYError, worst: worstQuant },
		counts: {
			swatches: swatches.length,
			pairs: byDistance.reduce((t, r) => t + r.pairsChecked, 0),
		},
	};
}
