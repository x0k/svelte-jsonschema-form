import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Gt as n,bt as r,i,nn as a,tn as o,yt as s}from"./client.b8lPZIo2.js";import{Pt as c,r as l,wt as u}from"./form.D7agbGVP.js";import{n as d,r as f,t as p}from"./demo-schemas.DlwAgzCm.js";function m(e,t,{checkVisibility:n=!1}={}){let r=e.querySelector(`[id="${t}"]`);return(r instanceof HTMLElement||r instanceof SVGElement)&&r.tabIndex>=0&&`disabled`in r&&r.disabled!==!0&&(!n||window.getComputedStyle(r).visibility!==`hidden`)?r:null}function h(e,t){return e.querySelector(`#${t}`)}function g(e,t){if(e!==null)return()=>e.focus();let n=t();return n===null?null:()=>n.scrollIntoView({behavior:`auto`,block:`center`})}function _(e={}){return({errors:t},n,i)=>{if(t.length===0)return!1;let a=n.target;if(!(a instanceof HTMLElement))return console.warn(`Expected form to be an HTMLElement, got`,a),!1;let{path:o}=t[0],s=g(m(a,u(i,o),e),()=>h(a,u(i,o.concat(c(`errors`)))));return s!==null&&r().then(s)}}function v(t,r){a(r,!0);let{defaults:c}=e();{let e=n(_);l(t,i(()=>c,{get schema(){return d},get uiSchema(){return f},get onSubmitError(){return s(e)}}))}o()}var y={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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