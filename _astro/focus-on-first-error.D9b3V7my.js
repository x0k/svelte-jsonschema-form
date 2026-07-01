import"./index-client.DygggIMv.js";import{$t as e,Ht as t,Qt as n,_t as r,i,vt as a}from"./client.B0k3dZbu.js";import{Ct as o,Nt as s,r as c}from"./form._czxSeTP.js";import{a as l,i as u}from"./demo.BRvBoDhN.js";import{n as d,r as f,t as p}from"./demo-schemas.DlwAgzCm.js";function m(e,t,{checkVisibility:n=!1}={}){let r=e.querySelector(`[id="${t}"]`);return(r instanceof HTMLElement||r instanceof SVGElement)&&r.tabIndex>=0&&`disabled`in r&&r.disabled!==!0&&(!n||window.getComputedStyle(r).visibility!==`hidden`)?r:null}function h(e,t){return e.querySelector(`#${t}`)}function g(e,t){if(e!==null)return()=>e.focus();let n=t();return n===null?null:()=>n.scrollIntoView({behavior:`auto`,block:`center`})}function _(e={}){return({errors:t},n,r)=>{if(t.length===0)return!1;let i=n.target;if(!(i instanceof HTMLElement))return console.warn(`Expected form to be an HTMLElement, got`,i),!1;let{path:c}=t[0],l=g(m(i,o(r,c),e),()=>h(i,o(r,c.concat(s(`errors`)))));return l===null?!1:a().then(l)}}function v(a,o){e(o,!0);let{defaults:s}=l();{let e=t(_);c(a,i(()=>s,{get schema(){return d},get uiSchema(){return f},get onSubmitError(){return r(e)}}))}n()}var y={files:{"src/routes/+page.svelte":u(`<script lang="ts">
  import { SimpleForm } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";

  import { getDemoContext } from "@/lib/demo";

  import { objectSchema, objectUiSchema } from "../demo-schemas";

  const { defaults } = getDemoContext();
<\/script>

<SimpleForm
  {...defaults}
  schema={objectSchema}
  uiSchema={objectUiSchema}
  onSubmitError={createFocusOnFirstError()}
/>
`),"src/demo-schemas.ts":p},Component:v,meta:{}};export{y as default};