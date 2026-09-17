import"./index-client.BHKBF-tO.js";import{Et as e,Gt as t,H as n,Mt as r,Nt as i,Pt as a,Vt as o,et as s,lt as c,nn as l,st as u,tn as d,yt as f,zt as p}from"./client.DYWvmWCR.js";import{Ot as m,a as h,c as g,h as _,o as v,u as y}from"./form.CbgrcR1Z.js";import{a as b,i as x}from"./demo.CcnckxZH.js";import"./radio-include.BjGaRDIu.js";var S=c(`<p> </p>`),C=c(`<p class="text-red-500"> </p>`),w=c(`<!> <!> <!> <!>`,1);function T(c,x){l(x,!0);let{defaults:T}=b(),E=o(void 0),D=_({execute:(e,{reject:t,delay:n,value:r})=>new Promise((e,i)=>{p(E,void 0),setTimeout(()=>{t?i(r):e(r)},n)}),onSuccess(e){p(E,e,!0)},onFailure:console.error,delayedMs:500,timeoutMs:2e3}),O=y({...T,schema:{properties:{delay:{type:`integer`,enum:[250,1500,2500],default:1500},reject:{type:`boolean`},value:{type:`string`}}},uiSchema:{delay:{"ui:components":{integerField:`enumField`,selectWidget:`radioWidget`},"ui:options":{enumNames:[`250ms`,`1.5s`,`2.5s`]}},"ui:options":{translations:{get submit(){return D.isDelayed?`Processed...`:`Submit`}}}},onSubmit:D.run,get disabled(){return D.isProcessed}});m(O),h(c,{children:(o,c)=>{var l=w(),d=r(l);g(d,{});var p=a(d,2);v(p,{});var m=a(p,2),h=t=>{var n=S(),r=i(n);e(()=>s(r,`Data: ${f(E)??``}`)),u(t,n)};n(m,e=>{f(E)!==void 0&&e(h)});var _=a(m,2),y=t=>{var n=C(),r=i(n);e(()=>s(r,`Failed: ${D.state.reason??``}`)),u(t,n)},b=t(()=>D.matches(`failed`));n(_,e=>{f(b)&&e(y)}),u(o,l)},$$slots:{default:!0}}),d()}var E={files:{"src/routes/+page.svelte":x(`<script lang="ts">
  import {
    Content,
    createForm,
    Form,
    setFormContext,
    SubmitButton,
  } from "@sjsf/form";
  import { createTask } from "@sjsf/form/lib/task.svelte";
  import "@sjsf/basic-theme/extra-widgets/radio-include";

  import { getDemoContext } from "@/lib/demo";

  const { defaults } = getDemoContext();

  let data = $state<string>();

  interface Config {
    reject: boolean;
    delay: number;
    value: string;
  }

  const resolve = createTask<[Config], string>({
    execute: (_signal, { reject: isError, delay, value }) =>
      new Promise<string>((resolve, reject) => {
        data = undefined;
        setTimeout(() => {
          if (isError) {
            reject(value);
          } else {
            resolve(value);
          }
        }, delay);
      }),
    onSuccess(response) {
      data = response;
    },
    onFailure: console.error,
    delayedMs: 500,
    timeoutMs: 2000,
  });

  const form = createForm<Config>({
    ...defaults,
    schema: {
      properties: {
        delay: {
          type: "integer",
          enum: [250, 1500, 2500],
          default: 1500,
        },
        reject: {
          type: "boolean",
        },
        value: {
          type: "string",
        },
      },
    },
    uiSchema: {
      delay: {
        "ui:components": {
          integerField: "enumField",
          selectWidget: "radioWidget",
        },
        "ui:options": {
          enumNames: ["250ms", "1.5s", "2.5s"],
        },
      },
      "ui:options": {
        translations: {
          get submit() {
            return resolve.isDelayed ? "Processed..." : "Submit";
          },
        },
      },
    },
    onSubmit: resolve.run,
    get disabled() {
      return resolve.isProcessed;
    },
  });
  setFormContext(form);
<\/script>

<Form>
  <Content />
  <SubmitButton />
  {#if data !== undefined}
    <p>Data: {data}</p>
  {/if}
  {#if resolve.matches("failed")}
    <p class="text-red-500">Failed: {resolve.state.reason}</p>
  {/if}
</Form>
`)},Component:T,meta:{widgets:[`radio`]}};export{E as default};