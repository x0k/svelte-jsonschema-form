import "@sjsf/form/fields/extra/boolean-select-include";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const uiSchema = {
  "ui:components": {
    booleanField: "booleanSelectField",
  },
} as const;

const enumUiSchema = {
  ...uiSchema,
  "ui:options": {
    enumNames: ["Enabled", "Disabled"],
  },
};

// `ui:components` is keyed by the field type the resolver picks. `resolvers/basic`
// picks `anyOfField`/`oneOfField` for schemas with alternatives before it looks at
// `type: "boolean"`, so `ui:components.booleanField` is never consulted. Force the
// boolean field here; the uiSchema below still selects `booleanSelectField` for it.
const booleanFieldResolver = () => () => "booleanField" as const;

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
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Enabled" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Disabled" }))
      .toBeInTheDocument();

    await userEvent.selectOptions(select, "Disabled");
    expectValue(form, false);
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
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "On" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Off" }))
      .toBeInTheDocument();

    await userEvent.selectOptions(select, "Off");
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
      uiSchema: enumUiSchema,
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Enabled" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Disabled" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "On" }))
      .not.toBeInTheDocument();
  });

  test("falls back to the enum when oneOf options are not constant", async () => {
    await renderFieldForm({
      schema: {
        type: "boolean",
        enum: [true, false],
        oneOf: [{ title: "Any value" }],
      },
      uiSchema: enumUiSchema,
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Enabled" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Disabled" }))
      .toBeInTheDocument();
  });

  test("reads boolean anyOf schemas as Yes/No options", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "boolean",
        anyOf: [false, true],
      },
      uiSchema,
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    const options = select.getByRole("option");
    await expect.element(options.nth(0)).toHaveTextContent("No");
    await expect.element(options.nth(1)).toHaveTextContent("Yes");

    await userEvent.selectOptions(select, "Yes");
    expectValue(form, true);
  });

  test("reads boolean oneOf schemas alongside constant options", async () => {
    await renderFieldForm({
      schema: {
        type: "boolean",
        oneOf: [true, { const: false, title: "Off" }],
      },
      uiSchema,
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Yes" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Off" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "No" }))
      .not.toBeInTheDocument();
  });

  test("labels single-value enum options by their value", async () => {
    await renderFieldForm({
      schema: {
        type: "boolean",
        oneOf: [{ enum: [true] }, { enum: [false] }],
      },
      uiSchema,
      resolver: booleanFieldResolver,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Yes" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "No" }))
      .toBeInTheDocument();
  });
});
