import { describe, it, expect } from "vitest";
import type {
  CodegenThemeOrSubTheme,
  CodegenValidator,
} from "../codegen/model.ts";
import { createComposer } from "../composer/composer.ts";

import {
  GENERIC_EXAMPLES,
  SVELTE_KIT_EXAMPLES,
  VALIDATOR_SPECIFIC_EXAMPLES,
  VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS,
  EXAMPLE_LAYERS,
  type ExampleContent,
} from "./model.ts";

function run(
  theme: CodegenThemeOrSubTheme,
  validator: CodegenValidator,
  content: ExampleContent,
) {
  return createComposer({
    name: "test-project",
    language: "ts",
    icons: "none",
    widgets: content.widgets,
    themeOrSubTheme: theme,
    validatorWithSuffix: validator,
    sveltekit: content.sveltekit,
    extraFiles: content.files,
    extraDependencies: content.dependencies,
    codeTransformers: content.codeTransformers,
  });
}

const GENERIC_VARIANTS = [
  {
    name: "basic__ajv8",
    theme: "basic",
    validator: "ajv8",
  },
  {
    name: "shadcn4__zod4",
    theme: "shadcn4",
    validator: "zod4",
  },
] as const;

describe("generic examples", () => {
  for (const example of GENERIC_EXAMPLES) {
    describe(example, () => {
      for (const { name, theme, validator } of GENERIC_VARIANTS) {
        it(name, async () => {
          const { default: content } = await EXAMPLE_LAYERS[example]();
          expect(run(theme, validator, content)).toMatchSnapshot();
        });
      }
    });
  }
});

describe("sveltekit examples", () => {
  for (const example of SVELTE_KIT_EXAMPLES) {
    describe(example, () => {
      it("basic__ajv8", async () => {
        const { default: content } = await EXAMPLE_LAYERS[example]();
        expect(run("basic", "ajv8", content)).toMatchSnapshot();
      });
    });
  }
});

describe("validator-specific examples", () => {
  for (const example of VALIDATOR_SPECIFIC_EXAMPLES) {
    describe(example, () => {
      const validator = VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS[example];

      it("basic", async () => {
        const { default: content } = await EXAMPLE_LAYERS[example]();
        expect(run("basic", validator, content)).toMatchSnapshot();
      });
    });
  }
});
