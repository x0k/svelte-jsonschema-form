import"./index-client.BHKBF-tO.js";import{Pt as e,cn as t,jt as n,k as r,ln as i,lt as a,nn as o,st as s,tn as c}from"./client.DYWvmWCR.js";import{d as l,l as u,t as d,u as f}from"./form.CbgrcR1Z.js";import{a as p,i as m}from"./demo.CcnckxZH.js";var h=a(`<form novalidate="" style="display: flex; flex-direction: column; gap: 1rem;"><!> <!> <!> <button type="submit">Submit</button></form>`);function g(a,m){o(m,!0);let{defaults:g}=p(),_={type:`object`,properties:{login:{title:`Login`,type:`string`,minLength:3},password:{title:`Password`,type:`string`,minLength:6}},required:[`login`,`password`],additionalProperties:!1},v=f({...g,schema:_,onSubmit(e){console.log(e)}});var y=h(),b=n(y);u(b,{get form(){return v}});var x=e(b,2);d(x,{get form(){return v},path:[`login`]});var S=e(x,2);d(S,{get form(){return v},path:[`password`],uiSchema:{"ui:options":{text:{type:`password`}}}}),t(2),i(y),r(y,()=>l(v)),s(a,y),c()}var _={files:{"src/routes/+page.svelte":m(`<script lang="ts">
  import {
    type Schema,
    createForm,
    Field,
    handlers,
    HiddenIdPrefixInput,
  } from "@sjsf/form";
  import type { FromSchema } from "json-schema-to-ts";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema = {
    type: "object",
    properties: {
      login: {
        title: "Login",
        type: "string",
        minLength: 3,
      },
      password: {
        title: "Password",
        type: "string",
        minLength: 6,
      },
    },
    required: ["login", "password"],
    additionalProperties: false,
  } as const satisfies Schema;

  const form = createForm<FromSchema<typeof schema>>({
    ...defaults,
    schema,
    onSubmit(value) {
      console.log(value);
    },
  });
<\/script>

<form
  novalidate
  {@attach handlers(form)}
  style="display: flex; flex-direction: column; gap: 1rem;"
>
  <!-- Use this component if you plan to use SvelteKit integration. -->
  <HiddenIdPrefixInput {form} />
  <Field {form} path={["login"]} />
  <Field
    {form}
    path={["password"]}
    uiSchema={{ "ui:options": { text: { type: "password" } } }}
  />
  <button type="submit">Submit</button>
</form>
`)},Component:g,meta:{}};export{_ as default};