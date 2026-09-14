import type { Schema } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

describe("nested dependencies sanitization (rjsf#5250)", () => {
  const enumUiSchema = {
    "ui:components": { stringField: "enumField" },
    "ui:options": {
      enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
    },
  };
  const nestedUiSchema = {
    m: {
      animal: enumUiSchema,
      food: enumUiSchema,
    },
  };
  const animalDependency: NonNullable<Schema["dependencies"]> = {
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
          },
        },
      ],
    },
  };

  test("sanitizes stale enum data for a dependency nested inside an object", async () => {
    const schema: Schema = {
      type: "object",
      properties: {
        m: {
          type: "object",
          properties: {
            animal: { type: "string", enum: ["Cat", "Fish"] },
          },
          dependencies: animalDependency,
        },
      },
    };
    const { form } = await renderFieldForm({
      schema,
      uiSchema: nestedUiSchema,
      initialValue: { m: { animal: "Fish", food: "worms" } },
    });

    const select = page.getByRole("combobox").first();
    await expect.element(select).toHaveValue("Fish");

    await userEvent.selectOptions(select, "Cat");

    expectValue(form, { m: { animal: "Cat", food: "meat" } });
  });

  test("sanitizes stale enum data for a dependency nested behind a $ref", async () => {
    const schema: Schema = {
      type: "object",
      definitions: {
        Animal: {
          type: "object",
          properties: {
            animal: { type: "string", enum: ["Cat", "Fish"] },
          },
          dependencies: animalDependency,
        },
      },
      properties: {
        m: { $ref: "#/definitions/Animal" },
      },
    };
    const { form } = await renderFieldForm({
      schema,
      uiSchema: nestedUiSchema,
      initialValue: { m: { animal: "Fish", food: "worms" } },
    });

    await userEvent.selectOptions(page.getByRole("combobox").first(), "Cat");

    expectValue(form, { m: { animal: "Cat", food: "meat" } });
  });
});
