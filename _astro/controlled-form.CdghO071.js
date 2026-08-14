import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Mt as n,Pt as r,Tt as i,Xt as a,Yt as o,et as s,it as c,mt as l,nn as u,nt as d,xt as f}from"./client.BXzhBlXN.js";import{i as p,u as m}from"./form.D74qHMvd.js";import{n as h,t as g}from"./demo.6LNVQqAK.js";var _=c(`<!> <pre> </pre>`,1);function v(c,g){a(g,!0);let{defaults:v}=h(),y={type:`string`},b=r(`initial`),x=m({...v,schema:y,value:[()=>l(b),e=>n(b,e,!0)],onSubmit:console.log});var S=_(),C=t(S);p(C,{get form(){return x}});var w=e(C,2),T=i(w,!0);u(w),f(e=>s(T,e),[()=>JSON.stringify(l(b),null,2)]),d(c,S),o()}var y={files:{"src/routes/+page.svelte":g(`<script lang="ts">
  import { BasicForm, createForm, type Schema } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
  };

  let value = $state("initial");

  const form = createForm<string>({
    ...defaults,
    schema,
    value: [() => value, (v) => (value = v)],
    onSubmit: console.log,
  });
<\/script>

<BasicForm {form} />

<pre>{JSON.stringify(value, null, 2)}</pre>
`)},Component:v,meta:{}};export{y as default};