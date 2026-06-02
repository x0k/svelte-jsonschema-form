import { describe, it, expect } from "vitest";
import {
  codegenThemeOrSubTheme,
  codegenValidators,
  codegenIconSets,
  codegenSvelteKitIntegrations,
} from "../codegen/model.ts";
import type { AbstractPackage } from "../package.ts";

import {
  createComposer,
  type ComposerOptions,
  type CodeTransformer,
} from "./composer.ts";

const BASE = {
  name: "test-project",
  language: "ts",
  themeOrSubTheme: "basic",
  icons: "none",
  validatorWithSuffix: "ajv8",
  sveltekit: "no",
} as const satisfies ComposerOptions;

function kind<O extends Partial<ComposerOptions>>(type: string, options: O) {
  return { type, options };
}

const VALIDATOR_KINDS = [
  "ajv8",
  "ajv8_precompiled",
  "zod4",
] satisfies ComposerOptions["validatorWithSuffix"][];

function* kinds() {
  for (const themeOrSubTheme of codegenThemeOrSubTheme()) {
    if (themeOrSubTheme === BASE.themeOrSubTheme) continue;
    yield kind(`theme__${themeOrSubTheme}`, { themeOrSubTheme });
  }
  for (const validatorWithSuffix of codegenValidators()) {
    if (validatorWithSuffix === BASE.validatorWithSuffix) continue;
    yield kind(`validator__${validatorWithSuffix}`, { validatorWithSuffix });
  }
  for (const icons of codegenIconSets()) {
    if (icons === BASE.icons) continue;
    yield kind(`icons__${icons}`, { icons });
  }
  for (const sveltekit of codegenSvelteKitIntegrations()) {
    if (sveltekit === "no") continue;
    for (const validatorWithSuffix of VALIDATOR_KINDS) {
      yield kind(`sveltekit__${sveltekit}__${validatorWithSuffix}`, {
        sveltekit,
        validatorWithSuffix,
      });
    }
  }
}

const testCases = Array.from(kinds());

describe("createComposer", () => {
  describe.each(testCases)("$type", ({ options }) => {
    it("matches snapshot", () => {
      const files = createComposer({ ...BASE, ...options });
      expect(files).toMatchSnapshot();
    });
  });

  describe("js language", () => {
    it("matches snapshot", () => {
      const files = createComposer({ ...BASE, language: "js" });
      expect(files).toMatchSnapshot();
    });
  });

  describe("extra files", () => {
    it("matches snapshot", () => {
      const files = createComposer({
        ...BASE,
        extraFiles: {
          "src/routes/custom.svelte": "<h1>Custom</h1>",
          "src/lib/helper.ts": "export const greet = () => 'hello';",
        },
      });
      expect(files).toMatchSnapshot();
    });
  });

  describe("extra dependencies", () => {
    it("matches snapshot", () => {
      const extraDep: AbstractPackage = {
        name: "extra-lib",
        version: "1.0.0",
        dev: false,
      };
      const files = createComposer({
        ...BASE,
        extraDependencies: [extraDep],
      });
      expect(files).toMatchSnapshot();
    });
  });

  describe("code transformers", () => {
    it("matches snapshot", () => {
      const replaceTest: CodeTransformer = (_fp, code) =>
        code.replace(/test-project/g, "transformed-project");
      const files = createComposer({
        ...BASE,
        codeTransformers: [replaceTest],
      });
      expect(files).toMatchSnapshot();
    });
  });
});
