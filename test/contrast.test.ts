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
  const backgrounds = ["#ffffff", "#fcfdf9", "#edf5e9", "#fff4cd", "#f6ca45"];
  for (const bg of backgrounds) {
    assert.ok(ratio("#17382f", bg) >= 4.5, `ink on ${bg}`);
    if (bg !== "#f6ca45")
      assert.ok(ratio("#52665e", bg) >= 4.5, `muted on ${bg}`);
  }
  assert.ok(ratio("#ffffff", "#216345") >= 4.5);
  assert.ok(ratio("#ffffff", "#a52424") >= 4.5);
  assert.ok(ratio("#83948a", "#ffffff") >= 3);
});
