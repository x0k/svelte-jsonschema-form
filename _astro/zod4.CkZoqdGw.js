import"./index-client.DAEmVQx2.js";import{$t as e,At as t,Qt as n,an as r,at as i,et as a,jt as o,kt as s,st as c,wt as l}from"./client.B0k3dZbu.js";import{Bt as u,Ht as d,Ut as f,X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{a as g,c as _,d as v,i as y,l as b,o as x,r as S,s as C,t as w,u as T}from"./classic.H5Qaier1.js";import{a as E,i as D}from"./demo.yFJ0eT_4.js";import{i as O,n as k,t as A}from"./demo-schema.Db_Bjw93.js";var j=()=>{let e={string:{unit:`characters`,verb:`to have`},file:{unit:`bytes`,verb:`to have`},array:{unit:`items`,verb:`to have`},set:{unit:`items`,verb:`to have`},map:{unit:`entries`,verb:`to have`}};function t(t){return e[t]??null}let n={regex:`input`,email:`email address`,url:`URL`,emoji:`emoji`,uuid:`UUID`,uuidv4:`UUIDv4`,uuidv6:`UUIDv6`,nanoid:`nanoid`,guid:`GUID`,cuid:`cuid`,cuid2:`cuid2`,ulid:`ULID`,xid:`XID`,ksuid:`KSUID`,datetime:`ISO datetime`,date:`ISO date`,time:`ISO time`,duration:`ISO duration`,ipv4:`IPv4 address`,ipv6:`IPv6 address`,mac:`MAC address`,cidrv4:`IPv4 range`,cidrv6:`IPv6 range`,base64:`base64-encoded string`,base64url:`base64url-encoded string`,json_string:`JSON string`,e164:`E.164 number`,jwt:`JWT`,template_literal:`input`},r={nan:`NaN`};return e=>{switch(e.code){case`invalid_type`:{let t=r[e.expected]??e.expected,n=b(e.input);return`Invalid input: expected ${t}, received ${r[n]??n}`}case`invalid_value`:return e.values.length===1?`Invalid input: expected ${T(e.values[0])}`:`Invalid option: expected one of ${_(e.values,`|`)}`;case`too_big`:{let n=e.inclusive?`<=`:`<`,r=t(e.origin);return r?`Too big: expected ${e.origin??`value`} to have ${n}${e.maximum.toString()} ${r.unit??`elements`}`:`Too big: expected ${e.origin??`value`} to be ${n}${e.maximum.toString()}`}case`too_small`:{let n=e.inclusive?`>=`:`>`,r=t(e.origin);return r?`Too small: expected ${e.origin} to have ${n}${e.minimum.toString()} ${r.unit}`:`Too small: expected ${e.origin} to be ${n}${e.minimum.toString()}`}case`invalid_format`:{let t=e;return t.format===`starts_with`?`Invalid string: must start with "${t.prefix}"`:t.format===`ends_with`?`Invalid string: must end with "${t.suffix}"`:t.format===`includes`?`Invalid string: must include "${t.includes}"`:t.format===`regex`?`Invalid string: must match pattern ${t.pattern}`:`Invalid ${n[t.format]??e.format}`}case`not_multiple_of`:return`Invalid number: must be a multiple of ${e.divisor}`;case`unrecognized_keys`:return`Unrecognized key${e.keys.length>1?`s`:``}: ${_(e.keys,`, `)}`;case`invalid_key`:return`Invalid key in ${e.origin}`;case`invalid_union`:return e.options&&Array.isArray(e.options)&&e.options.length>0?`Invalid discriminator value. Expected ${e.options.map(e=>`'${e}'`).join(` | `)}`:`Invalid input`;case`invalid_element`:return`Invalid value in ${e.origin}`;default:return`Invalid input`}}};function M(){return{localeError:j()}}var N=c(`<!> <pre> </pre>`,1);function P(c,_){e(_,!0);let{defaults:b}=E();v(M());let T=x({id:C().regex(RegExp(`^\\d+$`),`Must be a number`).min(8).optional(),active:g(),skills:y(C().min(5)).min(4).optional(),multipleChoicesList:y(S([`foo`,`bar`,`fuzz`])).max(2).optional()}),D=h({...b,...w(T),uiSchema:O,fieldsValidationMode:f|d|u,initialValue:k});var A=N(),j=t(A);m(j,{get form(){return D},novalidate:!0});var P=o(j,2),F=s(P,!0);r(P),l(e=>a(F,e),[()=>JSON.stringify(p(D),null,2)]),i(c,A),n()}var F={files:{"src/routes/+page.svelte":D(`<script lang="ts">
  import {
    BasicForm,
    createForm,
    getValueSnapshot,
    ON_ARRAY_CHANGE,
    ON_CHANGE,
    ON_INPUT,
  } from "@sjsf/form";
  import { adapt } from "@sjsf/zod4-validator/classic";
  import { z } from "zod";
  import { en } from "zod/locales";

  import { getDemoContext } from "@/lib/demo";

  import { initialValue, uiSchema } from "../demo-schema";

  const { defaults } = getDemoContext();

  z.config(en());

  const schema = z.object({
    id: z
      .string()
      .regex(new RegExp("^\\\\d+$"), "Must be a number")
      .min(8)
      .optional(),
    active: z.boolean(),
    skills: z.array(z.string().min(5)).min(4).optional(),
    multipleChoicesList: z
      .array(z.enum(["foo", "bar", "fuzz"]))
      .max(2)
      .optional(),
  });

  const form = createForm({
    ...defaults,
    ...adapt(schema),
    uiSchema,
    fieldsValidationMode: ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE,
    initialValue,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/demo-schema.ts":A},Component:P,meta:{validator:{name:`zod4`,draft2020:!1,precompiled:!1}}};export{F as default};