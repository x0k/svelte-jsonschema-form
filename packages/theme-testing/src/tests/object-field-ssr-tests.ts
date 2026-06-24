import { type Theme } from "@sjsf/form";
import { render as renderServer } from "svelte/server";
import { describe, expect, test } from "vitest";

import * as defaults from "../lib/form-defaults.js";
import {
  type ObjectFieldTestContext,
  type ObjectTestFormOptions,
} from "./field-core.js";
import TestForm from "./form.svelte";

function ssrForm(ctx: ObjectFieldTestContext, options: ObjectTestFormOptions) {
  return renderServer(TestForm, {
    context: ctx.context,
    props: {
      ...defaults,
      ...ctx.defaultFormOptions,
      ...options,
    } as const,
  });
}

export function objectFieldSsrTests(
  theme: Theme,
  ctx: ObjectFieldTestContext = {}
) {
  describe("object fields SSR", () => {
    test("renders object with initial value", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
        initialValue: { name: "Alice" },
      });

      expect(body).toContain("Alice");
      expect(body).not.toContain("undefined");
      expect(body).not.toContain("[object Object]");
      expect(body).not.toContain("NaN");
    });

    test("renders nested object", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          properties: {
            address: {
              type: "object",
              properties: {
                city: { type: "string" },
              },
            },
          },
        },
        initialValue: {
          address: { city: "Springfield" },
        },
      });

      expect(body).toContain("Springfield");
    });

    test("renders empty object without garbage", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
        initialValue: {},
      });

      expect(body).toBeDefined();
    });

    test("renders object schema title", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          title: "User Info",
          properties: {
            name: { type: "string" },
          },
        },
      });

      expect(body).toContain("User Info");
    });

    test("renders object schema description", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          description: "Enter your details",
          properties: {
            name: { type: "string" },
          },
        },
      });

      expect(body).toContain("Enter your details");
    });

    test("renders multiple properties", () => {
      const { body } = ssrForm(ctx, {
        theme,
        schema: {
          type: "object",
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            age: { type: "number" },
          },
        },
        initialValue: { firstName: "John", lastName: "Doe", age: 30 },
      });

      expect(body).toContain("John");
      expect(body).toContain("Doe");
      expect(body).toContain("30");
    });
  });
}
