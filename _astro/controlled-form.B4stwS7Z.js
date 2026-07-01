import"./index-client.DAEmVQx2.js";import{$t as e,At as t,It as n,Qt as r,Rt as i,_t as a,an as o,at as s,et as c,jt as l,kt as u,st as d,wt as f}from"./client.B0k3dZbu.js";import{i as p,u as m}from"./form.B8CJIVHV.js";import{a as h,i as g}from"./demo.BFc_HmCR.js";var _=d(`<!> <pre> </pre>`,1);function v(d,g){e(g,!0);let{defaults:v}=h(),y={type:`string`},b=i(`initial`),x=m({...v,schema:y,value:[()=>a(b),e=>n(b,e,!0)],onSubmit:console.log});var S=_(),C=t(S);p(C,{get form(){return x}});var w=l(C,2),T=u(w,!0);o(w),f(e=>c(T,e),[()=>JSON.stringify(a(b),null,2)]),s(d,S),r()}var y={files:{"src/routes/+page.svelte":g(`<script lang="ts">
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