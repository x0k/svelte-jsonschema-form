import"./index-client.DygggIMv.js";import{$t as e,Qt as t,an as n,at as r,in as i,jt as a,k as o,kt as s,st as c}from"./client.B0k3dZbu.js";import{d as l,l as u,t as d,u as f}from"./form._czxSeTP.js";import{a as p,i as m}from"./demo.BRvBoDhN.js";var h=c(`<form novalidate="" style="display: flex; flex-direction: column; gap: 1rem;"><!> <!> <!> <button type="submit">Submit</button></form>`);function g(c,m){e(m,!0);let{defaults:g}=p(),_={type:`object`,properties:{login:{title:`Login`,type:`string`,minLength:3},password:{title:`Password`,type:`string`,minLength:6}},required:[`login`,`password`],additionalProperties:!1},v=f({...g,schema:_,onSubmit(e){console.log(e)}});var y=h(),b=s(y);u(b,{get form(){return v}});var x=a(b,2);d(x,{get form(){return v},path:[`login`]}),d(a(x,2),{get form(){return v},path:[`password`],uiSchema:{"ui:options":{text:{type:`password`}}}}),i(2),n(y),o(y,()=>l(v)),r(c,y),t()}var _={files:{"src/routes/+page.svelte":m(`<script lang="ts">
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