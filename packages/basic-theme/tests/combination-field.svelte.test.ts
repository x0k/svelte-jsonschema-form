import { getValueSnapshot } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  numberAnyOfSchema,
  numberOneOfSchema,
  objectSharedAnyOfSchema,
  objectSharedOneOfSchema,
  plainOneOfSchema,
  refObjectAnyOfSchema,
  refObjectOneOfSchema,
  stringAnyOfSchema,
  stringOneOfSchema,
} from "./test-data/combination-defaults.js";

const enumUiSchema = {
  status: {
    combinationFieldOptionSelector: {
      "ui:options": {
        enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
      },
    },
  },
};

describe("combination field contracts", () => {
  describe("discriminated oneOf", () => {
    test("selects initial option from discriminator value", async () => {
      const { form } = await renderFieldForm({
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: { kind: "company", shared: "kept" },
      });

      const val = getValueSnapshot(form) as any;
      expect(val.kind).toBe("company");
      expect(val.shared).toBe("kept");
    });

    test("switch from person to company", async () => {
      const { form } = await renderFieldForm({
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
        initialValue: {
          kind: "person",
          name: "Grace",
          shared: "kept",
        },
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Company kind" })
      );
      const val = getValueSnapshot(form) as any;
      expect(val.kind).toBe("company");
      expect(val.companyName).toBeDefined();
      expect(val.shared).toBe("kept");
    });
  });

  describe("ambiguous oneOf", () => {
    test("selects first option by default", async () => {
      const { form } = await renderFieldForm({
        schema: ambiguousSchema,
      });

      const val = getValueSnapshot(form) as any;
      expect(val.shared).toBe("string-default");
    });
  });

  describe("plain oneOf", () => {
    test("renders first option by default", async () => {
      const { form } = await renderFieldForm({
        schema: plainOneOfSchema,
      });

      const val = getValueSnapshot(form) as any;
      expect(val.firstField).toBe("default-first");
    });

    test("switch to second option", async () => {
      const { form } = await renderFieldForm({
        schema: plainOneOfSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Second");
      const val = getValueSnapshot(form) as any;
      expect(val.secondField).toBeDefined();
    });
  });

  describe("option labels", () => {
    test("shows correct option labels", async () => {
      await renderFieldForm({
        schema: discriminatedSchema,
        uiSchema: discriminatedUiSchema,
      });

      await expect
        .element(page.getByRole("combobox").first().getByRole("option").first())
        .toHaveTextContent("Person from UI");
      await expect
        .element(page.getByRole("combobox").first().getByRole("option").last())
        .toHaveTextContent("Company kind");
    });
  });

  describe("$ref oneOf with undefaulted properties (#3833)", () => {
    test("selection does not reset when switching to option without defaults", async () => {
      const { form } = await renderFieldForm({
        schema: refObjectOneOfSchema,
        uiSchema: enumUiSchema,
        initialValue: { status: {} },
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Rejected");

      await expect.element(select).toHaveValue("1");
      const val = getValueSnapshot(form) as any;
      expect(val.status).toEqual({ reason: undefined });
    });
  });

  describe("$ref anyOf with undefaulted properties (#3833)", () => {
    test("selection does not reset when switching to option without defaults", async () => {
      const { form } = await renderFieldForm({
        schema: refObjectAnyOfSchema,
        uiSchema: enumUiSchema,
        initialValue: { status: {} },
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Rejected");

      await expect.element(select).toHaveValue("1");
      const val = getValueSnapshot(form) as any;
      expect(val.status).toEqual({ reason: undefined });
    });
  });

  describe("primitive type with non-select oneOf", () => {
    test("string oneOf renders text input", async () => {
      await renderFieldForm({
        schema: stringOneOfSchema,
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("string oneOf produces string formData", async () => {
      const { form } = await renderFieldForm({
        schema: stringOneOfSchema,
      });

      await userEvent.fill(page.getByRole("textbox").first(), "192.168.1.1");
      expectValue(form, "192.168.1.1");
    });

    test("number oneOf renders spinbutton", async () => {
      await renderFieldForm({
        schema: numberOneOfSchema,
      });

      await expect
        .element(page.getByRole("spinbutton").first())
        .toBeInTheDocument();
    });

    test("number oneOf produces number formData", async () => {
      const { form } = await renderFieldForm({
        schema: numberOneOfSchema,
      });

      await userEvent.fill(page.getByRole("spinbutton").first(), "42");
      expectValue(form, 42);
    });

    test("object with shared properties renders shared field and select", async () => {
      await renderFieldForm({
        schema: objectSharedOneOfSchema,
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
      await expect
        .element(page.getByRole("combobox").first())
        .toBeInTheDocument();
    });
  });

  describe("primitive type with non-select anyOf", () => {
    test("string anyOf renders text input", async () => {
      await renderFieldForm({
        schema: stringAnyOfSchema,
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
    });

    test("string anyOf produces string formData", async () => {
      const { form } = await renderFieldForm({
        schema: stringAnyOfSchema,
      });

      await userEvent.fill(page.getByRole("textbox").first(), "hello");
      expectValue(form, "hello");
    });

    test("number anyOf renders spinbutton", async () => {
      await renderFieldForm({
        schema: numberAnyOfSchema,
      });

      await expect
        .element(page.getByRole("spinbutton").first())
        .toBeInTheDocument();
    });

    test("number anyOf produces number formData", async () => {
      const { form } = await renderFieldForm({
        schema: numberAnyOfSchema,
      });

      await userEvent.fill(page.getByRole("spinbutton").first(), "42");
      expectValue(form, 42);
    });

    test("object with shared properties renders shared field and select", async () => {
      await renderFieldForm({
        schema: objectSharedAnyOfSchema,
      });

      await expect
        .element(page.getByRole("textbox").first())
        .toBeInTheDocument();
      await expect
        .element(page.getByRole("combobox").first())
        .toBeInTheDocument();
    });
  });
});
