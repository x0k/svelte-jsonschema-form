import { fail } from "@sveltejs/kit";
import type { AnyFormValueValidatorError } from "@sjsf/form";
import type { ValidatedFormData } from "@sjsf/sveltekit";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { validator } from "$lib/form-defaults";

import { schema, steps, type CompletedValue, type Value } from "./model";
import type { Actions } from "./$types";

const parseFormData = makeFormDataParser({
  validator,
});

export const load = async () => {
  const form = initForm({
    schema,
    sendSchema: true,
    initialValue: {
      step: "first",
      first: {
        name: "",
      },
      second: {
        email: "",
      },
    } satisfies CompletedValue,
  });
  return { form };
};

type ValidatedForm = ValidatedFormData<
  AnyFormValueValidatorError<typeof validator>,
  true
>;

function isValidForm(form: ValidatedForm): form is ValidatedForm & {
  data: Value;
} {
  return form.isValid;
}

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema,
    });
    console.log(data)
    const form = await validateForm({
      sendData: true,
      request,
      schema,
      validator,
      data,
    });
    if (!isValidForm(form)) {
      return fail(400, { form });
    }
    const index = steps.indexOf(form.data.step);
    if (index < steps.length - 1) {
      form.isValid = false;
      form.data.step = steps[index + 1];
    } else {
      // all steps completed
      console.log(form.data as CompletedValue);
    }
    return {
      form,
    };
  },
} satisfies Actions;
