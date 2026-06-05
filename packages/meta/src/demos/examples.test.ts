import { describe, it, expect } from "vitest";
import type {
  CodegenNonPrecompiledValidator,
  CodegenThemeOrSubTheme,
} from "../codegen/index.ts";
import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import { nonPrecompiledValidators } from "./model.ts";
import {
  EXAMPLE_ENTRIES,
  createExampleFiles,
  type ExampleEntry,
} from "./example.ts";

const BASE = { themeOrSubTheme: "basic", validator: "ajv8" } as const;

interface ExampleVariant {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: CodegenNonPrecompiledValidator;
}

function* getVariants(entry: ExampleEntry): Generator<ExampleVariant> {
  const isValidatorSpecific = entry.meta.isValidatorSpecific ?? false;

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
  for (const entry of EXAMPLE_ENTRIES) {
    describe(entry.path, () => {
      const variants = Array.from(getVariants(entry));
      for (const { themeOrSubTheme, validator } of variants) {
        it(`${themeOrSubTheme}__${validator}`, async () => {
          expect(
            await createExampleFiles({ entry, themeOrSubTheme, validator }),
          ).toMatchSnapshot();
        });
      }
    });
  }
});
