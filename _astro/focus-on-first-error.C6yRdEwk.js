import"./index-client.CkrqgRIv.js";import{Rt as e,Xt as t,Yt as n,ht as r,i,mt as a}from"./client.BXzhBlXN.js";import{Ct as o,Nt as s,r as c}from"./form.D74qHMvd.js";import{n as l,t as u}from"./demo.6LNVQqAK.js";import{n as d,r as f,t as p}from"./demo-schemas.DlwAgzCm.js";function m(e,t,{checkVisibility:n=!1}={}){let r=e.querySelector(`[id="${t}"]`);return(r instanceof HTMLElement||r instanceof SVGElement)&&r.tabIndex>=0&&`disabled`in r&&r.disabled!==!0&&(!n||window.getComputedStyle(r).visibility!==`hidden`)?r:null}function h(e,t){return e.querySelector(`#${t}`)}function g(e,t){if(e!==null)return()=>e.focus();let n=t();return n===null?null:()=>n.scrollIntoView({behavior:`auto`,block:`center`})}function _(e={}){return({errors:t},n,i)=>{if(t.length===0)return!1;let a=n.target;if(!(a instanceof HTMLElement))return console.warn(`Expected form to be an HTMLElement, got`,a),!1;let{path:c}=t[0],l=g(m(a,o(i,c),e),()=>h(a,o(i,c.concat(s(`errors`)))));return l!==null&&r().then(l)}}function v(r,o){t(o,!0);let{defaults:s}=l();{let t=e(_);c(r,i(()=>s,{get schema(){return d},get uiSchema(){return f},get onSubmitError(){return a(t)}}))}n()}var y={files:{"src/routes/+page.svelte":u(`<script lang="ts">
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