import { type Schema, type Theme } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../lib/form-defaults.js";
import {
  type CombinationFieldTestContext,
  type CombinationTestFormOptions,
} from "./field-test-context.js";
import TestForm from "./form.svelte";

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

function countOccurrences(body: string, text: string) {
  return body.split(text).length - 1;
}

const unionSchema = {
  type: ["string", "number"],
  title: "Union title",
  description: "Union description",
} as Schema;

export function unionFieldSsrTests(
  theme: Theme,
  ctx: CombinationFieldTestContext = {}
) {
  describe("union fields SSR", () => {
    test("renders the title and description once", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: unionSchema,
      });

      expect(countOccurrences(body, "Union title")).toBe(1);
      expect(countOccurrences(body, "Union description")).toBe(1);
    });

    test("renders the title and description once with the optional template", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: unionSchema,
        uiSchema: {
          "ui:components": {
            multiFieldTemplate: "optionalMultiFieldTemplate",
          },
        },
      });

      expect(countOccurrences(body, "Union title")).toBe(1);
      expect(countOccurrences(body, "Union description")).toBe(1);
    });

    test("renders the selected type and value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: unionSchema,
        initialValue: "hello",
      });

      expect(body).toContain("hello");
      expect(body).toContain("string");
    });

    test("renders the selected type of the current value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: unionSchema,
        initialValue: 42,
      });

      expect(body).toContain("number");
      expect(body).toContain("42");
    });

    test("renders an object that accepts any key", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: ["string", "object"],
          additionalProperties: true,
        } as Schema,
        initialValue: {},
      });

      expect(body).toContain("Add property");
    });
  });
}
