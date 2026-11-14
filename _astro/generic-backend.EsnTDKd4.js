import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Gt as r,H as i,Mt as a,Nt as o,Pt as s,Vt as c,et as l,lt as u,nn as d,st as f,tn as p,yt as m,zt as h}from"./client.b8lPZIo2.js";import{a as g,c as _,h as v,kt as y,o as b,u as x}from"./form.D7agbGVP.js";import"./radio-include.EtgMRwv4.js";var S=u(`<p> </p>`),C=u(`<p class="text-red-500"> </p>`),w=u(`<!> <!> <!> <!>`,1);function T(t,u){d(u,!0);let{defaults:T}=e(),E=c(void 0),D=v({execute:(e,{reject:t,delay:n,value:r})=>new Promise((e,i)=>{h(E,void 0),setTimeout(()=>{t?i(r):e(r)},n)}),onSuccess(e){h(E,e,!0)},onFailure:console.error,delayedMs:500,timeoutMs:2e3}),O=x({...T,schema:{properties:{delay:{type:`integer`,enum:[250,1500,2500],default:1500},reject:{type:`boolean`},value:{type:`string`}}},uiSchema:{delay:{"ui:components":{integerField:`enumField`,selectWidget:`radioWidget`},"ui:options":{enumNames:[`250ms`,`1.5s`,`2.5s`]}},"ui:options":{translations:{get submit(){return D.isDelayed?`Processed...`:`Submit`}}}},onSubmit:D.run,get disabled(){return D.isProcessed}});y(O),g(t,{children:(e,t)=>{var c=w(),u=a(c);_(u,{});var d=s(u,2);b(d,{});var p=s(d,2),h=e=>{var t=S(),r=o(t);n(()=>l(r,`Data: ${m(E)??``}`)),f(e,t)};i(p,e=>{m(E)!==void 0&&e(h)});var g=s(p,2),v=e=>{var t=C(),r=o(t);n(()=>l(r,`Failed: ${D.state.reason??``}`)),f(e,t)},y=r(()=>D.matches(`failed`));i(g,e=>{m(y)&&e(v)}),f(e,c)},$$slots:{default:!0}}),p()}var E={files:{"src/routes/+page.svelte":t(`<script lang="ts">
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