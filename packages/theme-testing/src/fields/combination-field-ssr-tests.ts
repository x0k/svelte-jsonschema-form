import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";
import { type Theme } from "@sjsf/form";

import TestForm from "./test-form.svelte";
import * as defaults from "../lib/form-defaults.js";
import {
  type CombinationFieldTestOptions,
  type CombinationTestFormOptions,
} from "./combination-field-core.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  plainOneOfSchema,
} from "./test-data/combination-defaults.js";

function ssrForm(
  options: CombinationTestFormOptions,
  testOptions?: CombinationFieldTestOptions,
) {
  return renderServer(TestForm, {
    context: testOptions?.context,
    props: {
      ...defaults,
      ...testOptions?.defaultFormOptions,
      ...options,
    } as const,
  });
}

export function combinationFieldSsrTests(
  theme: Theme,
  testOptions?: CombinationFieldTestOptions,
) {
  describe("combination fields SSR", () => {
    test("renders selected option and defaults", () => {
      const { body } = ssrForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        },
        testOptions,
      );

      expect(body).toContain("Company kind");
      expect(body).toContain("Acme");
      expect(body).toContain("kept");
    });

    test("renders first option when no initial value", () => {
      const { body } = ssrForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
        },
        testOptions,
      );

      expect(body).toContain("Person from UI");
      expect(body).toContain("Ada");
    });

    test("renders ambiguous schema default option", () => {
      const { body } = ssrForm(
        {
          theme,
          schema: ambiguousSchema,
        },
        testOptions,
      );

      expect(body).toContain("String branch");
      expect(body).toContain("string-default");
    });

    test("renders plain oneOf without discriminator", () => {
      const { body } = ssrForm(
        {
          theme,
          schema: plainOneOfSchema,
        },
        testOptions,
      );

      expect(body).toContain("First");
      expect(body).toContain("default-first");
    });
  });
}
