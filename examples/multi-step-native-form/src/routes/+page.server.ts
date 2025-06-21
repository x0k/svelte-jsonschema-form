import { fail } from "@sveltejs/kit";
import type { Schema, AnyFormValueValidatorError } from "@sjsf/form";
import type { ValidatedFormData } from "@sjsf/sveltekit";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import { validator } from "$lib/form-defaults";

import type { Actions } from "./$types";

const parseFormData = makeFormDataParser({
  validator,
});

function createSteppedSchema(steps: Schema[]): Schema {
  function createCondition(lvl: number): Schema | undefined {
    if (lvl >= steps.length) {
      return;
    }
    return {
      if: { properties: { __step: { const: lvl } } },
      then: {
        allOf: steps.slice(0, lvl + 1),
      },
      else: createCondition(lvl + 1),
    };
  }
  return {
    type: "object",
    properties: {
      __step: {
        type: "number",
        default: 0,
      },
    },
    ...createCondition(0),
  };
}

const steps: Schema[] = [
  {
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",
        minLength: 1,
      },
    },
    required: ["name"],
  },
  {
    type: "object",
    properties: {
      email: {
        type: "string",
        title: "Email",
        format: "email",
      },
    },
    required: ["email"],
  },
];

const schema = createSteppedSchema(steps);

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

type ValidatedForm = ValidatedFormData<
  AnyFormValueValidatorError<typeof validator>,
  true
>;

function isValidSteppedForm(form: ValidatedForm): form is ValidatedForm & {
  data: { __step: number };
} {
  return form.isValid;
}

export const actions = {
  default: async ({ request }) => {
    const data = await parseFormData({
      request,
      schema,
    });
    const form = await validateForm({
      sendData: true,
      request,
      schema,
      validator,
      data,
    });
    if (!isValidSteppedForm(form)) {
      return fail(400, { form });
    }
    if (form.data.__step < steps.length - 1) {
      form.isValid = false;
      form.data.__step += 1;
    }
    return {
      form,
    };
  },
} satisfies Actions;
