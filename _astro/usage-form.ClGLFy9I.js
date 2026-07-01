import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import"./index-client.Dq5s0D8S.js";import{$t as t,At as n,Qt as r,an as i,at as a,et as o,jt as s,kt as c,st as l,wt as u}from"./client.B0k3dZbu.js";import{X as d,i as f,u as p}from"./form.DBP89p2-.js";import{a as m,i as h}from"./demo.CJm6_pxQ.js";import{n as g}from"./file-size.ByEHVLE9.js";var _=e({initialValue:()=>b,schema:()=>v,uiSchema:()=>y,withFile:()=>x}),v={title:`User Registration`,description:`Simple user registration form`,type:`object`,required:[`name`,`email`,`age`],properties:{name:{type:`string`,title:`Full Name`,minLength:2,maxLength:50},email:{type:`string`,title:`Email`,format:`email`},age:{type:`integer`,title:`Age`,minimum:13,maximum:120},country:{type:`string`,title:`Country`,enum:[`US`,`CA`,`UK`,`DE`,`FR`]},experience:{type:`string`,title:`Work Experience`,enum:[`beginner`,`intermediate`,`advanced`]},skills:{type:`array`,title:`Skills`,items:{type:`string`,enum:[`HTML`,`CSS`,`JS/TS`,`Svelte`]},uniqueItems:!0,minItems:4},bio:{type:`string`,title:`About You`,maxLength:200},startDate:{type:`string`,title:`Available Start Date`,format:`date`},resume:{title:`Upload Resume`}}},y={"ui:options":{layouts:{"object-properties":{style:`display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;`}},translations:{submit:`Register`}},name:{"ui:options":{text:{autocomplete:`name`},flowbite3Text:{autocomplete:`name`}}},country:{"ui:components":{stringField:`enumField`},"ui:options":{enumNames:[`United States`,`Canada`,`United Kingdom`,`Germany`,`France`]}},skills:{"ui:components":{arrayField:`multiEnumField`},"ui:options":{layouts:{"field-content":{style:`display: flex; flex-wrap: wrap; gap: 0.5rem;`}}}},bio:{"ui:components":{textWidget:`textareaWidget`},"ui:options":{layouts:{"object-property":{style:`grid-row: span 2;`}},textarea:{rows:5},flowbite3Textarea:{rows:5}}},experience:{"ui:components":{stringField:`enumField`,selectWidget:`radioWidget`},"ui:options":{layouts:{"field-content":{style:`display: flex; flex-wrap: wrap; gap: 0.5rem;`}},shadcn4RadioGroup:{style:`grid-auto-flow: column; grid-auto-columns: max-content;`},enumNames:[`0-2 years`,`3-7 years`,`8+ years`]}},startDate:{"ui:components":{textWidget:`datePickerWidget`}},resume:{"ui:components":{unknownField:`unknownNativeFileField`}}},b={name:`Sarah Johnson`,email:`invalid@email`,age:28,country:`CA`,skills:[`HTML`,`CSS`,`JS/TS`,`Svelte`],experience:`intermediate`,startDate:new Date().toLocaleDateString(`en-CA`),bio:`Bio`};function x(e,t){return t instanceof File?`File(${t.name}, ${g(t.size)})`:t}var S=l(`<!> <pre> </pre>`,1);function C(e,l){t(l,!0);let{defaults:h}=m(),g=p({...h,..._,onSubmit:({name:e})=>window.alert(`Hello, ${e}`)});var v=S(),y=n(v);f(y,{get form(){return g}});var b=s(y,2),C=c(b,!0);i(b),u(e=>o(C,e),[()=>JSON.stringify(d(g),x,2)]),a(e,v),r()}var w={files:{"src/routes/+page.svelte":h(`<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  import * as createUser from "../create-user";

  const { defaults } = getDemoContext();

  const form = createForm<createUser.Model>({
    ...defaults,
    ...createUser,
    onSubmit: ({ name }) => window.alert(\`Hello, \${name}\`),
  });
<\/script>

<BasicForm {form} />

<pre>{JSON.stringify(getValueSnapshot(form), createUser.withFile, 2)}</pre>
`),"src/create-user.ts":`import type { Schema, UiSchemaRoot } from "@sjsf/form";
import { formatFileSize } from "@sjsf/form/validators/file-size";
import type { FromSchema } from "json-schema-to-ts";

export const schema = {
  title: "User Registration",
  description: "Simple user registration form",
  type: "object",
  required: ["name", "email", "age"],
  properties: {
    name: {
      type: "string",
      title: "Full Name",
      minLength: 2,
      maxLength: 50,
    },
    email: {
      type: "string",
      title: "Email",
      format: "email",
    },
    age: {
      type: "integer",
      title: "Age",
      minimum: 13,
      maximum: 120,
    },
    country: {
      type: "string",
      title: "Country",
      enum: ["US", "CA", "UK", "DE", "FR"],
    },
    experience: {
      type: "string",
      title: "Work Experience",
      enum: ["beginner", "intermediate", "advanced"],
    },
    skills: {
      type: "array",
      title: "Skills",
      items: {
        type: "string",
        enum: ["HTML", "CSS", "JS/TS", "Svelte"],
      },
      uniqueItems: true,
      minItems: 4,
    },
    bio: {
      type: "string",
      title: "About You",
      maxLength: 200,
    },
    startDate: {
      type: "string",
      title: "Available Start Date",
      format: "date",
    },
    resume: {
      title: "Upload Resume",
    },
  },
} as const satisfies Schema;

export type Model = FromSchema<typeof schema>;

export const uiSchema: UiSchemaRoot = {
  "ui:options": {
    layouts: {
      "object-properties": {
        style:
          "display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;",
      },
    },
    translations: {
      submit: "Register",
    },
  },
  name: {
    "ui:options": {
      text: {
        autocomplete: "name",
      },
      flowbite3Text: {
        autocomplete: "name",
      },
    },
  },
  country: {
    "ui:components": {
      stringField: "enumField",
    },
    "ui:options": {
      enumNames: [
        "United States",
        "Canada",
        "United Kingdom",
        "Germany",
        "France",
      ],
    },
  },
  skills: {
    "ui:components": {
      arrayField: "multiEnumField",
    },
    "ui:options": {
      layouts: {
        "field-content": {
          style: "display: flex; flex-wrap: wrap; gap: 0.5rem;",
        },
      },
    },
  },
  bio: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
    "ui:options": {
      layouts: {
        "object-property": {
          style: "grid-row: span 2;",
        },
      },
      textarea: {
        rows: 5,
      },
      flowbite3Textarea: {
        rows: 5,
      },
    },
  },
  experience: {
    "ui:components": {
      stringField: "enumField",
      selectWidget: "radioWidget",
    },
    "ui:options": {
      layouts: {
        "field-content": {
          style: "display: flex; flex-wrap: wrap; gap: 0.5rem;",
        },
      },
      shadcn4RadioGroup: {
        style: "grid-auto-flow: column; grid-auto-columns: max-content;",
      },
      enumNames: ["0-2 years", "3-7 years", "8+ years"],
    },
  },
  startDate: {
    "ui:components": {
      textWidget: "datePickerWidget",
    },
  },
  resume: {
    "ui:components": {
      unknownField: "unknownNativeFileField",
    },
  },
};

export const initialValue: Model = {
  name: "Sarah Johnson",
  email: "invalid@email",
  age: 28,
  country: "CA",
  skills: ["HTML", "CSS", "JS/TS", "Svelte"],
  experience: "intermediate",
  startDate: new Date().toLocaleDateString("en-CA"),
  bio: "Bio",
};

export function withFile(_: string, value: any) {
  if (value instanceof File) {
    return \`File(\${value.name}, \${formatFileSize(value.size)})\`;
  }
  return value;
}
`},Component:C,meta:{fields:[`enum`,`multi-enum`,`unknown-native-file`],widgets:[`checkboxes`,`file`,`radio`,`textarea`,`date-picker`]}};export{w as default};