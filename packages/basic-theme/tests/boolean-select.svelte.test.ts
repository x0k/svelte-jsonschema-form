import "@sjsf/form/fields/extra/boolean-select-include";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const uiSchema = {
  "ui:components": {
    booleanField: "booleanSelectField",
  },
} as const;

// `ui:components` is keyed by the field type the resolver picks. `resolvers/basic`
// picks `oneOfField`/`anyOfField` for schemas with alternatives before it looks at
// `type: "boolean"`, so a custom resolver is needed to reach `booleanSelectField`
// with such a schema. The field intentionally ignores alternatives.
const booleanFieldResolver = () => () => "booleanField" as const;

describe("boolean select field", () => {
  test("renders the boolean enum as Yes/No", async () => {
    const { form } = await renderFieldForm({
      schema: {
        type: "boolean",
        enum: [true, false],
      },
      uiSchema,
    });

    const select = page.getByRole("combobox");
    await expect
      .element(select.getByRole("option", { name: "Yes" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "No" }))
      .toBeInTheDocument();

    await userEvent.selectOptions(select, "No");
    expectValue(form, false);
  });

  test("ignores oneOf options", async () => {
    await renderFieldForm({
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
      .element(select.getByRole("option", { name: "Yes" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "No" }))
      .toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "On" }))
      .not.toBeInTheDocument();
    await expect
      .element(select.getByRole("option", { name: "Off" }))
      .not.toBeInTheDocument();
  });

  test("ignores boolean oneOf schemas", async () => {
    await renderFieldForm({
      schema: {
        type: "boolean",
        oneOf: [false, true],
      },
      uiSchema,
      resolver: booleanFieldResolver,
    });

    const options = page.getByRole("combobox").getByRole("option");
    await expect.element(options.nth(0)).toHaveTextContent("Yes");
    await expect.element(options.nth(1)).toHaveTextContent("No");
  });
});
