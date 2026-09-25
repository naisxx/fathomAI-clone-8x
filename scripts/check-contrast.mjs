/**
 * WCAG AA verification for the design tokens.
 *
 * Run before adopting any palette change:  node scripts/check-contrast.mjs
 *
 * This exists because a contrast failure shipped once already: --text-faint
 * measured 4.07:1 in dark and 3.33:1 in light while looking perfectly fine.
 * Eyes are not a contrast checker.
 */
const lin = (c) => ((c /= 255), c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const L = (h) => {
  const v = h.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const cr = (a, b) => {
  const [x, y] = [L(a), L(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const mix = (fg, bg, a) => {
  const f = fg.replace("#", ""), b = bg.replace("#", "");
  const ch = (i) => Math.round(a * parseInt(f.slice(i, i + 2), 16) + (1 - a) * parseInt(b.slice(i, i + 2), 16));
  return "#" + [0, 2, 4].map((i) => ch(i).toString(16).padStart(2, "0")).join("");
};

const THEMES = {
  dark: {
    bg: "#121110", surface: "#1B1917", elevated: "#232120",
    text: "#F4F0EA", muted: "#B3AAA0", faint: "#91887D",
    accent: "#E0A458", real: "#78BE8A", onAccent: "#1A1512",
  },
  light: {
    bg: "#FBF9F5", surface: "#FFFFFF", elevated: "#F5F1EA",
    text: "#1A1714", muted: "#5B5349", faint: "#6E655A",
    accent: "#8B5813", real: "#2C774A", onAccent: "#FFFFFF",
  },
};

const AA = 4.5;
let failures = 0;

for (const [name, p] of Object.entries(THEMES)) {
  console.log(`\n=== ${name} ===`);
  const surfaces = ["bg", "surface", "elevated"];
  for (const fg of ["text", "muted", "faint", "accent", "real"]) {
    for (const s of surfaces) {
      const r = cr(p[fg], p[s]);
      const ok = r >= AA;
      if (!ok) failures++;
      console.log(`  ${fg.padEnd(7)} on ${s.padEnd(9)} ${r.toFixed(2)}  ${ok ? "pass" : "FAIL"}`);
    }
  }
  for (const key of ["accent", "real"]) {
    const tint = mix(p[key], p.surface, 0.14);
    const r = cr(p[key], tint);
    if (r < AA) failures++;
    console.log(`  ${key.padEnd(7)} on its tint ${tint}  ${r.toFixed(2)}  ${r >= AA ? "pass" : "FAIL"}`);
  }
  const r = cr(p.onAccent, p.accent);
  if (r < AA) failures++;
  console.log(`  label   on accent    ${r.toFixed(2)}  ${r >= AA ? "pass" : "FAIL"}`);
}

console.log(failures === 0 ? "\nAll pairs clear AA (4.5:1)." : `\n${failures} FAILURE(S)`);
process.exit(failures === 0 ? 0 : 1);
