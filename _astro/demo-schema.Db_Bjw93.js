var e={type:`object`,properties:{id:{type:`string`,minLength:8,pattern:`^\\d+$`},active:{type:`boolean`},skills:{type:`array`,minItems:4,items:{type:`string`,minLength:5}},multipleChoicesList:{type:`array`,maxItems:2,items:{type:`string`,enum:[`foo`,`bar`,`fuzz`]}}}},t={id:{"ui:options":{title:`Identifier`}},active:{"ui:options":{title:`Active`}},multipleChoicesList:{"ui:options":{title:`Pick max two items`}}},n={id:`Invalid`,skills:[`karate`,`budo`,`aikido`],multipleChoicesList:[`foo`,`bar`,`fuzz`]},r=`import type { Schema, UiSchema } from "@sjsf/form";
import type { FromSchema } from "json-schema-to-ts";

export const schema = {
  type: "object",
  properties: {
    id: {
      type: "string",
      minLength: 8,
      pattern: "^\\\\d+$",
    },
    active: {
      type: "boolean",
    },
    skills: {
      type: "array",
      minItems: 4,
      items: {
        type: "string",
        minLength: 5,
      },
    },
    multipleChoicesList: {
      type: "array",
      maxItems: 2,
      items: {
        type: "string",
        enum: ["foo", "bar", "fuzz"],
      },
    },
  },
} as const satisfies Schema;

export type Model = FromSchema<typeof schema>;

export const uiSchema: UiSchema = {
  id: {
    "ui:options": {
      title: "Identifier",
    },
  },
  active: {
    "ui:options": {
      title: "Active",
    },
  },
  multipleChoicesList: {
    "ui:options": {
      title: "Pick max two items",
    },
  },
};

export const initialValue = {
  id: "Invalid",
  skills: ["karate", "budo", "aikido"],
  multipleChoicesList: ["foo", "bar", "fuzz"],
} satisfies Model;
`;export{t as i,n,e as r,r as t};