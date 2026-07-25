import"./index-client.Pqo5EW-P.js";import"./client.Cb7crF4c.js";import{r as e}from"./form.B5NxhwOh.js";import{n as t,t as n}from"./basic.DZi9Bz5k.js";import{n as r,r as i,t as a}from"./en.BgIr63Hb.js";import{t as o}from"./demo.Cnu-2gYI.js";var s=()=>({isValid:()=>!0,validateFormValue:(e,t)=>({value:t})});function c(o){e(o,{get theme(){return t},get translation(){return a},get resolver(){return n},schema:{type:`object`,title:`Form title`,properties:{text:{type:`string`,title:`Text input`}},required:[`text`]},get merger(){return r},get idBuilder(){return i},get validator(){return s},onSubmit:e=>window.alert(e.text)})}var l={files:{"src/routes/+page.svelte":o(`<script lang="ts">
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