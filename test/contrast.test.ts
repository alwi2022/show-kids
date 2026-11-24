import { test } from "node:test";
import assert from "node:assert/strict";
function luminance(hex: string) {
  const rgb = hex
    .match(/[0-9a-f]{2}/gi)!
    .map((c) => parseInt(c, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
const ratio = (a: string, b: string) => {
  const l = [luminance(a), luminance(b)].sort((a, b) => b - a);
  return (l[0] + 0.05) / (l[1] + 0.05);
};
test("design text combinations meet AA and field boundaries are visible", () => {
  const backgrounds = ["#ffffff", "#fafbff", "#eef2ff", "#f0eaff", "#e2dcff", "#dceaff", "#eee5ff", "#ece6ff"];
  for (const bg of backgrounds) {
    assert.ok(ratio("#182044", bg) >= 4.5, `ink on ${bg}`);
    assert.ok(ratio("#526080", bg) >= 4.5, `muted on ${bg}`);
  }
  for (const stop of ["#2552d9", "#7042df"])
    assert.ok(ratio("#ffffff", stop) >= 4.5);
  for (const stop of ["#07152f", "#172454", "#291950", "#303877"]) {
    assert.ok(ratio("#d8e2ff", stop) >= 4.5);
    assert.ok(ratio("#b8ccff", stop) >= 4.5);
  }
  assert.ok(ratio("#ffffff", "#a52424") >= 4.5);
  assert.ok(ratio("#8791ac", "#ffffff") >= 3);
  for (const text of ["#d8e8ff", "#91baff", "#c8b2ff", "#bfc5d5"]) {
    assert.ok(ratio(text, "#06070c") >= 4.5, `hero text ${text}`);
  }
  assert.ok(ratio("#bfc5d5", "#10121b") >= 4.5);
});
