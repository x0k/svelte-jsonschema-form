import { createFormValidator } from "@sjsf/ajv8-validator";
import {
  BasicForm,
  createForm,
  getValueSnapshot,
  type FormOptions,
} from "@sjsf/form";
import { DEFAULT_ID_PREFIX } from "@sjsf/form";
import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/templates/extra/optional-object-include";
import "@sjsf/form/templates/extra/optional-field-include";
import "@sjsf/form/templates/extra/optional-array-include";
import "@sjsf/form/templates/extra/optional-multi-field-include";
import { translation } from "@sjsf/form/translations/en";
import { expect } from "vitest";
import { render } from "vitest-browser-svelte";

import { theme } from "../src/index.js";
import "../src/specs.js";

const defaults = {
  theme,
  translation,
  resolver,
  validator: createFormValidator,
  merger: createFormMerger,
  idBuilder: createFormIdBuilder({ idPrefix: DEFAULT_ID_PREFIX }),
};

export async function renderFieldForm(
  options: Partial<Omit<FormOptions<any>, "theme">> &
    Pick<FormOptions<any>, "schema">
) {
  const target = document.body.appendChild(document.createElement("div"));
  const form = createForm({
    ...defaults,
    ...options,
  });
  await render(BasicForm, {
    target,
    props: { form },
  });
  return { form };
}

export function expectValue(
  form: ReturnType<typeof createForm>,
  expected: unknown
) {
  expect(getValueSnapshot(form)).toEqual(expected);
}
