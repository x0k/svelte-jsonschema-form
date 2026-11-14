import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Mt as n,Pt as r,Vt as i,_ as a,f as o,lt as s,nn as c,st as l,tn as u,yt as d,zt as f}from"./client.b8lPZIo2.js";import{c as p,kt as m,u as h}from"./form.D7agbGVP.js";var g=s(`<input style="width: 100%;" type="range"/> <!>`,1);function _(t,s){c(s,!0);let{defaults:_}=e(),v=i(50),y=h({..._,schema:{type:`string`},uiSchema:{"ui:options":{text:{get style(){return`flex-grow: 0; width: ${d(v)}%`}}}}});m(y);var b=g(),x=n(b);a(x);var S=r(x,2);p(S,{}),o(x,()=>d(v),e=>f(v,e)),l(t,b),u()}var v={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { Content, createForm, setFormContext } from "@sjsf/form";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  let width = $state(50);

  const form = createForm({
    ...defaults,
    schema: { type: "string" },
    uiSchema: {
      "ui:options": {
        text: {
          get style() {
            return \`flex-grow: 0; width: \${width}%\`;
          },
        },
      },
    },
  });
  setFormContext(form);
<\/script>

<input style="width: 100%;" type="range" bind:value={width} />

<Content />
`)},Component:_,meta:{}};export{v as default};