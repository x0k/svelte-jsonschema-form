import "@sjsf/form/fields/extra/boolean-select-include";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const uiSchema = {
  "ui:components": {
    booleanField: "booleanSelectField",
  },
} as const;

describe("boolean select field", () => {
  test("reads titles from constant anyOf options", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "boolean",
        anyOf: [
          { const: true, title: "Enabled" },
          { const: false, title: "Disabled" },
        ],
      },
      uiSchema,
    });

    const select = page.getByRole("combobox").first();
    await expect
      .element(select.getByRole("option", { name: "Enabled" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Disabled" }))
      .toBeInTheDocument();

    await userEvent.selectOptions(select, "Disabled");
    expectValue(form, false);
  });

  test("falls back to the enum when anyOf options are not constant", async () => {
    await renderFieldForm({
      schema: {
        type: "boolean",
        enum: [true, false],
        anyOf: [{ title: "Any value" }],
        oneOf: [
          { const: true, title: "On" },
          { const: false, title: "Off" },
        ],
      },
      uiSchema,
    });

    const select = page.getByRole("combobox").last();
    await expect
      .element(select.getByRole("option", { name: "Yes" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "No" }))
      .toBeInTheDocument();
  });

  test("reads titles from constant oneOf options", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "boolean",
        oneOf: [
          { const: true, title: "On" },
          { const: false, title: "Off" },
        ],
      },
      uiSchema,
    });

    const select = page.getByRole("combobox").first();
    await expect
      .element(select.getByRole("option", { name: "On" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Off" }))
      .toBeInTheDocument();

    await userEvent.selectOptions(select, "Off");
    expectValue(form, false);
  });
});
