import { fail } from "@sveltejs/kit";
import type { AnyFormValueValidatorError, SchemaValue } from "@sjsf/form";
import type { ValidatedFormData } from "@sjsf/sveltekit";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { validator } from "$lib/form-defaults";

import { schema, STEP_KEY, stepNames, type Stepped } from "./model";
import type { Actions } from "./$types";

const parseFormData = makeFormDataParser({
  validator,
});

export const load = async () => {
  const form = initForm({
    schema: schema,
    sendSchema: true,
    initialValue: {
      [STEP_KEY]: "first",
    } satisfies Stepped & SchemaValue,
  });
  return { form };
};

type ValidatedForm = ValidatedFormData<
  AnyFormValueValidatorError<typeof validator>,
  true
>;

function isValidForm(form: ValidatedForm): form is ValidatedForm & {
  data: Stepped;
} {
  return form.isValid;
}

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema: schema,
    });
    const form = await validateForm({
      sendData: true,
      request,
      schema: schema,
      validator,
      data,
    });
    if (!isValidForm(form)) {
      return fail(400, { form });
    }
    const index = stepNames.indexOf(form.data[STEP_KEY]);
    if (index < stepNames.length - 1) {
      form.isValid = false;
      form.data[STEP_KEY] = stepNames[index + 1];
    } else {
      // all steps completed
      console.log(form.data);
    }
    return {
      form,
    };
  },
} satisfies Actions;
