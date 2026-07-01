import"./index-client.DAEmVQx2.js";import{$t as e,Qt as t,an as n,at as r,i,jt as a,kt as o,st as s}from"./client.B0k3dZbu.js";import{r as c}from"./form.B8CJIVHV.js";import{a as l,i as u}from"./demo.yFJ0eT_4.js";var d=s(`<div style="display: flex; gap: 1rem; justify-content: space-around;"><!> <!></div>`);function f(s,u){e(u,!0);let{defaults:f}=l(),p={type:`string`};var m=d(),h=o(m);c(h,i(()=>f,{get schema(){return p},initialValue:`foo`,idPrefix:`form1`,onSubmit:e=>window.alert(e)})),c(a(h,2),i(()=>f,{get schema(){return p},initialValue:`bar`,idPrefix:`form2`,onSubmit:e=>window.alert(e)})),n(m),r(s,m),t()}var p={files:{"src/routes/+page.svelte":u(`<script lang="ts">
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