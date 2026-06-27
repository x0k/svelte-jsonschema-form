import type { Schema, UiSchema } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";

const enumUiSchema: UiSchema = {
  "ui:components": {
    stringField: "enumField",
  },
  "ui:options": {
    enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
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
});
