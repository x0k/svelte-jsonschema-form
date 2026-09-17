import"./index-client.BHKBF-tO.js";import{Pt as e,i as t,jt as n,ln as r,lt as i,nn as a,st as o,tn as s}from"./client.DYWvmWCR.js";import{r as c}from"./form.CbgrcR1Z.js";import{a as l,i as u}from"./demo.CcnckxZH.js";var d=i(`<div style="display: flex; gap: 1rem; justify-content: space-around;"><!> <!></div>`);function f(i,u){a(u,!0);let{defaults:f}=l(),p={type:`string`};var m=d(),h=n(m);c(h,t(()=>f,{get schema(){return p},initialValue:`foo`,idPrefix:`form1`,onSubmit:e=>window.alert(e)}));var g=e(h,2);c(g,t(()=>f,{get schema(){return p},initialValue:`bar`,idPrefix:`form2`,onSubmit:e=>window.alert(e)})),r(m),o(i,m),s()}var p={files:{"src/routes/+page.svelte":u(`<script lang="ts">
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