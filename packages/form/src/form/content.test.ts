import { it } from "vitest";
import { render, screen } from "@testing-library/svelte";

import type { Schema } from "@/core/index.js";
import { theme } from "@/basic-theme/index.js";
import { createValidator } from "@/fake-validator.js";
import { translation } from "@/translations/en.js";

import { FORM_CONTEXT } from "./context/index.js";
import { createForm3 } from "./create-form.svelte.js";
import Content from "./content.svelte";

it("should preserve multi select field state in array", () => {
  const schema: Schema = {
    type: "array",
    title: "Array",
    items: {
      anyOf: [
        {
          properties: {
            foo: {
              type: "string",
            },
          },
        },
        {
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
    props: { form }
  })
});
