import"./index-client.CkrqgRIv.js";import{Dt as e,Tt as t,Xt as n,Yt as r,it as i,k as a,nn as o,nt as s,tn as c}from"./client.BXzhBlXN.js";import{d as l,l as u,t as d,u as f}from"./form.D74qHMvd.js";import{n as p,t as m}from"./demo.6LNVQqAK.js";var h=i(`<form novalidate="" style="display: flex; flex-direction: column; gap: 1rem;"><!> <!> <!> <button type="submit">Submit</button></form>`);function g(i,m){n(m,!0);let{defaults:g}=p(),_={type:`object`,properties:{login:{title:`Login`,type:`string`,minLength:3},password:{title:`Password`,type:`string`,minLength:6}},required:[`login`,`password`],additionalProperties:!1},v=f({...g,schema:_,onSubmit(e){console.log(e)}});var y=h(),b=t(y);u(b,{get form(){return v}});var x=e(b,2);d(x,{get form(){return v},path:[`login`]});var S=e(x,2);d(S,{get form(){return v},path:[`password`],uiSchema:{"ui:options":{text:{type:`password`}}}}),c(2),o(y),a(y,()=>l(v)),s(i,y),r()}var _={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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