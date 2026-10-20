import { getValueSnapshot } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";

import { expectValue, renderFieldForm } from "./helpers.js";
import {
  ambiguousSchema,
  anyOfDisjointDefaultsSchema,
  arrayDefaultsOneOfSchema,
  arrayItemAnyOfSchema,
  dependencyDefaultsSchema,
  discriminatedSchema,
  discriminatedUiSchema,
  formattedStringOneOfSchema,
  numberAnyOfSchema,
  numberOneOfSchema,
  objectAndArrayDefaultsOneOfSchema,
  objectSharedAnyOfSchema,
  objectSharedOneOfSchema,
  oneOfDisjointDefaultsSchema,
  plainOneOfSchema,
  refObjectAnyOfSchema,
  refObjectOneOfSchema,
  stringAnyOfSchema,
  stringOneOfSchema,
  swappedObjectDefaultSchema,
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

    test("restores defaults when switching back to person", async () => {
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
      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Person from UI" })
      );

      expectValue(form, {
        kind: "person",
        name: "Ada",
        shared: "kept",
      });
    });
  });

  describe("ambiguous oneOf", () => {
    test("selects first option by default", async () => {
      const { form } = await renderFieldForm({
        schema: ambiguousSchema,
      });

      expectValue(form, { shared: "string-default" });
    });

    test("applies the new default when types differ across options", async () => {
      const { form } = await renderFieldForm({
        schema: ambiguousSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Number branch");
      await userEvent.selectOptions(select, "String branch");

      // shared was a number from option 2, which the string option cannot
      // hold, so its default replaces the cleared value
      expectValue(form, { shared: "string-default" });
    });
  });

  describe("plain oneOf", () => {
    test("renders first option by default", async () => {
      const { form } = await renderFieldForm({
        schema: plainOneOfSchema,
      });

      expectValue(form, { firstField: "default-first" });
    });

    test("switch to second option", async () => {
      const { form } = await renderFieldForm({
        schema: plainOneOfSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Second");
      expectValue(form, { secondField: 42 });
    });

    test("restores defaults when returning to first option", async () => {
      const { form } = await renderFieldForm({
        schema: plainOneOfSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Second");
      await userEvent.selectOptions(select, "First");

      expectValue(form, { firstField: "default-first" });
    });
  });

  describe("object and array option defaults (rjsf#4476)", () => {
    test("restores nested object and array defaults when switching options", async () => {
      const { form } = await renderFieldForm({
        schema: objectAndArrayDefaultsOneOfSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Second");

      expectValue(form, {
        kind: "second",
        runner: { name: "second", ratio: 0 },
        list: [2],
      });

      await userEvent.selectOptions(select, "First");

      expectValue(form, {
        kind: "first",
        runner: { name: "first", ratio: 0 },
        list: [1],
      });
    });

    test("keeps a nested value edited away from the old default", async () => {
      const { form } = await renderFieldForm({
        schema: objectAndArrayDefaultsOneOfSchema,
        initialValue: {
          kind: "first",
          runner: { name: "custom", ratio: 0 },
          list: [1],
        },
      });

      await userEvent.selectOptions(
        page.getByRole("combobox").first(),
        "Second"
      );

      expectValue(form, {
        kind: "second",
        runner: { name: "custom", ratio: 0 },
        list: [2],
      });
    });
  });

  describe("array option defaults (rjsf#4476)", () => {
    test("replaces an option-level array default", async () => {
      const { form } = await renderFieldForm({
        schema: arrayDefaultsOneOfSchema,
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(select, "Second");

      expectValue(form, [2]);
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
      expectValue(form, { status: { reason: undefined } });
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
      expectValue(form, { status: { reason: undefined } });
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

  describe("non-object options inherit parent keywords (#5359)", () => {
    test("array option renders the parent's items", async () => {
      await renderFieldForm({
        schema: arrayItemAnyOfSchema,
        initialValue: ["one"],
      });

      await expect
        .element(page.getByRole("textbox", { name: /Item/ }))
        .toBeInTheDocument();
    });

    test("string option uses the parent's format", async () => {
      await renderFieldForm({
        schema: formattedStringOneOfSchema,
      });

      expect(document.querySelector('input[type="date"]')).not.toBeNull();
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

  // Ported from rjsf PR #5218
  describe("anyOf disjoint defaults (#3736)", () => {
    test("restores defaults and preserves shared properties when toggling options", async () => {
      const { form } = await renderFieldForm({
        schema: anyOfDisjointDefaultsSchema,
        initialValue: { age: 42 },
      });

      const select = page.getByRole("combobox").first();
      // Option 0 is selected by default, firstName should have its default
      expectValue(form, { firstName: "Chuck", age: 42 });

      // Switch to option 1 (idCode) — firstName drops, age preserved
      await userEvent.selectOptions(select, "Second method of identification");
      const val1 = getValueSnapshot(form) as any;
      expect(val1.firstName).toBeUndefined();
      expect(val1.age).toBe(42);

      // Switch back to option 0 — firstName default restored, age still preserved
      await userEvent.selectOptions(select, "First method of identification");
      expectValue(form, { firstName: "Chuck", age: 42 });
    });
  });

  describe("oneOf disjoint defaults (#3736)", () => {
    test("restores defaults when returning to an option with disjoint properties", async () => {
      const { form } = await renderFieldForm({
        schema: oneOfDisjointDefaultsSchema,
      });

      const select = page.getByRole("combobox").first();

      // Switch to option 1 (idCode)
      await userEvent.selectOptions(select, "Second method of identification");
      // Switch back to option 0 — firstName default should be restored
      await userEvent.selectOptions(select, "First method of identification");

      expectValue(form, { firstName: "Chuck" });
    });
  });

  describe("swapped object defaults (#5349)", () => {
    test("replaces an object default declared without property defaults", async () => {
      const { form } = await renderFieldForm({
        schema: swappedObjectDefaultSchema,
        initialValue: { mode: "first", value: { branch: "first" } },
      });

      await userEvent.fill(page.getByRole("textbox").first(), "second");

      expectValue(form, { mode: "second", value: { branch: "second" } });
    });
  });

  describe("dependency defaults in controlled forms", () => {
    test("preserves an empty array already present when enabling the dependency branch", async () => {
      const { form } = await renderFieldForm({
        schema: dependencyDefaultsSchema,
        initialValue: {
          triggersOverride: false,
          triggers: [],
          repoData: { triggersOverride: true, triggers: [] },
        },
      });

      const select = page.getByRole("combobox").first();
      await userEvent.selectOptions(
        select,
        select.getByRole("option", { name: "Override Repo Triggers" })
      );

      expectValue(form, {
        triggersOverride: true,
        triggers: [],
      });
    });
  });
});
