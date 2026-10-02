import { describe, it, expect } from "vitest";

import { resolveSvelteKitProject } from "./sveltekit.ts";

describe("resolveSvelteKitProject", () => {
  it("defaults to Kit 3 when the range is unknown", () => {
    const kit = resolveSvelteKitProject();

    expect(kit.pkg.name).toBe("@sjsf/sveltekit3");
    expect(kit.libPrefix).toBe("#lib");
    expect(kit.tsconfigExtends).toBe("$app/tsconfig");
    expect(kit.libImports).toStrictEqual({
      "#lib": "./src/lib/index.js",
      "#lib/*": "./src/lib/*",
    });
  });

  it.each([
    ["^2.70.3", "@sjsf/sveltekit", "$lib", "./.svelte-kit/tsconfig.json"],
    ["~2.0.0", "@sjsf/sveltekit", "$lib", "./.svelte-kit/tsconfig.json"],
    ["^3.0.0", "@sjsf/sveltekit3", "#lib", "$app/tsconfig"],
    [">=3.1.0", "@sjsf/sveltekit3", "#lib", "$app/tsconfig"],
    ["next", "@sjsf/sveltekit3", "#lib", "$app/tsconfig"],
  ] as const)("resolves %s to %s", (range, pkg, prefix, tsconfig) => {
    const kit = resolveSvelteKitProject(range);

    expect(kit.pkg.name).toBe(pkg);
    expect(kit.libPrefix).toBe(prefix);
    expect(kit.tsconfigExtends).toBe(tsconfig);
  });

  it("only emits `imports` for the version that needs them", () => {
    expect(resolveSvelteKitProject("^2.70.3").libImports).toStrictEqual({});
    expect(resolveSvelteKitProject("^3.0.0").libImports).not.toStrictEqual({});
  });
});
