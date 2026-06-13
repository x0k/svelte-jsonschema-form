import { expect } from "vitest";
import {
  codegenIconSets,
  codegenSvelteKitIntegrations,
  codegenThemeOrSubTheme,
  CodegenValidator,
  codegenValidators,
} from "meta/codegen";

import addon from "../src/index.js";
import { AddonOptions, SvValidator } from "../src/model";
import { snapshotFs } from "./setup/snapshot-fs.js";
import { setupSnapshotTest } from "./setup/snapshot-suit";

const BASE_VALIDATOR: CodegenValidator = {
  name: "ajv8",
  precompiled: false,
  draft2020: false,
};

const BASE = {
  themeOrSubTheme: "basic",
  validator: JSON.stringify(BASE_VALIDATOR),
  icons: "none",
  sveltekit: "no",
  demo: true,
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

const VALIDATOR_KINDS = [
  { name: "ajv8", precompiled: false, draft2020: false },
  { name: "ajv8", precompiled: true, draft2020: false },
  { name: "zod4", precompiled: false, draft2020: false },
  { name: "hyperjump", precompiled: true, draft2020: false },
] satisfies SvValidator[];

function validatorName(v: SvValidator) {
  const suffix = v.precompiled ? "_precompiled" : "";
  return `${v.name}${suffix}`;
}

function* kinds() {
  for (const themeOrSubTheme of codegenThemeOrSubTheme()) {
    yield kind(`theme__${themeOrSubTheme}`, { themeOrSubTheme });
  }
  for (const validator of codegenValidators()) {
    if (
      validator.draft2020 ||
      (validator.name === BASE_VALIDATOR.name &&
        validator.precompiled === BASE_VALIDATOR.precompiled)
    ) {
      continue;
    }
    yield kind(`validator__${validatorName(validator)}`, {
      validator: JSON.stringify(validator),
    });
  }
  for (const icons of codegenIconSets()) {
    if (icons === BASE.icons) {
      continue;
    }
    yield kind(`icons__${icons}`, { icons });
  }
  for (const sveltekit of codegenSvelteKitIntegrations()) {
    if (sveltekit === BASE.sveltekit) {
      continue;
    }
    for (const v of VALIDATOR_KINDS) {
      yield kind(`sveltekit__${sveltekit}__${validatorName(v)}`, {
        sveltekit,
        validator: JSON.stringify(v),
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
