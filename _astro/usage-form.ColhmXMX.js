import{r as e}from"./rolldown-runtime.C0FnF6B9.js";import"./index-client.BHKBF-tO.js";import{Et as t,Mt as n,Nt as r,Pt as i,et as a,lt as o,nn as s,st as c,tn as l}from"./client.DYWvmWCR.js";import{X as u,i as d,u as f}from"./form.CbgrcR1Z.js";import{a as p,i as m}from"./demo.CcnckxZH.js";import{n as h}from"./file-size.Dmxiq9CI.js";var g=e({initialValue:()=>y,schema:()=>_,uiSchema:()=>v,withFile:()=>b}),_={title:`User Registration`,description:`Simple user registration form`,type:`object`,required:[`name`,`email`,`age`],properties:{name:{type:`string`,title:`Full Name`,minLength:2,maxLength:50},email:{type:`string`,title:`Email`,format:`email`},age:{type:`integer`,title:`Age`,minimum:13,maximum:120},country:{type:`string`,title:`Country`,enum:[`US`,`CA`,`UK`,`DE`,`FR`]},experience:{type:`string`,title:`Work Experience`,enum:[`beginner`,`intermediate`,`advanced`]},skills:{type:`array`,title:`Skills`,items:{type:`string`,enum:[`HTML`,`CSS`,`JS/TS`,`Svelte`]},uniqueItems:!0,minItems:4},bio:{type:`string`,title:`About You`,maxLength:200},startDate:{type:`string`,title:`Available Start Date`,format:`date`},resume:{title:`Upload Resume`}}},v={"ui:options":{layouts:{"object-properties":{style:`display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;`}},translations:{submit:`Register`}},name:{"ui:options":{text:{autocomplete:`name`},flowbite3Text:{autocomplete:`name`}}},country:{"ui:components":{stringField:`enumField`},"ui:options":{enumNames:[`United States`,`Canada`,`United Kingdom`,`Germany`,`France`]}},skills:{"ui:components":{arrayField:`multiEnumField`},"ui:options":{layouts:{"field-content":{style:`display: flex; flex-wrap: wrap; gap: 0.5rem;`}}}},bio:{"ui:components":{textWidget:`textareaWidget`},"ui:options":{layouts:{"object-property":{style:`grid-row: span 2;`}},textarea:{rows:5},flowbite3Textarea:{rows:5}}},experience:{"ui:components":{stringField:`enumField`,selectWidget:`radioWidget`},"ui:options":{layouts:{"field-content":{style:`display: flex; flex-wrap: wrap; gap: 0.5rem;`}},shadcn4RadioGroup:{style:`grid-auto-flow: column; grid-auto-columns: max-content;`},enumNames:[`0-2 years`,`3-7 years`,`8+ years`]}},startDate:{"ui:components":{textWidget:`datePickerWidget`}},resume:{"ui:components":{unknownField:`unknownNativeFileField`}}},y={name:`Sarah Johnson`,email:`invalid@email`,age:28,country:`CA`,skills:[`HTML`,`CSS`,`JS/TS`,`Svelte`],experience:`intermediate`,startDate:new Date().toLocaleDateString(`en-CA`),bio:`Bio`};function b(e,t){return t instanceof File?`File(${t.name}, ${h(t.size)})`:t}var x=o(`<!> <pre> </pre>`,1);function S(e,o){s(o,!0);let{defaults:m}=p(),h=f({...m,...g,onSubmit:({name:e})=>window.alert(`Hello, ${e}`)});var _=x(),v=n(_);d(v,{get form(){return h}});var y=i(v,2),S=r(y,!0);t(e=>a(S,e),[()=>JSON.stringify(u(h),b,2)]),c(e,_),l()}var C={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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
`},Component:S,meta:{fields:[`enum`,`multi-enum`,`unknown-native-file`],widgets:[`checkboxes`,`file`,`radio`,`textarea`,`date-picker`]}};export{C as default};