var e={type:`object`,title:`My form`,properties:{bool:{title:`bool (true)`,type:`boolean`,const:!0},number:{title:`number (min 1000)`,type:`number`,minimum:1e3},text:{title:`text (min length 5)`,type:`string`,minLength:5}},required:[`number`,`text`]},t={"ui:options":{form:{novalidate:!0}}},n=`import type { Schema, UiSchemaRoot } from "@sjsf/form";

export const objectSchema: Schema = {
  type: "object",
  title: "My form",
  properties: {
    bool: {
      title: "bool (true)",
      type: "boolean",
      const: true,
    },
    number: {
      title: "number (min 1000)",
      type: "number",
      minimum: 1000,
    },
    text: {
      title: "text (min length 5)",
      type: "string",
      minLength: 5,
    },
  },
  required: ["number", "text"],
};

export const objectUiSchema: UiSchemaRoot = {
  "ui:options": {
    form: {
      novalidate: true,
    },
  },
};
`;export{e as n,t as r,n as t};