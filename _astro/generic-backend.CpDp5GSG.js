import"./index-client.Pqo5EW-P.js";import{Dt as e,Et as t,H as n,Mt as r,Pt as i,Rt as a,Tt as o,Xt as s,Yt as c,et as l,it as u,mt as d,nn as f,nt as p,xt as m}from"./client.Cb7crF4c.js";import{Ot as h,a as g,c as _,h as v,o as y,u as b}from"./form.B5NxhwOh.js";import"./radio-include.trg0Ut-W.js";import{n as x,t as S}from"./demo.Cnu-2gYI.js";var C=u(`<p> </p>`),w=u(`<p class="text-red-500"> </p>`),T=u(`<!> <!> <!> <!>`,1);function E(u,S){s(S,!0);let{defaults:E}=x(),D=i(void 0),O=v({execute:(e,{reject:t,delay:n,value:i})=>new Promise((e,a)=>{r(D,void 0),setTimeout(()=>{t?a(i):e(i)},n)}),onSuccess(e){r(D,e,!0)},onFailure:console.error,delayedMs:500,timeoutMs:2e3});h(b({...E,schema:{properties:{delay:{type:`integer`,enum:[250,1500,2500],default:1500},reject:{type:`boolean`},value:{type:`string`}}},uiSchema:{delay:{"ui:components":{integerField:`enumField`,selectWidget:`radioWidget`},"ui:options":{enumNames:[`250ms`,`1.5s`,`2.5s`]}},"ui:options":{translations:{get submit(){return O.isDelayed?`Processed...`:`Submit`}}}},onSubmit:O.run,get disabled(){return O.isProcessed}})),g(u,{children:(r,i)=>{var s=T(),c=t(s);_(c,{});var u=e(c,2);y(u,{});var h=e(u,2),g=e=>{var t=C(),n=o(t);f(t),m(()=>l(n,`Data: ${d(D)??``}`)),p(e,t)};n(h,e=>{d(D)!==void 0&&e(g)});var v=e(h,2),b=e=>{var t=w(),n=o(t);f(t),m(()=>l(n,`Failed: ${O.state.reason??``}`)),p(e,t)},x=a(()=>O.matches(`failed`));n(v,e=>{d(x)&&e(b)}),p(r,s)},$$slots:{default:!0}}),c()}var D={files:{"src/routes/+page.svelte":S(`<script lang="ts">
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
`)},Component:E,meta:{widgets:[`radio`]}};export{D as default};