import"./index-client.BHKBF-tO.js";import{Mt as e,Pt as t,Vt as n,_ as r,f as i,lt as a,nn as o,st as s,tn as c,yt as l,zt as u}from"./client.DYWvmWCR.js";import{Ot as d,c as f,u as p}from"./form.CbgrcR1Z.js";import{a as m,i as h}from"./demo.CcnckxZH.js";var g=a(`<input style="width: 100%;" type="range"/> <!>`,1);function _(a,h){o(h,!0);let{defaults:_}=m(),v=n(50),y=p({..._,schema:{type:`string`},uiSchema:{"ui:options":{text:{get style(){return`flex-grow: 0; width: ${l(v)}%`}}}}});d(y);var b=g(),x=e(b);r(x);var S=t(x,2);f(S,{}),i(x,()=>l(v),e=>u(v,e)),s(a,b),c()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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