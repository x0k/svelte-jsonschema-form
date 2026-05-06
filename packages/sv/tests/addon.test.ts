import { expect } from "vitest";

import addon from "../src/index.js";
import {
  iconOptions,
  AddonOptions,
  SVELTE_KIT_INTEGRATION_OPTIONS,
  themeOrSubThemeOptions,
  validatorOptions,
} from "../src/model";
import { snapshotFs } from "./setup/snapshot-fs.js";
import { setupSnapshotTest } from "./setup/snapshot-suit";

function values<T>(options: Iterable<{ value: T; label: string }>): T[] {
  return Array.from(options, (o) => o.value);
}

const BASE = {
  themeOrSubTheme: "basic",
  validatorWithSuffix: "ajv8",
  icons: "none",
  sveltekit: "no",
} as const satisfies AddonOptions;

function kind<O extends Partial<AddonOptions>>(type: string, options: O) {
  return {
    type,
    options: {
      [addon.id]: {
        ...BASE,
        ...options,
      },
    },
  };
}

type ValidatorOptionValue = (ReturnType<
  typeof validatorOptions
> extends Generator<infer V>
  ? V
  : never)["value"];

const VALIDATOR_KINDS = [
  // JSON schema validator
  "ajv8",
  // Precompiled validator
  "ajv8-precompiled",
  // Schema validator
  "zod4",
] satisfies ValidatorOptionValue[];

function* kinds() {
  for (const themeOrSubTheme of values(themeOrSubThemeOptions())) {
    yield kind(`theme__${themeOrSubTheme}`, { themeOrSubTheme });
  }
  for (const validatorWithSuffix of values(validatorOptions())) {
    yield kind(`validator__${validatorWithSuffix}`, { validatorWithSuffix });
  }
  for (const icons of values(iconOptions())) {
    yield kind(`icons__${icons}`, { icons });
  }
  for (const sveltekit of values(SVELTE_KIT_INTEGRATION_OPTIONS)) {
    for (const validatorWithSuffix of VALIDATOR_KINDS) {
      yield kind(`sveltekit__${sveltekit}__${validatorWithSuffix}`, {
        sveltekit,
        validatorWithSuffix,
      });
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
