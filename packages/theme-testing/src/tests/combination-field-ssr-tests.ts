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
  arrayAnyOfSchema,
  arrayOneOfSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  numberAnyOfSchema,
  numberOneOfSchema,
  objectSharedAnyOfSchema,
  objectSharedOneOfSchema,
  plainOneOfSchema,
  stringAnyOfSchema,
  stringOneOfSchema,
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

    function assertInBody(body: string, title: string) {
      if (ctx.assertOptionTextInBody) {
        ctx.assertOptionTextInBody(body, title);
      } else {
        expect(body).toContain(title);
      }
    }

    test("renders string oneOf with input at root", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: stringOneOfSchema,
      });

      assertInBody(body, "IPv4");
      expect(body).toContain('id="root"');
    });

    test("renders number oneOf with input at root", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: numberOneOfSchema,
      });

      assertInBody(body, "Positive");
      expect(body).toContain('id="root"');
    });

    test("renders array oneOf with array controls", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: arrayOneOfSchema,
      });

      assertInBody(body, "Strings");
      expect(body).toContain("Add item");
    });

    test("renders object oneOf with shared property", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: objectSharedOneOfSchema,
      });

      expect(body).toContain("Shared");
    });

    test("renders string anyOf with input at root", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: stringAnyOfSchema,
      });

      assertInBody(body, "Short");
      expect(body).toContain('id="root"');
    });

    test("renders number anyOf with input at root", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: numberAnyOfSchema,
      });

      assertInBody(body, "Positive");
      expect(body).toContain('id="root"');
    });

    test("renders array anyOf with array controls", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: arrayAnyOfSchema,
      });

      assertInBody(body, "Strings");
      expect(body).toContain("Add item");
    });

    test("renders object anyOf with shared property", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: objectSharedAnyOfSchema,
      });

      expect(body).toContain("Shared");
    });
  });
}
