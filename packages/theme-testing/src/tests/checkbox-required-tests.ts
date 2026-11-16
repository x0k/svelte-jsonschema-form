import type { Schema, Theme } from "@sjsf/form";
import { describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";

import * as defaults from "../lib/form-defaults.js";
import DefaultForm from "./form.svelte";
import type { MatchSnapshotOptions } from "./snapshot-helpers.js";

function checkboxSchema(property: Schema, required: boolean): Schema {
  return {
    type: "object",
    properties: {
      agree: {
        type: "boolean",
        title: "Agree",
        ...property,
      },
    },
    ...(required ? { required: ["agree"] } : {}),
  };
}

/**
 * Checks the required marker on checkbox widgets. Only checkboxes whose schema
 * requires `true` get the marker, because leaving a plain required checkbox
 * unchecked is valid.
 */
export function requiredCheckboxTests(
  theme: Theme,
  { context, defaultFormOptions, Form = DefaultForm }: MatchSnapshotOptions = {}
) {
  describe("required checkbox", () => {
    async function renderCheckbox(schema: Schema) {
      await render(Form, {
        target: document.body.appendChild(document.createElement("div")),
        context,
        props: {
          ...defaults,
          ...defaultFormOptions,
          theme,
          schema,
        },
      });
    }

    const checkboxWithMarker = () =>
      page.getByRole("checkbox", { name: /Agree \*$/ });
    const checkboxWithoutMarker = () =>
      page.getByRole("checkbox", { name: /Agree$/ });

    test("shows a marker when a required schema has `const: true`", async () => {
      await renderCheckbox(checkboxSchema({ const: true }, true));
      await expect.element(checkboxWithMarker()).toBeInTheDocument();
    });

    test("shows a marker when a required schema has `enum: [true]`", async () => {
      await renderCheckbox(checkboxSchema({ enum: [true] }, true));
      await expect.element(checkboxWithMarker()).toBeInTheDocument();
    });

    test("does not show a marker for a required boolean", async () => {
      await renderCheckbox(checkboxSchema({}, true));
      await expect.element(checkboxWithoutMarker()).toBeInTheDocument();
    });

    test("does not show a marker when `const: true` is not required", async () => {
      await renderCheckbox(checkboxSchema({ const: true }, false));
      await expect.element(checkboxWithoutMarker()).toBeInTheDocument();
    });

    test("does not show a marker when `false` is allowed", async () => {
      await renderCheckbox(checkboxSchema({ enum: [true, false] }, true));
      await expect.element(checkboxWithoutMarker()).toBeInTheDocument();
    });
  });
}
