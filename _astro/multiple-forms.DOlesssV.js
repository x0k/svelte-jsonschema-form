import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Pt as n,i as r,jt as i,ln as a,lt as o,nn as s,st as c,tn as l}from"./client.b8lPZIo2.js";import{r as u}from"./form.D7agbGVP.js";var d=o(`<div style="display: flex; gap: 1rem; justify-content: space-around;"><!> <!></div>`);function f(t,o){s(o,!0);let{defaults:f}=e(),p={type:`string`};var m=d(),h=i(m);u(h,r(()=>f,{get schema(){return p},initialValue:`foo`,idPrefix:`form1`,onSubmit:e=>window.alert(e)}));var g=n(h,2);u(g,r(()=>f,{get schema(){return p},initialValue:`bar`,idPrefix:`form2`,onSubmit:e=>window.alert(e)})),a(m),c(t,m),l()}var p={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { type Schema, SimpleForm } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  const schema: Schema = {
    type: "string",
  };
<\/script>

<div style="display: flex; gap: 1rem; justify-content: space-around;">
  <SimpleForm
    {...defaults}
    {schema}
    initialValue="foo"
    idPrefix="form1"
    onSubmit={(v) => window.alert(v)}
  />
  <SimpleForm
    {...defaults}
    {schema}
    initialValue="bar"
    idPrefix="form2"
    onSubmit={(v) => window.alert(v)}
  />
</div>
`)},Component:f,meta:{}};export{p as default};