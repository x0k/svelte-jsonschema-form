import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";
import { type Theme } from "@sjsf/form";

import TestForm from "./test-form.svelte";
import {
  type CombinationFieldTestOptions,
  defaultsWith,
  discriminatedSchema,
  discriminatedUiSchema,
  withTestSelect,
} from "./combination-field-core.js";

export function combinationFieldSsrTests(
  theme: Theme,
  testOptions?: CombinationFieldTestOptions,
) {
  describe("combination fields SSR", () => {
    test("renders selected option and defaults", () => {
      const { body } = renderServer(TestForm, {
        context: testOptions?.context,
        props: defaultsWith({
          ...testOptions?.defaultFormOptions,
          theme: withTestSelect(theme),
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        }),
      });

      expect(body).toContain("Company kind");
      expect(body).toContain("Acme");
      expect(body).toContain("kept");
    });
  });
}
