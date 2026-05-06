import { expect } from "vitest";
import { NonLegacyThemeOrSubTheme, Validator } from "meta";

import addon from "../src/index.js";
import {
  iconOptions,
  ICONS_NONE_OPTION_VALUE,
  SVELTE_KIT_INTEGRATION_NO_OPTION_VALUE,
  SVELTE_KIT_INTEGRATION_OPTIONS,
  themeOrSubThemeOptions,
  validatorOptions,
} from "../src/model";
import { snapshotFs } from "./setup/snapshot-fs.js";
import { setupSnapshotTest } from "./setup/snapshot-suit";

function values<T>(options: Iterable<{ value: T; label: string }>): T[] {
  return Array.from(options, (o) => o.value);
}

const DEFAULT_THEME = "basic" satisfies NonLegacyThemeOrSubTheme;
const DEFAULT_VALIDATOR = "ajv8" satisfies Validator;
const DEFAULT_ICONS = ICONS_NONE_OPTION_VALUE;
const DEFAULT_SVELTEKIT = SVELTE_KIT_INTEGRATION_NO_OPTION_VALUE;

type ValidatorOptionValue = (ReturnType<
  typeof validatorOptions
> extends Generator<infer V>
  ? V
  : never)["value"];

const FOCUSED_VALIDATORS = [
  "ajv8",
  "ajv8-precompiled",
  "zod4",
] satisfies ValidatorOptionValue[];
const FOCUSED_SVELTEKIT = values(SVELTE_KIT_INTEGRATION_OPTIONS);

function* kinds() {
  for (const themeOrSubTheme of values(themeOrSubThemeOptions())) {
    yield {
      type: `theme__${themeOrSubTheme}`,
      options: {
        [addon.id]: {
          themeOrSubTheme,
          icons: ICONS_NONE_OPTION_VALUE,
          validatorWithSuffix: DEFAULT_VALIDATOR,
          sveltekit: DEFAULT_SVELTEKIT,
        } as const,
      },
    };
  }
  for (const icons of values(iconOptions())) {
    yield {
      type: `icons__${icons}`,
      options: {
        [addon.id]: {
          themeOrSubTheme: DEFAULT_THEME,
          icons,
          validatorWithSuffix: DEFAULT_VALIDATOR,
          sveltekit: DEFAULT_SVELTEKIT,
        } as const,
      },
    };
  }
  for (const validatorWithSuffix of FOCUSED_VALIDATORS) {
    for (const sveltekit of FOCUSED_SVELTEKIT) {
      yield {
        type: `validator__${validatorWithSuffix}__sk-${sveltekit}`,
        options: {
          [addon.id]: {
            themeOrSubTheme: DEFAULT_THEME,
            icons: DEFAULT_ICONS,
            validatorWithSuffix,
            sveltekit,
          } as const,
        },
      };
    }
  }
}

const { test, testCases } = setupSnapshotTest(
  { addon },
  {
    kinds: Array.from(kinds()),
    filter: (tc) => {
      if (!tc.variant.endsWith("-ts")) {
        return false;
      }
      const { sveltekit } = tc.kind.options[addon.id];
      if (sveltekit !== "no" && !tc.variant.includes("kit")) {
        return false;
      }
      return true;
    },
  },
);

test.for(testCases)("@sjsf/sv $kind.type $variant", async (testCase, ctx) => {
  expect(snapshotFs(ctx.cwd(testCase))).toMatchSnapshot();
});
