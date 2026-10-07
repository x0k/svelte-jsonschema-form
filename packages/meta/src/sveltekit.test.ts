import { describe, it, expect } from "vitest";

import { resolveSvelteKitProject } from "./sveltekit.ts";

describe("resolveSvelteKitProject", () => {
  it("resolves to the Kit 3 integration", () => {
    const kit = resolveSvelteKitProject();

    expect(kit.pkg.name).toBe("@sjsf/sveltekit3");
    expect(kit.tsconfigExtends).toBe("$app/tsconfig");
    expect(kit.libImports).toStrictEqual({
      "#lib": "./src/lib/index.js",
      "#lib/*": "./src/lib/*",
    });
  });
});
