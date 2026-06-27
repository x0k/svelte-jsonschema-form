import { getValueSnapshot } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { renderFieldForm } from "./helpers.js";
import {
  ambiguousSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  plainOneOfSchema,
  refObjectAnyOfSchema,
  refObjectOneOfSchema,
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
});
