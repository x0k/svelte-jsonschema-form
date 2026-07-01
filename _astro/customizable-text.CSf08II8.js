import"./index-client.DAEmVQx2.js";import{$t as e,At as t,It as n,Qt as r,Rt as i,_ as a,_t as o,at as s,f as c,jt as l,st as u}from"./client.B0k3dZbu.js";import{Ot as d,c as f,u as p}from"./form.B8CJIVHV.js";import{a as m,i as h}from"./demo.BFc_HmCR.js";var g=u(`<input style="width: 100%;" type="range"/> <!>`,1);function _(u,h){e(h,!0);let{defaults:_}=m(),v=i(50);d(p({..._,schema:{type:`string`},uiSchema:{"ui:options":{text:{get style(){return`flex-grow: 0; width: ${o(v)}%`}}}}}));var y=g(),b=t(y);a(b),f(l(b,2),{}),c(b,()=>o(v),e=>n(v,e)),s(u,y),r()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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