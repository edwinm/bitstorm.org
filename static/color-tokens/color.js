/**
 * Color primitives: sRGB <-> linear <-> Oklab <-> OKLCH, gamut clamping and
 * WCAG 2 relative luminance.
 *
 * Hand-written on purpose. There is no bundler here to resolve a bare import
 * and the site CSP (script-src 'self') blocks every CDN, so a library is not
 * an option. It is also the better choice: the contrast guarantee depends on
 * the exact behavior of the gamut clamp, and that is not something to inherit
 * from a dependency whose bisection depth is not part of its public contract.
 *
 * Matrices from Björn Ottosson, https://bottosson.github.io/posts/oklab/
 */

/** Shared by the solver and the exporter. A mismatch here shifts a channel by
 *  one code value, which is exactly the size of error the guarantee lives on. */
export const GAMUT_EPS = 1e-7;

/* ---------------------------------------------------------------- transfer */

export function srgbToLinear(c) {
	return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function linearToSrgb(c) {
	return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

/* ------------------------------------------------------------------ Oklab */

export function linearToOklab(r, g, b) {
	const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
	const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
	const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

	const l_ = Math.cbrt(l);
	const m_ = Math.cbrt(m);
	const s_ = Math.cbrt(s);

	return [
		0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
		1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
		0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
	];
}

export function oklabToLinear(L, a, b) {
	const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = L - 0.0894841775 * a - 1.291485548 * b;

	const l = l_ * l_ * l_;
	const m = m_ * m_ * m_;
	const s = s_ * s_ * s_;

	return [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	];
}

export function oklchToOklab(l, c, h) {
	const rad = (h * Math.PI) / 180;
	return [l, c * Math.cos(rad), c * Math.sin(rad)];
}

export function oklabToOklch(L, a, b) {
	const c = Math.sqrt(a * a + b * b);
	let h = (Math.atan2(b, a) * 180) / Math.PI;
	if (h < 0) h += 360;
	return [L, c, c < 1e-7 ? 0 : h];
}

/* ------------------------------------------------------------------ gamut */

function inGamut([r, g, b]) {
	return (
		r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS &&
		g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS &&
		b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS
	);
}

/**
 * Reduce chroma until the color fits in sRGB, keeping L and h. Returns the
 * clamped OKLCH triple plus the linear RGB it resolves to.
 */
export function clampChromaToGamut(l, c, h) {
	let lin = oklabToLinear(...oklchToOklab(l, c, h));
	if (inGamut(lin)) return { l, c, h, lin };

	let lo = 0;
	let hi = c;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		const candidate = oklabToLinear(...oklchToOklab(l, mid, h));
		if (inGamut(candidate)) lo = mid;
		else hi = mid;
	}
	lin = oklabToLinear(...oklchToOklab(l, lo, h));
	return { l, c: lo, h, lin };
}

/* ------------------------------------------------------------- quantizing */

const clamp255 = (v) => (v < 0 ? 0 : v > 255 ? 255 : v);

/**
 * Linear RGB -> 8-bit codes. `dir` is 'up', 'down' or 'nearest' and applies to
 * every channel, which is what makes the rounding monotone in luminance.
 */
export function quantize(lin, dir) {
	const out = [0, 0, 0];
	for (let i = 0; i < 3; i++) {
		const s = linearToSrgb(Math.min(1, Math.max(0, lin[i]))) * 255;
		// The epsilons guard values sitting exactly on a code boundary, where
		// ceil/floor would otherwise swing a whole step on the last bit.
		const v =
			dir === 'up' ? Math.ceil(s - 1e-9)
			: dir === 'down' ? Math.floor(s + 1e-9)
			: Math.round(s);
		out[i] = clamp255(v);
	}
	return out;
}

/* ------------------------------------------------------------------ WCAG */

const LIN_TABLE = new Float64Array(256);
for (let i = 0; i < 256; i++) LIN_TABLE[i] = srgbToLinear(i / 255);

/** WCAG 2 relative luminance from an 8-bit triple. Never from floats. */
export function luminance(code) {
	return (
		0.2126 * LIN_TABLE[code[0]] +
		0.7152 * LIN_TABLE[code[1]] +
		0.0722 * LIN_TABLE[code[2]]
	);
}

export function contrast(y1, y2) {
	const hi = Math.max(y1, y2) + 0.05;
	const lo = Math.min(y1, y2) + 0.05;
	return hi / lo;
}

/* ------------------------------------------------------------ hex & parse */

const hex2 = (v) => v.toString(16).padStart(2, '0');

export function toHex(code) {
	return `#${hex2(code[0])}${hex2(code[1])}${hex2(code[2])}`;
}

export function fromHex(hex) {
	const s = hex.trim().replace(/^#/, '');
	const full =
		s.length === 3 ? s.split('').map((ch) => ch + ch).join('') : s;
	if (!/^[0-9a-f]{6}$/i.test(full)) return null;
	const n = parseInt(full, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function codeToOklch(code) {
	const lin = code.map((v) => LIN_TABLE[v]);
	return oklabToOklch(...linearToOklab(lin[0], lin[1], lin[2]));
}

const NAMED = {
	black: '#000000', white: '#ffffff', red: '#ff0000', green: '#008000',
	blue: '#0000ff', yellow: '#ffff00', cyan: '#00ffff', magenta: '#ff00ff',
	gray: '#808080', gray: '#808080', orange: '#ffa500', purple: '#800080',
	navy: '#000080', teal: '#008080', olive: '#808000', maroon: '#800000',
	silver: '#c0c0c0', lime: '#00ff00', aqua: '#00ffff', fuchsia: '#ff00ff',
};

/**
 * Accepts hex, rgb(), oklch(), oklab() and a handful of named colors.
 * Returns an 8-bit code, or null when it cannot be understood.
 * Alpha is deliberately not supported — the guarantee only covers opaque colors.
 */
export function parseCss(input) {
	if (!input) return null;
	const str = String(input).trim().toLowerCase();

	if (NAMED[str]) return fromHex(NAMED[str]);
	if (str.startsWith('#')) return fromHex(str);

	const rgb = str.match(/^rgba?\(([^)]+)\)$/);
	if (rgb) {
		const parts = rgb[1].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
		if (parts.length !== 3) return null;
		const code = parts.map((p) =>
			p.endsWith('%')
				? clamp255(Math.round((parseFloat(p) / 100) * 255))
				: clamp255(Math.round(parseFloat(p))),
		);
		return code.some(Number.isNaN) ? null : code;
	}

	const ok = str.match(/^(oklch|oklab)\(([^)]+)\)$/);
	if (ok) {
		const parts = ok[2].split(/[\s,/]+/).filter(Boolean).slice(0, 3);
		if (parts.length !== 3) return null;
		const l = parts[0].endsWith('%')
			? parseFloat(parts[0]) / 100
			: parseFloat(parts[0]);
		const second = parseFloat(parts[1]);
		const third = parts[2] === 'none' ? 0 : parseFloat(parts[2]);
		if ([l, second, third].some(Number.isNaN)) return null;
		const lin =
			ok[1] === 'oklch'
				? clampChromaToGamut(l, second, third).lin
				: oklabToLinear(l, second, third);
		return quantize(lin, 'nearest');
	}

	return null;
}
