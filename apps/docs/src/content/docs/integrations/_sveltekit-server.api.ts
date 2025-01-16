import type { Schema } from "@sjsf/form";
import { createValidator2 } from "@sjsf/ajv8-validator";
import {
  initForm,
  makeFormDataParser,
  validateForm,
} from "@sjsf/sveltekit/server";

import type { Actions } from "./$types";

const validator = createValidator2();

const parseFormData = makeFormDataParser({
  validator,
});

const schema: Schema = {
  title: "Registration form",
  type: "object",
  required: ["firstName", "lastName"],
  properties: {
    firstName: {
      type: "string",
      title: "First name",
    },
    lastName: {
      type: "string",
      title: "Last name",
    },
  },
};

export const load = async () => {
  const form = initForm({ schema, sendSchema: true });
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    return {
      form: validateForm({
        schema,
        validator,
        data: await parseFormData({
          schema,
          request,
        }),
        sendData: true,
      }),
    };
  },
} satisfies Actions;
