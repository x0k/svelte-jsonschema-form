import{i as e}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import"./client.b8lPZIo2.js";import{a as t,t as n}from"./basic.QIZMopII.js";import{r}from"./form.D7agbGVP.js";import{a as i,i as a,r as o}from"./theme.svelte.S6B_QqBb.js";var s=()=>({isValid:()=>!0,validateFormValue:(e,t)=>({value:t})});function c(e){r(e,{get theme(){return t},get translation(){return o},get resolver(){return n},schema:{type:`object`,title:`Form title`,properties:{text:{type:`string`,title:`Text input`}},required:[`text`]},get merger(){return a},get idBuilder(){return i},get validator(){return s},onSubmit:e=>window.alert(e.text)})}var l={files:{"src/routes/+page.svelte":e(`<script lang="ts">
  import { theme } from "@sjsf/basic-theme";
  import { SimpleForm } from "@sjsf/form";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { resolver } from "@sjsf/form/resolvers/basic";
  import { translation } from "@sjsf/form/translations/en";
  import { createFormValidator } from "@sjsf/form/validators/noop";
<\/script>

<SimpleForm
  {theme}
  {translation}
  {resolver}
  schema={{
    type: "object",
    title: "Form title",
    properties: {
      text: {
        type: "string",
        title: "Text input",
      },
    },
    required: ["text"],
  }}
  merger={createFormMerger}
  idBuilder={createFormIdBuilder}
  validator={createFormValidator<{ text: string }>}
  onSubmit={(v) => window.alert(v.text)}
/>
`)},Component:c,meta:{}};export{l as default};