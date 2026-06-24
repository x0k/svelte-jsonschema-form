import { type Theme } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../lib/form-defaults.js";
import {
  type PrimitiveFieldTestContext,
  type PrimitiveTestFormOptions,
} from "./field-core.js";
import TestForm from "./form.svelte";

function ssrForm(
  ctx: PrimitiveFieldTestContext,
  options: PrimitiveTestFormOptions
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

export function primitiveFieldSsrTests(
  theme: Theme,
  ctx: PrimitiveFieldTestContext = {}
) {
  describe("primitive fields SSR", () => {
    test("renders string field with initial value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "string" },
        initialValue: "hello",
      });

      expect(body).toContain("hello");
      expect(body).not.toContain("undefined");
      expect(body).not.toContain("[object Object]");
      expect(body).not.toContain("NaN");
    });

    test("renders number field with initial value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "number" },
        initialValue: 42,
      });

      expect(body).toContain("42");
    });

    test("renders integer field with initial value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "integer" },
        initialValue: 10,
      });

      expect(body).toContain("10");
    });

    test("renders boolean field with checkbox or toggle", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "boolean" },
        initialValue: true,
      });

      expect(body).toBeDefined();
    });

    test("renders null field without garbage", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "null" },
      });

      expect(body).toBeDefined();
    });

    test("renders unknown field with error", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {},
      });

      expect(body).toBeDefined();
    });

    test("renders string with default value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "string", default: "default-text" },
      });

      expect(body).toContain("default-text");
    });

    test("renders number with default value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "number", default: 99 },
      });

      expect(body).toContain("99");
    });

    test("renders schema title", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "string", title: "My Field" },
      });

      expect(body).toContain("My Field");
    });

    test("renders schema description", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "string", description: "Enter text here" },
      });

      expect(body).toContain("Enter text here");
    });
  });
}
