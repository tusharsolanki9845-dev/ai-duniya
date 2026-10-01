import { describe, expect, it } from "vitest";
import { SITE } from "./site";

describe("SITE launch metadata", () => {
  it("uses real business contact values instead of placeholders", () => {
    expect(SITE.email).toMatch(/@/);
    expect(SITE.phone).not.toMatch(/99999|TODO|replace with the real number/i);
    expect(SITE.phoneHref).toMatch(/^tel:\+/i);
  });
});
