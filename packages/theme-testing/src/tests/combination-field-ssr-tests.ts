import { type Theme } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../lib/form-defaults.js";
import {
  type CombinationFieldTestContext,
  type CombinationTestFormOptions,
} from "./field-test-context.js";
import TestForm from "./form.svelte";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  plainOneOfSchema,
} from "./test-data/combination-defaults.js";

function ssrForm(
  ctx: CombinationFieldTestContext,
  options: CombinationTestFormOptions
) {
  return renderServer(TestForm, {
    context: ctx.context,
    props: {
      ...defaults,
      ...ctx.defaultFormOptions,
      ...options,
    } as const,
  });
}

export function combinationFieldSsrTests(
  theme: Theme,
  ctx: CombinationFieldTestContext = {}
) {
  describe("combination fields SSR", () => {
    test("renders selected option and defaults", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: { kind: "company", shared: "kept" },
      });

      expect(body).toContain("Company kind");
      expect(body).toContain("Acme");
      expect(body).toContain("kept");
    });

    test("renders ambiguous schema default option", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: ambiguousSchema,
      });

      expect(body).toContain("String branch");
      expect(body).toContain("string-default");
    });

    test("renders plain oneOf without discriminator", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: plainOneOfSchema,
      });

      expect(body).toContain("First");
      expect(body).toContain("default-first");
    });
  });
}
