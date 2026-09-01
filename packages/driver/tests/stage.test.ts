import { describe, expect, it } from "vitest";
import { generateStageSvgPathString } from "../src/stage";

// Pure geometry of the overlay cutout. The rendered overlays built on top of
// it are covered in overlay.test.ts (tour) and hints.test.ts (hints).

const stage = { x: 100, y: 100, width: 200, height: 50 };

describe("generateStageSvgPathString", () => {
  it("opens with a rect covering the whole viewport", () => {
    const path = generateStageSvgPathString(stage, { padding: 0, radius: 0 });
    const { innerWidth: w, innerHeight: h } = window;

    expect(path.startsWith(`M${w},0L0,0L0,${h}L${w},${h}L${w},0Z`)).toBe(true);
  });

  it("clamps the radius when the stage is too small for it", () => {
    const tiny = { x: 0, y: 0, width: 10, height: 10 };
    const path = generateStageSvgPathString(tiny, { padding: 0, radius: 20 });

    expect(path).toContain("a5,5");
    expect(path).not.toContain("a20,20");
  });

  it("floors a negative radius at zero", () => {
    const path = generateStageSvgPathString(stage, { padding: 0, radius: -5 });

    expect(path).toContain("a0,0");
  });

  it("returns full viewport rectangle with no cutout subpaths when stage size is zero", () => {
    const zeroStage = { x: 50, y: 50, width: 0, height: 0 };
    const path = generateStageSvgPathString(zeroStage, { padding: 0, radius: 0, isDummy: true });
    const { innerWidth: w, innerHeight: h } = window;

    expect(path).toBe(`M${w},0L0,0L0,${h}L${w},${h}L${w},0Z`);
  });
});
