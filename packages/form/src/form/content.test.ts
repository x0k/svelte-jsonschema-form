import { expect, it } from "vitest";
import { render, screen, getByText } from "@testing-library/svelte";
import { userEvent } from "@testing-library/user-event";

import type { Schema } from "@/core/index.js";
import { theme } from "@/basic-theme/index.js";
import { createValidator } from "@/fake-validator.js";
import { translation } from "@/translations/en.js";

import { FORM_CONTEXT } from "./context/index.js";
import { createForm3 } from "./create-form.svelte.js";
import Content from "./content.svelte";
import {
  computePseudoId,
  DEFAULT_ID_PREFIX,
  DEFAULT_ID_SEPARATOR,
  DEFAULT_PSEUDO_ID_SEPARATOR,
  pathToId,
} from "./id-schema.js";

it("should preserve state of multi select field in array", async () => {
  const user = userEvent.setup();
  const schema: Schema = {
    type: "array",
    title: "Array",
    items: {
      anyOf: [
        {
          title: "Foo option",
          properties: {
            foo: {
              type: "string",
            },
          },
        },
        {
          title: "Bar option",
          properties: {
            bar: {
              type: "string",
            },
          },
        },
      ],
    },
  };

  const validator = createValidator();

  const form = createForm3({
    ...theme,
    validator,
    translation,
    schema,
    initialValue: [{}, {}],
  });

  render(Content, {
    context: new Map([[FORM_CONTEXT, form.context]]),
  });

  const id = pathToId(DEFAULT_ID_PREFIX, DEFAULT_ID_SEPARATOR, [1]);
  const pseudoId = computePseudoId(DEFAULT_PSEUDO_ID_SEPARATOR, id, "anyof");
  const el = document.getElementById(pseudoId);
  if (el === null) {
    throw new Error(`cannot find ${pseudoId} select`);
  }
  await user.selectOptions(el, "Bar option");

  const input = screen.getByLabelText("bar");
  await user.type(input, "bar state");

  const firstItem = document.querySelector('[data-layout="array-item"]');
  if (!(firstItem instanceof HTMLElement)) {
    throw new Error("cannot find first item");
  }
  const delBtn = getByText(firstItem, "Del");
  user.click(delBtn);

  const input2 = screen.getByLabelText("bar");
  expect(input2).toHaveValue("bar state");
});
