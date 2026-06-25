import { type Theme } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../lib/form-defaults.js";
import {
  type ArrayFieldTestContext,
  type ArrayTestFormOptions,
} from "./field-test-context.js";
import TestForm from "./form.svelte";

function ssrForm(ctx: ArrayFieldTestContext, options: ArrayTestFormOptions) {
  return renderServer(TestForm, {
    context: ctx.context,
    props: {
      ...defaults,
      ...ctx.defaultFormOptions,
      ...options,
    } as const,
  });
}

export function arrayFieldSsrTests(
  theme: Theme,
  ctx: ArrayFieldTestContext = {}
) {
  describe("array fields SSR", () => {
    test("renders array with initial items", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "array", items: { type: "string" } },
        initialValue: ["a", "b", "c"],
      });

      expect(body).toContain("a");
      expect(body).toContain("b");
      expect(body).toContain("c");
      expect(body).not.toContain("undefined");
      expect(body).not.toContain("[object Object]");
      expect(body).not.toContain("NaN");
    });

    test("renders empty array without garbage", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "array", items: { type: "string" } },
        initialValue: [],
      });

      expect(body).toBeDefined();
    });

    test("renders tuple with initial values", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "array",
          items: [{ type: "string" }, { type: "number" }],
        },
        initialValue: ["hello", 42],
      });

      expect(body).toContain("hello");
      expect(body).toContain("42");
    });

    test("renders array of numbers", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: { type: "array", items: { type: "number" } },
        initialValue: [1, 2, 3],
      });

      expect(body).toContain("1");
      expect(body).toContain("2");
      expect(body).toContain("3");
    });

    test("renders array of objects", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "array",
          items: {
            type: "object",
            properties: { name: { type: "string" } },
          },
        },
        initialValue: [{ name: "Alice" }, { name: "Bob" }],
      });

      expect(body).toContain("Alice");
      expect(body).toContain("Bob");
    });

    test("renders array schema title", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "array",
          items: { type: "string" },
          title: "Tags",
        },
      });

      expect(body).toContain("Tags");
    });

    test("renders array schema description", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "array",
          items: { type: "string" },
          description: "List of items",
        },
      });

      expect(body).toContain("List of items");
    });
  });
}
