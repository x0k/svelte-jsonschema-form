import"./index-client.DAEmVQx2.js";import{$t as e,At as t,H as n,Ht as r,It as i,Qt as a,Rt as o,_t as s,an as c,at as l,et as u,jt as d,kt as f,st as p,wt as m}from"./client.B0k3dZbu.js";import{Ot as h,a as g,c as _,h as v,o as y,u as b}from"./form.B8CJIVHV.js";import"./radio-include.D77GNIz6.js";import{a as x,i as S}from"./demo.BFc_HmCR.js";var C=p(`<p> </p>`),w=p(`<p class="text-red-500"> </p>`),T=p(`<!> <!> <!> <!>`,1);function E(p,S){e(S,!0);let{defaults:E}=x(),D=o(void 0),O=v({execute:(e,{reject:t,delay:n,value:r})=>new Promise((e,a)=>{i(D,void 0),setTimeout(()=>{t?a(r):e(r)},n)}),onSuccess(e){i(D,e,!0)},onFailure:console.error,delayedMs:500,timeoutMs:2e3});h(b({...E,schema:{properties:{delay:{type:`integer`,enum:[250,1500,2500],default:1500},reject:{type:`boolean`},value:{type:`string`}}},uiSchema:{delay:{"ui:components":{integerField:`enumField`,selectWidget:`radioWidget`},"ui:options":{enumNames:[`250ms`,`1.5s`,`2.5s`]}},"ui:options":{translations:{get submit(){return O.isDelayed?`Processed...`:`Submit`}}}},onSubmit:O.run,get disabled(){return O.isProcessed}})),g(p,{children:(e,i)=>{var a=T(),o=t(a);_(o,{});var p=d(o,2);y(p,{});var h=d(p,2),g=e=>{var t=C(),n=f(t);c(t),m(()=>u(n,`Data: ${s(D)??``}`)),l(e,t)};n(h,e=>{s(D)!==void 0&&e(g)});var v=d(h,2),b=e=>{var t=w(),n=f(t);c(t),m(()=>u(n,`Failed: ${O.state.reason??``}`)),l(e,t)},x=r(()=>O.matches(`failed`));n(v,e=>{s(x)&&e(b)}),l(e,a)},$$slots:{default:!0}}),a()}var D={files:{"src/routes/+page.svelte":S(`<script lang="ts">
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