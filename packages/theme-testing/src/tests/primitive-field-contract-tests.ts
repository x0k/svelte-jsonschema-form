import { type Theme } from "@sjsf/form";
import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
import { describe, expect } from "vitest";

import {
  clickCheckbox,
  doAssertDisabled,
  doAssertSelected,
  doSelect,
  expectValue,
  getInputValue,
  renderFieldForm,
  setInputValue,
  skippableTest,
} from "./field-contract-helpers.js";
import { type PrimitiveFieldTestContext } from "./field-test-context.js";

const enumUiSchema = {
  "ui:components": {
    stringField: "enumField",
  },
  "ui:options": {
    enumValueMapperBuilder: () => new StringEnumValueMapperBuilder(),
  },
} as any;

export function primitiveFieldContractTests(
  theme: Theme,
  ctx: PrimitiveFieldTestContext = {}
) {
  const test = skippableTest(ctx.skipTests);

  describe("primitive field contracts", () => {
    describe("string", () => {
      test("renders initial value in input", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          initialValue: "hello",
        });

        expect(getInputValue(screen.locator)).toBe("hello");
        expectValue(form, "hello");
      });

      test("user types text and value updates", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
        });

        setInputValue(screen.locator, "world");
        expectValue(form, "world");
      });

      test("clearing value returns undefined (default emptyValue)", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          initialValue: "hello",
        });

        setInputValue(screen.locator, "");
        expectValue(form, undefined);
      });

      test("clearing value returns empty string when stringEmptyValue is set", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          uiSchema: { "ui:options": { stringEmptyValue: "" } },
          initialValue: "hello",
        });

        setInputValue(screen.locator, "");
        expectValue(form, "");
      });

      test("disabled field renders disabled input", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          initialValue: "locked",
          disabled: true,
        });

        const form = screen.locator.element();
        const input = form.querySelector(
          'input:not([type="hidden"]):not([type="checkbox"])'
        ) as HTMLInputElement;
        expect(input?.disabled).toBe(true);
      });

      test("readonly field renders readonly input", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          initialValue: "readonly",
          readOnly: true,
        });

        const form = screen.locator.element();
        const input = form.querySelector(
          'input:not([type="hidden"]):not([type="checkbox"])'
        ) as HTMLInputElement;
        expect(input?.readOnly).toBe(true);
      });

      test("renders error when provided", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" },
          initialErrors: [{ path: [], message: "required" }],
        });

        await expect.element(screen.getByText("required")).toBeInTheDocument();
      });
    });

    describe("number", () => {
      test("renders initial value in input", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "number" },
          initialValue: 42,
        });

        expect(getInputValue(screen.locator)).toBe("42");
        expectValue(form, 42);
      });

      test("user types number and value updates", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "number" },
        });

        setInputValue(screen.locator, "3.14");
        expectValue(form, 3.14);
      });
    });

    describe("integer", () => {
      test("renders initial value in input", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "integer" },
          initialValue: 10,
        });

        expect(getInputValue(screen.locator)).toBe("10");
        expectValue(form, 10);
      });

      test("user types integer and value updates", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "integer" },
        });

        setInputValue(screen.locator, "25");
        expectValue(form, 25);
      });
    });

    describe("boolean", () => {
      test("toggle false to true", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "boolean" },
          initialValue: false,
        });

        clickCheckbox(screen.locator);
        expectValue(form, true);
      });

      test("toggle true to false", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "boolean" },
          initialValue: true,
        });

        clickCheckbox(screen.locator);
        expectValue(form, false);
      });

      test("disabled boolean blocks toggle", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: { type: "boolean" },
          initialValue: true,
          disabled: true,
        });

        clickCheckbox(screen.locator);
        expectValue(form, true);
      });
    });

    describe("enum", () => {
      const enumSchema = {
        type: "string" as const,
        enum: ["option-a", "option-b", "option-c"],
      };

      test("renders initial value in select", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: enumSchema,
          uiSchema: enumUiSchema,
          initialValue: "option-b",
        });

        await doAssertSelected(ctx, screen.locator, "option-b");
        expectValue(form, "option-b");
      });

      test("user selects different option and value updates", async () => {
        const { screen, form } = renderFieldForm(ctx, {
          theme,
          schema: enumSchema,
          uiSchema: enumUiSchema,
          initialValue: "option-a",
        });

        await doSelect(ctx, screen.locator, "option-c");
        expectValue(form, "option-c");
      });

      test("disabled enum field renders disabled select", async () => {
        const { screen } = renderFieldForm(ctx, {
          theme,
          schema: { type: "string" as const, enum: ["option-a", "option-b"] },
          uiSchema: enumUiSchema,
          initialValue: "option-a",
          disabled: true,
        });

        doAssertDisabled(ctx, screen.locator);
      });
    });
  });
}
