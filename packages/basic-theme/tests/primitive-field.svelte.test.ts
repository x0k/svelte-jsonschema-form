import type { Schema, UiSchema } from "@sjsf/form";
import { resolver as compatResolver } from "@sjsf/form/resolvers/compat";
import { tick } from "svelte";
import { describe, expect, test, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const enumUiSchema: UiSchema = {
  "ui:components": {
    stringField: "enumField",
  },
};

describe("primitive field contracts", () => {
  describe("string", () => {
    test("renders initial value in input", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "string" },
        initialValue: "hello",
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toHaveValue("hello");
      expectValue(form, "hello");
    });

    test("datalist suggestions share a String() as one option", async () => {
      await renderFieldForm({
        schema: {
          type: "string",
          default: "true",
          examples: [1, "1", true, 2],
        },
      });

      const input =
        document.querySelector<HTMLInputElement>("input.sjsf-text")!;
      const datalist = document.querySelector("datalist")!;
      const options =
        document.querySelectorAll<HTMLOptionElement>("datalist option");

      expect([...options].map((option) => option.value)).toEqual([
        "1",
        "true",
        "2",
      ]);
      expect(input.getAttribute("list")).toBe(datalist.id);
      expect(input.getAttribute("aria-describedby")).toContain("__examples");
    });

    test("datalist does not suggest null, object or array examples", async () => {
      await renderFieldForm({
        schema: {
          type: "string",
          default: null,
          examples: ["a", null, { a: 1 }, [1]],
        },
      });

      const options =
        document.querySelectorAll<HTMLOptionElement>("datalist option");

      expect([...options].map((option) => option.value)).toEqual(["a"]);
    });

    test("no datalist is rendered or referenced when no suggestion can be shown", async () => {
      await renderFieldForm({
        schema: { type: "string", examples: [null, { a: 1 }] },
      });

      const input =
        document.querySelector<HTMLInputElement>("input.sjsf-text")!;

      expect(document.querySelector("datalist")).toBeNull();
      expect(input.hasAttribute("list")).toBe(false);
      expect(input.getAttribute("aria-describedby")).not.toContain(
        "__examples"
      );
    });

    test("user types text and value updates", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "string" },
      });

      await userEvent.fill(page.getByRole("textbox").first(), "world");
      expectValue(form, "world");
    });

    test("clearing value returns undefined (default emptyValue)", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "string" },
        initialValue: "hello",
      });

      await userEvent.fill(page.getByRole("textbox").first(), "");
      expectValue(form, undefined);
    });

    // https://github.com/rjsf-team/react-jsonschema-form/pull/5136
    test("clearing a field with a schema default does not re-apply the default", async () => {
      const onValid = vi.fn();
      const { form } = await renderFieldForm(
        {
          schema: {
            type: "object",
            properties: {
              name: { type: "string", default: "Chuck" },
            },
          },
          onValid,
        },
        { novalidate: true }
      );

      const input = page.getByRole("textbox").first();
      await expect.element(input).toHaveValue("Chuck");

      await userEvent.fill(input, "");

      await expect.element(input).toHaveValue("");
      expectValue(form, { name: undefined });

      await userEvent.click(page.getByRole("button", { name: "Submit" }));
      await tick();

      expect(onValid).toHaveBeenCalled();
      const [validValue] = onValid.mock.calls.at(-1)!;
      expect(validValue).toEqual({});
    });

    // https://github.com/rjsf-team/react-jsonschema-form/pull/5138
    test("clearing a second field does not re-apply the default to a previously-cleared field", async () => {
      const onValid = vi.fn();
      const { form } = await renderFieldForm(
        {
          schema: {
            type: "object",
            properties: {
              someStrings: { type: "string", default: "Chuck" },
              someNumbers: { type: "number", default: 1 },
            },
          },
          onValid,
        },
        { novalidate: true }
      );

      const textbox = page.getByRole("textbox").first();
      const spinbutton = page.getByRole("spinbutton").first();

      await expect.element(textbox).toHaveValue("Chuck");
      await expect.element(spinbutton).toHaveValue(1);

      // Clear the string field
      await userEvent.fill(textbox, "");
      await expect.element(textbox).toHaveValue("");
      expectValue(form, { someStrings: undefined, someNumbers: 1 });

      // Clear the number field — the string must NOT get its default re-applied
      await userEvent.clear(spinbutton);
      expectValue(form, { someStrings: undefined, someNumbers: undefined });

      // Clear the string field again — the number must NOT get its default re-applied
      await userEvent.fill(textbox, "");
      expectValue(form, { someStrings: undefined, someNumbers: undefined });

      // Submit and verify cleared fields don't carry defaults
      await userEvent.click(page.getByRole("button", { name: "Submit" }));
      await tick();

      expect(onValid).toHaveBeenCalled();
      const [validValue] = onValid.mock.calls.at(-1)!;
      expect(validValue).toEqual({});
    });

    test("clearing value returns empty string when stringEmptyValue is set", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "string" },
        uiSchema: { "ui:options": { stringEmptyValue: "" } },
        initialValue: "hello",
      });

      await userEvent.fill(page.getByRole("textbox").first(), "");
      expectValue(form, "");
    });

    test("disabled field renders disabled input", async () => {
      await renderFieldForm({
        schema: { type: "string" },
        initialValue: "locked",
        disabled: true,
      });

      await expect.element(page.getByRole("textbox").first()).toBeDisabled();
    });

    test.skip("readonly field renders readonly input", async () => {
      await renderFieldForm({
        schema: { type: "string", readOnly: true },
        initialValue: "readonly",
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toHaveAttribute("readonly", "");
    });

    test("renders error when provided", async () => {
      await renderFieldForm({
        schema: { type: "string" },
        initialErrors: [{ path: [], message: "required" }],
      });

      await expect.element(page.getByText("required")).toBeInTheDocument();
    });
  });

  describe("number", () => {
    test("renders initial value in input", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "number" },
        initialValue: 42,
      });

      await expect
        .element(page.getByRole("spinbutton").first())
        .toHaveValue(42);
      expectValue(form, 42);
    });

    test("user types number and value updates", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "number" },
      });

      await userEvent.fill(page.getByRole("spinbutton").first(), "3.14");
      expectValue(form, 3.14);
    });
  });

  describe("integer", () => {
    test("renders initial value in input", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "integer" },
        initialValue: 10,
      });

      await expect
        .element(page.getByRole("spinbutton").first())
        .toHaveValue(10);
      expectValue(form, 10);
    });

    test("user types integer and value updates", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "integer" },
      });

      await userEvent.fill(page.getByRole("spinbutton").first(), "25");
      expectValue(form, 25);
    });
  });

  describe("boolean", () => {
    const getCheckbox = () =>
      page.getByRole("checkbox").first().or(page.getByRole("switch").first());

    test("toggle false to true", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "boolean" },
        initialValue: false,
      });

      await userEvent.click(getCheckbox());
      expectValue(form, true);
    });

    test("toggle true to false", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "boolean" },
        initialValue: true,
      });

      await userEvent.click(getCheckbox());
      expectValue(form, false);
    });

    test("disabled boolean blocks toggle", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "boolean" },
        initialValue: true,
        disabled: true,
      });

      const checkbox = getCheckbox();
      await expect.element(checkbox).toBeDisabled();
      await expect.element(checkbox).toBeChecked();
      expectValue(form, true);
    });
  });

  describe("enum", () => {
    const enumSchema: Schema = {
      type: "string",
      enum: ["option-a", "option-b", "option-c"],
    };

    test("renders initial value in select", async () => {
      const { form } = await renderFieldForm({
        schema: enumSchema,
        uiSchema: enumUiSchema,
        initialValue: "option-b",
      });

      await expect
        .element(page.getByRole("combobox").first())
        .toHaveValue("option-b");
      expectValue(form, "option-b");
    });

    test("user selects different option and value updates", async () => {
      const { form } = await renderFieldForm({
        schema: enumSchema,
        uiSchema: enumUiSchema,
        initialValue: "option-a",
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "option-c"
      );
      expectValue(form, "option-c");
    });

    test("disabled enum field renders disabled select", async () => {
      await renderFieldForm({
        schema: { type: "string", enum: ["option-a", "option-b"] },
        uiSchema: enumUiSchema,
        initialValue: "option-a",
        disabled: true,
      });

      await expect.element(page.getByRole("combobox").first()).toBeDisabled();
    });
  });

  describe("select option descriptions", () => {
    const alternatives = [
      { const: "foo", title: "Foo", description: "Foo description" },
      { const: "bar", title: "Bar", description: "Bar description" },
    ];
    const oneOfSchema: Schema = { type: "string", oneOf: alternatives };
    const anyOfSchema: Schema = { type: "string", anyOf: alternatives };

    test.each([
      ["oneOf", oneOfSchema],
      ["anyOf", anyOfSchema],
    ])("renders the selected %s option description", async (_key, schema) => {
      const { form } = await renderFieldForm({
        schema,
        resolver: compatResolver,
        initialValue: "foo",
      });

      await expect
        .element(page.getByText("Foo description"))
        .toBeInTheDocument();
      await expect
        .element(page.getByText("Bar description"))
        .not.toBeInTheDocument();

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Bar" })
      );

      await expect
        .element(page.getByText("Bar description"))
        .toBeInTheDocument();
      await expect
        .element(page.getByText("Foo description"))
        .not.toBeInTheDocument();
      expectValue(form, "bar");
    });

    const optionUiSchemas: NonNullable<UiSchema["oneOf"]> = [
      { "ui:options": { description: "Foo UI description" } },
      { "ui:options": { description: "Bar UI description" } },
    ];

    test.each<[string, Schema, UiSchema]>([
      ["oneOf", oneOfSchema, { oneOf: optionUiSchemas }],
      ["anyOf", anyOfSchema, { anyOf: optionUiSchemas }],
    ])(
      "uses the %s option's ui:options.description",
      async (_key, schema, uiSchema) => {
        await renderFieldForm({
          schema,
          resolver: compatResolver,
          initialValue: "foo",
          uiSchema,
        });

        await expect
          .element(page.getByText("Foo UI description"))
          .toBeInTheDocument();
        await expect
          .element(page.getByText("Foo description"))
          .not.toBeInTheDocument();
        await expect
          .element(page.getByText("Bar UI description"))
          .not.toBeInTheDocument();

        const select = page.getByRole("combobox").first();
        await userEvent.selectOptions(
          select,
          select.getByRole("option", { name: "Bar" })
        );

        await expect
          .element(page.getByText("Bar UI description"))
          .toBeInTheDocument();
        await expect
          .element(page.getByText("Foo UI description"))
          .not.toBeInTheDocument();
      }
    );

    test("selected option description is used instead of the schema description", async () => {
      await renderFieldForm({
        schema: { ...oneOfSchema, description: "Schema description" },
        resolver: compatResolver,
        initialValue: "foo",
      });

      await expect
        .element(page.getByText("Foo description"))
        .toBeInTheDocument();
      await expect
        .element(page.getByText("Schema description"))
        .not.toBeInTheDocument();
    });

    test("ui:options.description is used instead of the selected option description", async () => {
      await renderFieldForm({
        schema: { ...oneOfSchema, description: "Schema description" },
        resolver: compatResolver,
        initialValue: "foo",
        uiSchema: { "ui:options": { description: "UI description" } },
      });

      await expect
        .element(page.getByText("UI description"))
        .toBeInTheDocument();
      await expect
        .element(page.getByText("Foo description"))
        .not.toBeInTheDocument();
      await expect
        .element(page.getByText("Schema description"))
        .not.toBeInTheDocument();
    });

    test("does not render the selected description when the title is hidden", async () => {
      await renderFieldForm({
        schema: oneOfSchema,
        resolver: compatResolver,
        initialValue: "foo",
        uiSchema: { "ui:options": { hideTitle: true } },
      });

      await expect
        .element(page.getByText("Foo description"))
        .not.toBeInTheDocument();
    });

    test("does not render selected descriptions for a multi-select", async () => {
      await renderFieldForm({
        schema: {
          type: "array",
          uniqueItems: true,
          items: oneOfSchema,
        },
        resolver: compatResolver,
        initialValue: ["foo"],
      });

      await expect.element(page.getByText("Foo")).toBeInTheDocument();
      await expect
        .element(page.getByText("Foo description"))
        .not.toBeInTheDocument();
    });
  });

  describe("select options keyword", () => {
    const alternatives = [
      { const: "foo", title: "Foo" },
      { const: "bar", title: "Bar" },
    ];
    // An empty `anyOf` is rejected by the JSON Schema meta-schema, so skip the
    // real validator and render the field on its own.
    const validator = {
      isValid: () => true,
      validateFormValue: () => ({ value: undefined }),
    };

    test("renders a populated oneOf when anyOf is empty", async () => {
      const { form } = await renderFieldForm({
        schema: { type: "string", anyOf: [], oneOf: alternatives },
        resolver: compatResolver,
        validator,
        initialValue: "foo",
      });

      const select = page.getByRole("combobox").first();
      await expect
        .element(select.getByRole("option", { name: "Bar" }))
        .toBeInTheDocument();

      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Bar" })
      );
      expectValue(form, "bar");
    });

    test("renders anyOf when both keyword lists are populated", async () => {
      const { form } = await renderFieldForm({
        schema: {
          type: "string",
          anyOf: alternatives,
          oneOf: [{ const: "baz", title: "Baz" }],
        },
        resolver: compatResolver,
        validator,
        initialValue: "foo",
      });

      const select = page.getByRole("combobox").first();
      await expect
        .element(select.getByRole("option", { name: "Baz" }))
        .not.toBeInTheDocument();

      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Bar" })
      );
      expectValue(form, "bar");
    });
  });
});
