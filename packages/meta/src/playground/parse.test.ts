import { describe, it, expect } from "vitest";

import { EXPORT_DEFAULT, ensureExportDefault } from "./parse.ts";

describe("ensureExportDefault", () => {
  it("prepends export default", () => {
    expect(ensureExportDefault("42")).toBe(`${EXPORT_DEFAULT} 42`);
  });

  it("keeps code with export default", () => {
    const code = `${EXPORT_DEFAULT} 42`;
    expect(ensureExportDefault(code)).toBe(code);
  });

  it("keeps code with export default multiline", () => {
    const code = `${EXPORT_DEFAULT}\n42`;
    expect(ensureExportDefault(code)).toBe(code);
  });
});
