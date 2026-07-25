import"./index-client.Pqo5EW-P.js";import{Dt as e,Tt as t,Xt as n,Yt as r,i,it as a,nn as o,nt as s}from"./client.Cb7crF4c.js";import{r as c}from"./form.B5NxhwOh.js";import{n as l,t as u}from"./demo.Cnu-2gYI.js";var d=a(`<div style="display: flex; gap: 1rem; justify-content: space-around;"><!> <!></div>`);function f(a,u){n(u,!0);let{defaults:f}=l(),p={type:`string`};var m=d(),h=t(m);c(h,i(()=>f,{get schema(){return p},initialValue:`foo`,idPrefix:`form1`,onSubmit:e=>window.alert(e)})),c(e(h,2),i(()=>f,{get schema(){return p},initialValue:`bar`,idPrefix:`form2`,onSubmit:e=>window.alert(e)})),o(m),s(a,m),r()}var p={files:{"src/routes/+page.svelte":u(`<script lang="ts">
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