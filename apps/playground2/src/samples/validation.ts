import type { ErrorObject } from "ajv";
import {
  isFormValueValidator,
  pathToId,
  type SchemaValue,
  type ValidationError,
} from "@sjsf/form";

import type { Sample } from "./Sample";

function customValidate(
  value: SchemaValue | undefined
): ValidationError<ErrorObject>[] {
  const { pass1, pass2 } = value as {
    pass1: string;
    pass2: string;
  };
  if (pass1 !== pass2) {
    return [
      {
        error: {} as ErrorObject,
        instanceId: pathToId(["pass2"]),
        propertyTitle: "Repeat password",
        message: "Passwords don't match.",
      },
    ];
  }
  return [];
}

const validation: Sample = {
  status: "perfect",
  schema: {
    title: "Custom validation",
    description:
      "This form defines custom validation rules checking that the two passwords match. There is also a custom validation message when submitting an age < 18, which can only be seen if HTML5 validation is turned off.",
    type: "object",
    properties: {
      pass1: {
        title: "Password",
        type: "string",
        minLength: 3,
      },
      pass2: {
        title: "Repeat password",
        type: "string",
        minLength: 3,
      },
      age: {
        title: "Age",
        type: "number",
        minimum: 18,
      },
    },
  },
  uiSchema: {
    pass1: {
      "ui:options": {
        text: { type: "password" },
        flowbite3Text: { type: "password" },
        shadcnText: { type: "password" },
      },
    },
    pass2: {
      "ui:options": {
        text: { type: "password" },
        flowbite3Text: { type: "password" },
        shadcnText: { type: "password" },
      },
    },
  },
  formData: {},
  customizeValidator: (v) => {
    return {
      ...v,
      validateFormValue(rootSchema, formValue) {
        const errors = isFormValueValidator(v)
          ? v.validateFormValue(rootSchema, formValue).map((error) => {
              if (
                error.error.keyword === "minimum" &&
                error.error.schemaPath === "#/properties/age/minimum"
              ) {
                return Object.assign({}, error, {
                  message: "You need to be 18 because of some legal thing",
                });
              }
              return error;
            })
          : [];
        return errors.concat(customValidate(formValue));
      },
    };
  },
};

export default validation;
