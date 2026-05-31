import { render } from "vitest-browser-svelte";
import { describe, expect, test } from "vitest";
import { type Theme } from "@sjsf/form";

import TestForm from "./test-form.svelte";
import {
  ambiguousSchema,
  type CombinationFieldTestOptions,
  defaultsWith,
  discriminatedSchema,
  discriminatedUiSchema,
  type CombinationTestFormOptions,
  withTestSelect,
} from "./combination-field-core.js";

function renderForm(
  options: CombinationTestFormOptions,
  testOptions?: CombinationFieldTestOptions,
) {
  const target = document.body.appendChild(document.createElement("div"));
  return render(TestForm, {
    target,
    context: testOptions?.context,
    props: defaultsWith({
      ...testOptions?.defaultFormOptions,
      ...options,
      theme: withTestSelect(options.theme),
    }),
  });
}

function readValue(screen: ReturnType<typeof render>): unknown {
  const text = screen.getByTestId("form-value").element().textContent;
  expect(text).toBeTruthy();
  return JSON.parse(text!);
}

async function selectOption(screen: ReturnType<typeof render>, label: string) {
  const option = screen.getByRole("option", { name: label }).first();
  const value = option.element().getAttribute("value");
  expect(value).toBeTruthy();
  await screen.getByTestId("combination-selector").selectOptions(value!);
}

export function combinationFieldTests(
  theme: Theme,
  testOptions?: CombinationFieldTestOptions,
) {
  describe("combination fields", () => {
    test("selects initial option from discriminator value", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        },
        testOptions,
      );

      await expect
        .element(screen.getByTestId("combination-selector"))
        .toHaveValue("1");
      expect(readValue(screen)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("renders current option fields after normalization", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: { kind: "company", shared: "kept" },
        },
        testOptions,
      );

      await expect
        .element(screen.getByLabelText("Company Name"))
        .toHaveValue("Acme");
      expect(readValue(screen)).toEqual({
        kind: "company",
        shared: "kept",
        companyName: "Acme",
      });
    });

    test("keeps internally normalized object on an ambiguous option", async () => {
      const screen = renderForm(
        {
          theme,
          schema: ambiguousSchema,
        },
        testOptions,
      );

      await expect
        .element(screen.getByTestId("combination-selector"))
        .toHaveValue("0");
      expect(readValue(screen)).toEqual({ shared: "string-default" });
    });

    test("sanitizes previous option data when switching options", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
          initialValue: {
            kind: "person",
            name: "Grace",
            shared: "kept",
          },
        },
        testOptions,
      );

      await selectOption(screen, "Company kind");
      await expect
        .element(screen.getByTestId("combination-selector"))
        .toHaveValue("1");
      expect(readValue(screen)).toEqual({
        kind: "company",
        companyName: "Acme",
        shared: "kept",
      });
    });

    test("uses discriminator ui-schema titles before schema titles", async () => {
      const screen = renderForm(
        {
          theme,
          schema: discriminatedSchema,
          uiSchema: discriminatedUiSchema,
        },
        testOptions,
      );

      await expect
        .element(screen.getByRole("option", { name: "Person from UI" }))
        .toBeInTheDocument();
      await expect
        .element(screen.getByRole("option", { name: "Company kind" }))
        .toBeInTheDocument();
    });
  });
}
