import"./index-client.CkrqgRIv.js";import{Dt as e,Et as t,Mt as n,Pt as r,Xt as i,Yt as a,_ as o,f as s,it as c,mt as l,nt as u}from"./client.BXzhBlXN.js";import{Ot as d,c as f,u as p}from"./form.D74qHMvd.js";import{n as m,t as h}from"./demo.6LNVQqAK.js";var g=c(`<input style="width: 100%;" type="range"/> <!>`,1);function _(c,h){i(h,!0);let{defaults:_}=m(),v=r(50),y=p({..._,schema:{type:`string`},uiSchema:{"ui:options":{text:{get style(){return`flex-grow: 0; width: ${l(v)}%`}}}}});d(y);var b=g(),x=t(b);o(x);var S=e(x,2);f(S,{}),s(x,()=>l(v),e=>n(v,e)),u(c,b),a()}var v={files:{"src/routes/+page.svelte":h(`<script lang="ts">
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