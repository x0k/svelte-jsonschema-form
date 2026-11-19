import { getValueSnapshot, type Schema } from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const stringOrNumberSchema = { type: ["string", "number"] } as Schema;

function titlesWithText(text: string) {
  return [...document.querySelectorAll("legend.sjsf-title")].filter(
    (title) => title.textContent?.trim() === text
  );
}

function descriptionsWithText(text: string) {
  return [...document.querySelectorAll(".sjsf-description")].filter(
    (description) => description.textContent?.trim() === text
  );
}

describe("union field", () => {
  describe("initial selection", () => {
    test("selects the type of the current value", async () => {
      await renderFieldForm({
        schema: stringOrNumberSchema,
        initialValue: 42,
      });

      await expect.element(page.getByRole("combobox").first()).toHaveValue("1");
      await expect
        .element(page.getByRole("spinbutton").first())
        .toHaveValue(42);
    });

    test("starts on the first type when there is no value", async () => {
      await renderFieldForm({ schema: stringOrNumberSchema });

      await expect.element(page.getByRole("combobox").first()).toHaveValue("0");
      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("starts on the type the value has", async () => {
      await renderFieldForm({
        schema: stringOrNumberSchema,
        initialValue: "hello",
      });

      await expect.element(page.getByRole("combobox").first()).toHaveValue("0");
      await expect
        .element(page.getByRole("textbox").first())
        .toHaveValue("hello");
    });

    test("renders the field title and description once", async () => {
      await renderFieldForm({
        schema: {
          ...stringOrNumberSchema,
          title: "Union title",
          description: "Union description",
        } as Schema,
      });

      expect(titlesWithText("Union title")).toHaveLength(1);
      expect(descriptionsWithText("Union description")).toHaveLength(1);
    });

    test("the optional template renders the title and description once", async () => {
      await renderFieldForm({
        schema: {
          ...stringOrNumberSchema,
          title: "Union title",
          description: "Union description",
        } as Schema,
        uiSchema: {
          "ui:components": {
            multiFieldTemplate: "optionalMultiFieldTemplate",
          },
        },
      });

      expect(titlesWithText("Union title")).toHaveLength(1);
      expect(descriptionsWithText("Union description")).toHaveLength(1);
    });

    test("does not repeat a description set on the parent UI schema", async () => {
      await renderFieldForm({
        schema: stringOrNumberSchema,
        uiSchema: {
          "ui:options": { description: "Parent description" },
        },
      });

      expect(descriptionsWithText("Parent description")).toHaveLength(1);
    });

    test("offers every type the schema lists", async () => {
      await renderFieldForm({ schema: stringOrNumberSchema });

      const options = page.getByRole("combobox").first().getByRole("option");
      expect(options.elements()).toHaveLength(2);
      expect(options.elements()[0]).toHaveTextContent("string");
      expect(options.elements()[1]).toHaveTextContent("number");
    });
  });

  describe("switching types", () => {
    test("casts the value into the selected type", async () => {
      const { form } = await renderFieldForm({
        schema: stringOrNumberSchema,
        initialValue: "12",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "number"
      );
      expectValue(form, 12);
      await expect
        .element(page.getByRole("spinbutton").first())
        .toHaveValue(12);

      await userEvent.fill(page.getByRole("spinbutton").first(), "7.5");
      expectValue(form, 7.5);

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "string"
      );
      expectValue(form, "7.5");
      await expect
        .element(page.getByRole("textbox").first())
        .toHaveValue("7.5");
    });

    test("leaves the field empty when the value has no numeric reading", async () => {
      const { form } = await renderFieldForm({
        schema: stringOrNumberSchema,
        initialValue: "abc",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "number"
      );

      expectValue(form, undefined);
    });

    test("starts a container empty", async () => {
      const { form } = await renderFieldForm({
        schema: { type: ["string", "object"] } as Schema,
        initialValue: "text",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "object"
      );

      expectValue(form, {});
    });

    test("offers to add keys to an object that accepts any key", async () => {
      await renderFieldForm({
        schema: {
          type: ["string", "object"],
          additionalProperties: true,
        } as Schema,
        initialValue: "text",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "object"
      );

      await expect
        .element(page.getByRole("button", { name: /add property/i }).first())
        .toBeInTheDocument();
    });

    test("adds a key to an object that accepts any key", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: ["string", "object"],
        } as Schema,
        initialValue: "text",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "object"
      );
      await userEvent.click(
        page.getByRole("button", { name: /add property/i }).first()
      );

      expect(Object.keys(getValueSnapshot(form) ?? {})).toHaveLength(1);
      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("adds a key after switching an object back from string", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "object",
          properties: {
            unionObject: {
              type: ["string", "object"],
              additionalProperties: true,
            },
          },
        } as Schema,
        initialValue: { unionObject: { anything: "goes" } },
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "string");
      await userEvent.selectOptions(select, "object");
      await userEvent.click(
        page.getByRole("button", { name: /add property/i }).first()
      );

      expectValue(form, { unionObject: { "Additional property": undefined } });
      await expect
        .element(page.getByRole("textbox").first())
        .toHaveValue("Additional property");
    });

    test("selects null for a null type", async () => {
      const { form } = await renderFieldForm({
        schema: { type: ["string", "number", "null"] } as Schema,
        initialValue: "text",
      });

      await userEvent.selectOptions(page.getByRole("combobox").first(), "null");

      expectValue(form, null);
    });
  });

  describe("per-type UI schemas", () => {
    test("labels the types and applies the selected type's UI schema", async () => {
      const { form } = await renderFieldForm({
        schema: stringOrNumberSchema,
        initialValue: "text",
        uiSchema: {
          union: [
            {
              "ui:options": {
                title: "Text",
                description: "Text value",
              },
            },
            {
              "ui:options": {
                title: "Count",
                description: "Count value",
              },
            },
          ],
        },
      });

      const select = page.getByRole("combobox").first();
      await expect
        .element(select.getByRole("option").nth(0))
        .toHaveTextContent("Text");
      await expect
        .element(select.getByRole("option").nth(1))
        .toHaveTextContent("Count");
      await expect.element(page.getByText("Text value")).toBeInTheDocument();

      await userEvent.selectOptions(select, "Count");

      expectValue(form, undefined);
      await expect.element(page.getByText("Count value")).toBeInTheDocument();
    });
  });

  describe("with oneOf", () => {
    test("wraps the option selector and keeps both selectors", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: ["string", "number"],
          oneOf: [
            { type: "string", title: "Text branch" },
            { type: "number", title: "Number branch" },
          ],
        } as Schema,
        initialValue: "text",
      });

      const selects = page.getByRole("combobox");
      expect(selects.elements()).toHaveLength(2);

      await userEvent.selectOptions(selects.nth(1), "Number branch");

      await expect
        .element(page.getByRole("spinbutton").first())
        .toBeInTheDocument();
      expectValue(form, undefined);
    });
  });

  describe("with anyOf", () => {
    test("wraps the option selector and keeps both selectors", async () => {
      await renderFieldForm({
        schema: {
          type: ["string", "number"],
          anyOf: [
            { type: "string", title: "Text branch" },
            { type: "number", title: "Number branch" },
          ],
        } as Schema,
        initialValue: "text",
      });

      const selects = page.getByRole("combobox");
      expect(selects.elements()).toHaveLength(2);

      await userEvent.selectOptions(selects.nth(1), "Number branch");

      await expect
        .element(page.getByRole("spinbutton").first())
        .toBeInTheDocument();
    });
  });

  describe("plain fields", () => {
    test("a nullable single type keeps its plain field", async () => {
      await renderFieldForm({
        schema: { type: ["string", "null"] } as Schema,
      });

      expect(page.getByRole("combobox").elements()).toHaveLength(0);
      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("an enum keeps its plain field", async () => {
      await renderFieldForm({
        schema: {
          type: ["string", "number"],
          enum: ["a", "b"],
        } as Schema,
      });

      expect(page.getByRole("combobox").elements()).toHaveLength(0);
      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("a const keeps its plain field", async () => {
      await renderFieldForm({
        schema: {
          type: ["string", "number"],
          const: "a",
        } as Schema,
      });

      expect(page.getByRole("combobox").elements()).toHaveLength(0);
      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });
  });
});
