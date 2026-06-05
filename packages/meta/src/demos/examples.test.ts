import { describe, it, expect } from "vitest";
import type {
  CodegenNonPrecompiledValidator,
  CodegenThemeOrSubTheme,
} from "../codegen/index.ts";
import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import {
  type Example,
  EXAMPLES,
  ExampleCategory,
  nonPrecompiledValidators,
} from "./model.ts";
import { EXAMPLE_METADATA, createExampleFiles } from "./example.ts";

const BASE = { themeOrSubTheme: "basic", validator: "ajv8" } as const;

interface ExampleVariant {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenNonPrecompiledValidator;
}

function* getVariants(example: Example): Generator<ExampleVariant> {
  const isValidatorSpecific =
    EXAMPLE_METADATA[example].category === ExampleCategory.ValidatorSpecific;

  yield BASE;
  for (const t of codegenThemeOrSubTheme()) {
    if (t === BASE.themeOrSubTheme) continue;
    yield { themeOrSubTheme: t, validator: BASE.validator };
  }
  if (!isValidatorSpecific) {
    for (const v of nonPrecompiledValidators()) {
      if (v === BASE.validator) continue;
      yield { themeOrSubTheme: BASE.themeOrSubTheme, validator: v };
    }
  }
}

describe("examples", () => {
  for (const example of EXAMPLES) {
    describe(example, () => {
      const variants = Array.from(getVariants(example));
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
