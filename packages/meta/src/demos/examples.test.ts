import { describe, it, expect } from "vitest";
import type {
  CodegenThemeOrSubTheme,
  CodegenValidator,
} from "../codegen/index.ts";
import { codegenThemeOrSubTheme, codegenValidators } from "../codegen/index.ts";

import {
  GENERIC_EXAMPLES,
  SVELTE_KIT_EXAMPLES,
  VALIDATOR_SPECIFIC_EXAMPLES,
  VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS,
  createExampleFiles,
} from "./model.ts";

const BASE = { themeOrSubTheme: "basic", validator: "ajv8" } as const;

interface ExampleVariant {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenValidator;
}

function* getGenericExampleVariants(): Generator<ExampleVariant> {
  yield BASE;
  for (const t of codegenThemeOrSubTheme()) {
    if (t === BASE.themeOrSubTheme) continue;
    yield { themeOrSubTheme: t, validator: BASE.validator };
  }
  for (const v of codegenValidators()) {
    if (v === BASE.validator) continue;
    yield { themeOrSubTheme: BASE.themeOrSubTheme, validator: v };
  }
}

function* getSvelteKitExampleVariants(): Generator<ExampleVariant> {
  yield BASE;
  for (const t of codegenThemeOrSubTheme()) {
    if (t === BASE.themeOrSubTheme) continue;
    yield { themeOrSubTheme: t, validator: BASE.validator };
  }
  for (const v of codegenValidators()) {
    if (v === BASE.validator) continue;
    yield { themeOrSubTheme: BASE.themeOrSubTheme, validator: v };
  }
}

function* getValidatorSpecificExampleVariants(): Generator<ExampleVariant> {
  yield BASE;
  for (const t of codegenThemeOrSubTheme()) {
    if (t === BASE.themeOrSubTheme) continue;
    yield { themeOrSubTheme: t, validator: BASE.validator };
  }
}

describe("generic examples", () => {
  const variants = Array.from(getGenericExampleVariants());
  for (const example of GENERIC_EXAMPLES) {
    describe(example, () => {
      for (const { themeOrSubTheme, validator } of variants) {
        it(`${themeOrSubTheme}__${validator}`, async () => {
          expect(
            await createExampleFiles({ example, themeOrSubTheme, validator }),
          ).toMatchSnapshot();
        });
      }
    });
  }
});

describe("sveltekit examples", () => {
  const variants = Array.from(getSvelteKitExampleVariants());
  for (const example of SVELTE_KIT_EXAMPLES) {
    describe(example, () => {
      for (const { themeOrSubTheme, validator } of variants) {
        it(`${themeOrSubTheme}__${validator}`, async () => {
          expect(
            await createExampleFiles({ example, themeOrSubTheme, validator }),
          ).toMatchSnapshot();
        });
      }
    });
  }
});

describe("validator-specific examples", () => {
  const variants = Array.from(getValidatorSpecificExampleVariants());
  for (const example of VALIDATOR_SPECIFIC_EXAMPLES) {
    describe(example, () => {
      for (const { themeOrSubTheme } of variants) {
        const validator = VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS[example];
        it(themeOrSubTheme, async () => {
          expect(
            await createExampleFiles({ example, themeOrSubTheme, validator }),
          ).toMatchSnapshot();
        });
      }
    });
  }
});
