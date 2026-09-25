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
    bg: "#0F0F11", surface: "#17171A", elevated: "#1F1F23",
    text: "#EDEDF0", muted: "#A2A2AC", faint: "#8A8A95",
    accent: "#A78BFA", real: "#4ADE80", onAccent: "#17131F",
  },
  light: {
    bg: "#FAFAFA", surface: "#FFFFFF", elevated: "#F3F3F5",
    text: "#18181B", muted: "#52525B", faint: "#64646E",
    accent: "#6D28D9", real: "#147839", onAccent: "#FFFFFF",
  },
  // The alternate accent, verified so switching to it is a two-line change.
  "dark (cyan alt)": {
    bg: "#0F0F11", surface: "#17171A", elevated: "#1F1F23",
    text: "#EDEDF0", muted: "#A2A2AC", faint: "#8A8A95",
    accent: "#3DD9F0", real: "#4ADE80", onAccent: "#07191D",
  },
  "light (cyan alt)": {
    bg: "#FAFAFA", surface: "#FFFFFF", elevated: "#F3F3F5",
    text: "#18181B", muted: "#52525B", faint: "#64646E",
    accent: "#0E728D", real: "#147839", onAccent: "#FFFFFF",
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
