import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Pt as n,cn as r,jt as i,k as a,ln as o,lt as s,nn as c,st as l,tn as u}from"./client.b8lPZIo2.js";import{d,l as f,t as p,u as m}from"./form.D7agbGVP.js";var h=s(`<form novalidate="" style="display: flex; flex-direction: column; gap: 1rem;"><!> <!> <!> <button type="submit">Submit</button></form>`);function g(t,s){c(s,!0);let{defaults:g}=e(),_={type:`object`,properties:{login:{title:`Login`,type:`string`,minLength:3},password:{title:`Password`,type:`string`,minLength:6}},required:[`login`,`password`],additionalProperties:!1},v=m({...g,schema:_,onSubmit(e){console.log(e)}});var y=h(),b=i(y);f(b,{get form(){return v}});var x=n(b,2);p(x,{get form(){return v},path:[`login`]});var S=n(x,2);p(S,{get form(){return v},path:[`password`],uiSchema:{"ui:options":{text:{type:`password`}}}}),r(2),o(y),a(y,()=>d(v)),l(t,y),u()}var _={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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