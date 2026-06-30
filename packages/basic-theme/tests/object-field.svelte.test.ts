import type { Schema, UiSchema } from "@sjsf/form";
import { getValueSnapshot } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

describe("object field contracts", () => {
  describe("child input interaction", () => {
    test("typing in child field updates form value", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
        },
        initialValue: { name: "Alice" },
      });

      await userEvent.fill(page.getByRole("textbox").first(), "Bob");
      expectValue(form, { name: "Bob" });
    });
  });

  describe("required properties", () => {
    test("renders error for missing required property", async () => {
      await renderFieldForm({
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
        .element(page.getByText("name is required"))
        .toBeInTheDocument();
    });
  });

  describe("additionalProperties", () => {
    test("renders initial additional property values", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
          additionalProperties: { type: "string" },
        },
        initialValue: { name: "Alice", customField: "customValue" },
      });

      const inputs = page.getByRole("textbox");
      await expect.element(inputs.nth(0)).toHaveValue("Alice");
      await expect.element(inputs.nth(1)).toHaveValue("customField");
      await expect.element(inputs.nth(2)).toHaveValue("customValue");
      expectValue(form, { name: "Alice", customField: "customValue" });
    });

    test("typing in additional property input updates form value", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "object",
          properties: {
            name: { type: "string" },
          },
          additionalProperties: { type: "string" },
        },
        initialValue: { name: "Alice", customField: "oldValue" },
      });

      await userEvent.fill(page.getByRole("textbox").nth(2), "newValue");
      expectValue(form, { name: "Alice", customField: "newValue" });
    });
  });

  describe("dependent enum schema sanitization", () => {
    const dependentEnumSchema: Schema = {
      type: "object",
      properties: {
        animal: { type: "string", enum: ["Cat", "Fish"] },
      },
      dependencies: {
        animal: {
          oneOf: [
            {
              properties: {
                animal: { enum: ["Cat"] },
                food: { type: "string", enum: ["meat"] },
              },
            },
            {
              properties: {
                animal: { enum: ["Fish"] },
                food: { type: "string", enum: ["worms"] },
                water: { type: "string", enum: ["lake"] },
              },
            },
          ],
        },
      },
    };

    const enumUiSchema: UiSchema = {
      "ui:components": { stringField: "enumField" },
      "ui:options": {
        enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
      },
    };

    test("sanitizes stale enum data when switching dependent schema", async () => {
      const { form } = await renderFieldForm({
        schema: dependentEnumSchema,
        uiSchema: {
          animal: enumUiSchema,
          food: enumUiSchema,
          water: enumUiSchema,
        },
        initialValue: { animal: "Fish", food: "worms", water: "lake" },
      });

      const select = page.getByRole("combobox").first();
      await expect.element(select).toHaveValue("Fish");

      await userEvent.selectOptions(select, "Cat");

      const val = getValueSnapshot(form) as any;
      expect(val.animal).toBe("Cat");
      expect(val.food).toBe("meat");
      expect(val.water).toBeUndefined();
    });
  });
});
