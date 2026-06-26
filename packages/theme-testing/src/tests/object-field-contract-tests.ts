import type { Schema, Theme, UiSchema } from "@sjsf/form";
import { getValueSnapshot } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect } from "vitest";

import {
  doAssertSelected,
  doSelect,
  expectValue,
  renderFieldForm,
  setInputValue,
  setInputValueAt,
  skippableTest,
} from "./field-contract-helpers.js";
import { type ObjectFieldTestContext } from "./field-test-context.js";

export function objectFieldContractTests(
  theme: Theme,
  ctx: ObjectFieldTestContext = {}
) {
  const test = skippableTest(ctx.skipTests);

  describe("object field contracts", () => {
    describe("child input interaction", () => {
      test("typing in child field updates form value", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
          },
          initialValue: { name: "Alice" },
        });

        setInputValue(screen.locator, "Bob");
        expectValue(form, { name: "Bob" });
      });
    });

    describe("required properties", () => {
      test("renders error for missing required property", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            required: ["name"],
          },
          initialErrors: [{ path: ["name"], message: "name is required" }],
        });

        await expect
          .element(screen.getByText("name is required"))
          .toBeInTheDocument();
      });
    });

    describe("additionalProperties", () => {
      test("renders initial additional property values", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            additionalProperties: { type: "string" },
          },
          initialValue: { name: "Alice", customField: "customValue" },
        });

        const element = screen.locator.element();
        const inputs = Array.from(
          element.querySelectorAll('input:not([type="hidden"])')
        ) as HTMLInputElement[];
        expect(inputs.length).toBe(3);
        expect(inputs[0]?.value).toBe("Alice");
        expect(inputs[1]?.value).toBe("customField");
        expect(inputs[2]?.value).toBe("customValue");
        expectValue(form, { name: "Alice", customField: "customValue" });
      });

      test("typing in additional property input updates form value", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: {
            type: "object",
            properties: {
              name: { type: "string" },
            },
            additionalProperties: { type: "string" },
          },
          initialValue: { name: "Alice", customField: "oldValue" },
        });

        setInputValueAt(screen.locator, 2, "newValue");
        expectValue(form, { name: "Alice", customField: "newValue" });
      });
    });

    describe("dependent enum schema sanitization", () => {
      const dependentEnumSchema: Schema = {
        type: "object",
        properties: {
          animal: {
            type: "string",
            enum: ["Cat", "Fish"],
          },
        },
        dependencies: {
          animal: {
            oneOf: [
              {
                properties: {
                  animal: {
                    enum: ["Cat"],
                  },
                  food: {
                    type: "string",
                    enum: ["meat"],
                  },
                },
              },
              {
                properties: {
                  animal: {
                    enum: ["Fish"],
                  },
                  food: {
                    type: "string",
                    enum: ["worms"],
                  },
                  water: {
                    type: "string",
                    enum: ["lake"],
                  },
                },
              },
            ],
          },
        },
      };

      const enumUiSchema: UiSchema = {
        "ui:components": {
          stringField: "enumField",
        },
        "ui:options": {
          enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
        },
      };

      test("sanitizes stale enum data when switching dependent schema", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: dependentEnumSchema,
          uiSchema: {
            animal: enumUiSchema,
            food: enumUiSchema,
            water: enumUiSchema,
          },
          initialValue: { animal: "Fish", food: "worms", water: "lake" },
        });

        await doAssertSelected(ctx, screen.locator, "Fish");

        await doSelect(ctx, screen.locator, "Cat");

        const val = getValueSnapshot(form) as any;
        expect(val.animal).toBe("Cat");
        expect(val.food).toBe("meat");
        expect(val.water).toBeUndefined();
      });
    });
  });
}
