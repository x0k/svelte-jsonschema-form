import { describe, it, expect } from "vitest";

import type { CodegenThemeOrSubTheme } from "../codegen/index.ts";
import { codegenThemeOrSubTheme } from "../codegen/index.ts";
import {
  EXAMPLE_ENTRIES,
  createExampleFiles,
  type ExampleEntry,
} from "./example.ts";
import { demosValidators, type DemosValidator } from "./model.ts";
interface ExampleVariant {
  themeOrSubTheme: CodegenThemeOrSubTheme;
  validator: DemosValidator["name"];
}

const BASE = {
  themeOrSubTheme: "basic",
  validator: "ajv8",
} as const satisfies ExampleVariant;

function* getVariants(entry: ExampleEntry): Generator<ExampleVariant> {
  const isValidatorSpecific = entry.meta.isValidatorSpecific ?? false;

  yield BASE;
  for (const t of codegenThemeOrSubTheme()) {
    if (t === BASE.themeOrSubTheme) continue;
    yield { themeOrSubTheme: t, validator: BASE.validator };
  }
  if (!isValidatorSpecific) {
    for (const v of demosValidators()) {
      if (v.name === BASE.validator) continue;
      yield { themeOrSubTheme: BASE.themeOrSubTheme, validator: v.name };
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
            await createExampleFiles({
              name: "sandbox",
              entry,
              themeOrSubTheme,
              validator,
            })
          ).toMatchSnapshot();
        });
      }
    });
  }
});
