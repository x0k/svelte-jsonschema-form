import { describe, it, expect } from "vitest";

import { resolveSvelteKitProject } from "./sveltekit.ts";

describe("resolveSvelteKitProject", () => {
  it("resolves an unknown range to Kit 3, not Kit 2", () => {
    const kit = resolveSvelteKitProject(undefined);

    expect(kit.pkg.name).toBe("@sjsf/sveltekit3");
    expect(kit.libPrefix).toBe("#lib");
    expect(kit.tsconfigExtends).toBe("$app/tsconfig");
    expect(kit.libImports).toStrictEqual({
      "#lib": "./src/lib/index.js",
      "#lib/*": "./src/lib/*",
    });
  });

  it.each([undefined, "", "^2.70.3", "^3.0.0"] as const)(
    "agrees with itself on every field for %s",
    (range) => {
      const kit = resolveSvelteKitProject(range);
      // `isKit3(undefined)` is false, so the fallback range has to be applied
      // before it decides any field, not just the package
      const kit3 = kit.pkg.name === "@sjsf/sveltekit3";

      expect(kit.libPrefix).toBe(kit3 ? "#lib" : "$lib");
      expect(kit.tsconfigExtends).toBe(
        kit3 ? "$app/tsconfig" : "./.svelte-kit/tsconfig.json"
      );
      expect(Object.keys(kit.libImports).length > 0).toBe(kit3);
    }
  );

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
