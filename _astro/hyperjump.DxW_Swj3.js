import{a as e,i as t}from"./demo.Cgm30ouU.js";import"./index-client.Cj_4OtE4.js";import{Et as n,Mt as r,Nt as i,Pt as ee,et as te,lt as a,nn as o,st as s,tn as c}from"./client.b8lPZIo2.js";import{X as ne,i as re,u as ie}from"./form.D7agbGVP.js";import{i as ae,u as oe}from"./playground.BNUvg7dD.js";import{c as l,l as u,n as d,o as f,s as p,t as se,u as m}from"./draft-07.BesSwNyi.js";import{t as h}from"./input-schema.D8cf2JKT.js";var ce=(e,t)=>{switch(e){case`01`:case`Jan`:case`03`:case`Mar`:case`05`:case`May`:case`07`:case`Jul`:case`08`:case`Aug`:case`10`:case`Oct`:case`12`:case`Dec`:return 31;case`04`:case`Apr`:case`06`:case`Jun`:case`09`:case`Sep`:case`11`:case`Nov`:return 30;case`02`:case`Feb`:return le(t)?29:28;default:return 0}},le=e=>e%4==0&&(e%100!=0||e%400==0),ue=e=>{let t=String(e.getUTCMonth()+1).padStart(2,`0`),n=String(e.getUTCDate()).padStart(2,`0`),r=`${e.getUTCFullYear()}-${t}-${n}`;return de.has(r)&&e.getUTCHours()===23&&e.getUTCMinutes()===59},de=new Set(`1960-12-31.1961-07-31.1961-12-31.1963-10-31.1963-12-31.1964-03-31.1964-08-31.1964-12-31.1965-02-28.1965-06-30.1965-08-31.1965-12-31.1968-01-31.1971-12-31.1972-06-30.1972-12-31.1973-12-31.1974-12-31.1975-12-31.1976-12-31.1977-12-31.1978-12-31.1979-12-31.1981-06-30.1982-06-30.1983-06-30.1985-06-30.1987-12-31.1989-12-31.1990-12-31.1992-06-30.1993-06-30.1994-06-30.1995-12-31.1997-06-30.1998-12-31.2005-12-31.2008-12-31.2012-06-30.2015-06-30.2016-12-31`.split(`.`)),g=RegExp(`^(?<year>\\d{4})-(?<month>(?:0[1-9]|1[0-2]))-(?<day>(?:0[1-9]|[12][0-9]|3[01]))$`),_=e=>{let t=g.exec(e)?.groups;if(!t)return!1;let n=Number.parseInt(t.day,10),r=Number.parseInt(t.year,10);return n<=ce(t.month,r)},v=`(?:[01]\\d|2[0-3])`,y=`[0-5]\\d`,b=`[0-5]\\d`,fe=`(?<seconds>[0-5]\\d|60)`,x=`\\.\\d+`,S=`(?:[zZ]|${`[+-]${v}:${y}`})`,pe=`${`${v}:${y}:${b}(?:${x})?`}${S}`,me=RegExp.prototype.test.bind(RegExp(`^${pe}$`)),he=RegExp(`^${v}:${y}:${fe}(?:${x})?${S}$`),ge=e=>he.exec(e)?.groups,_e=e=>{let t=e.substring(0,10),n=e[10],r=e.substring(11),i=ge(r)?.seconds;return _(t)&&/^t$/i.test(n)&&!!i&&(i!==`60`||ue(new Date(`${t}T${r.replace(`60`,`59`)}`)))},C=`\\d+S`,w=`\\d+M(?:${C})?`,T=`T(?:${`\\d+H(?:${w})?`}|${w}|${C})`,E=`\\d+D`,D=`\\d+W`,O=`\\d+M(?:${E})?`,k=`P(?:${`(?:${E}|${O}|${`\\d+Y(?:${O})?`})(?:${T})?`}|${T}|${D})`,A=RegExp.prototype.test.bind(RegExp(`^${k}$`)),j=`[a-zA-Z]`,M=`[\\da-fA-F]`,N="[\\w!#$%&'*+\\-/=?^`{|}~]+",P=`(?:${`${N}(?:\\.${N})*`}|"(?:[\\x20-\\x21\\x23-\\x5B\\x5D-\\x7E]|\\\\[\\x20-\\x7E])*")`,F=`(?:${j}|\\d)`,I=`(?:${F}|-)*${F}`,L=`${F}(?:${I})?`,ve=`${L}(?:\\.${L})*`,R=`(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])`,z=`${R}\\.${R}\\.${R}\\.${R}`,B=`${M}{1,4}`,V=`(?:${B}:${B}|${z})`,ye=`${P}@(?:${ve}|${`\\[(?:${z}|${`[Ii][Pp][Vv]6:${`(?:(?:${B}:){6}${V}|::(?:${B}:){5}${V}|(?:${B})?::(?:${B}:){4}${V}|(?:(?:${B}:){0,1}${B})?::(?:${B}:){3}${V}|(?:(?:${B}:){0,2}${B})?::(?:${B}:){2}${V}|(?:(?:${B}:){0,3}${B})?::(?:${B}:){1}${V}|(?:(?:${B}:){0,4}${B})?::${V}|(?:(?:${B}:){0,5}${B})?::${B}|(?:(?:${B}:){0,6}${B})?::)`}`}|${`(?<addressLiteralTag>${I}):[\\x21-\\x5A\\x5E-\\x7E]+`})]`})`,be=RegExp(`^${ye}$`),xe=e=>{let t=be.exec(e);if(t===null)return!1;if(t.groups?.addressLiteralTag)throw Error(`Encountered unknown Address Literal Tag: ${t.groups?.addressLiteralTag}`);return!0},H=`(?!-)[A-Za-z0-9-]{1,63}(?<!-)`,Se=`${H}(?:\\.${H})*`,Ce=RegExp(`^${Se}$`),U=e=>e.length<256&&Ce.test(e),W=`(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])`,we=`${W}\\.${W}\\.${W}\\.${W}`,Te=RegExp.prototype.test.bind(RegExp(`^${we}$`)),Ee=`[a-fA-F0-9]`,G=`(?:\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])`,De=`${G}\\.${G}\\.${G}\\.${G}`,K=`${Ee}{1,4}`,q=`(?:${K}:${K}|${De})`,Oe=`(?:(?:${K}:){6}${q}|::(?:${K}:){5}${q}|(?:${K})?::(?:${K}:){4}${q}|(?:(?:${K}:){0,1}${K})?::(?:${K}:){3}${q}|(?:(?:${K}:){0,2}${K})?::(?:${K}:){2}${q}|(?:(?:${K}:){0,3}${K})?::(?:${K}:){1}${q}|(?:(?:${K}:){0,4}${K})?::${q}|(?:(?:${K}:){0,5}${K})?::${K}|(?:(?:${K}:){0,6}${K})?::)`,ke=RegExp.prototype.test.bind(RegExp(`^${Oe}$`)),Ae=u,je=m,Me=p,Ne=l,J=`(?:[0-9a-fA-F]{2})`,Pe=`${`${J}{4}`}\\-${`${J}{2}`}\\-${`${J}{2}`}\\-${J}${J}\\-${`${J}{6}`}`,Fe=RegExp.prototype.test.bind(RegExp(`^${Pe}$`)),Ie=`[a-zA-Z]`,Y=`[\\da-fA-F]`,X=`%${Y}${Y}`,Le=`[\\u{A0}-\\u{D7FF}\\u{F900}-\\u{FDCF}\\u{FDF0}-\\u{FFEF}\\u{10000}-\\u{1FFFD}\\u{20000}-\\u{2FFFD}\\u{30000}-\\u{3FFFD}\\u{40000}-\\u{4FFFD}\\u{50000}-\\u{5FFFD}\\u{60000}-\\u{6FFFD}\\u{70000}-\\u{7FFFD}\\u{80000}-\\u{8FFFD}\\u{90000}-\\u{9FFFD}\\u{A0000}-\\u{AFFFD}\\u{B0000}-\\u{BFFFD}\\u{C0000}-\\u{CFFFD}\\u{D0000}-\\u{DFFFD}\\u{E1000}-\\u{EFFFD}]`,Re=`[\\u{E000}-\\u{F8FF}\\u{F0000}-\\u{FFFFD}\\u{100000}-\\u{10FFFD}]`,ze=`(?:[+#]|[./;?&]|[=,!@|])`,Z=`(?:${Ie}|\\d|_|${X})`,Q=`${`${Z}(?:\\.?${Z})*`}(?::[1-9]\\d{0,3}|\\*)?`,Be=`\\{${ze}?${`${Q}(?:,${Q})*`}\\}`,Ve=`(?:${`(?:[\\x21\\x23-\\x24\\x26-\\x3B\\x3D\\x3F-\\x5B\\x5D\\x5F\\x61-\\x7A\\x7E]|${Le}|${Re}|${X})`}|${Be})*`,He=RegExp.prototype.test.bind(RegExp(`^${Ve}$`,`u`)),Ue=RegExp.prototype.test.bind(RegExp(`^(?:/(?:[\\u{00}-\\u{2E}\\u{30}-\\u{7D}\\u{7F}-\\u{10FFFF}]|~[01])*)*$`,`u`)),We=`(?:/(?:[\\u{00}-\\u{2E}\\u{30}-\\u{7D}\\u{7F}-\\u{10FFFF}]|~[01])*)*`,$=`(?:0|[1-9][0-9]*)`,Ge=`${$}(?:${`(?:[+-]${$})`}?${We}|#)`,Ke=RegExp.prototype.test.bind(RegExp(`^${Ge}$`,`u`)),qe=e=>{try{return new RegExp(e,`u`),!0}catch{return!1}};f({id:`https://json-schema.org/format/draft-04/hostname`,handler:e=>typeof e!=`string`||U(e)}),f({id:`https://json-schema.org/format/date-time`,handler:e=>typeof e!=`string`||_e(e)}),f({id:`https://json-schema.org/format/date`,handler:e=>typeof e!=`string`||_(e)}),f({id:`https://json-schema.org/format/time`,handler:e=>typeof e!=`string`||me(e)}),f({id:`https://json-schema.org/format/duration`,handler:e=>typeof e!=`string`||A(e)}),f({id:`https://json-schema.org/format/email`,handler:e=>typeof e!=`string`||xe(e)}),f({id:`https://json-schema.org/format/ipv4`,handler:e=>typeof e!=`string`||Te(e)}),f({id:`https://json-schema.org/format/ipv6`,handler:e=>typeof e!=`string`||ke(e)}),f({id:`https://json-schema.org/format/uri`,handler:e=>typeof e!=`string`||Ae(e)}),f({id:`https://json-schema.org/format/uri-reference`,handler:e=>typeof e!=`string`||je(e)}),f({id:`https://json-schema.org/format/iri`,handler:e=>typeof e!=`string`||Me(e)}),f({id:`https://json-schema.org/format/iri-reference`,handler:e=>typeof e!=`string`||Ne(e)}),f({id:`https://json-schema.org/format/uuid`,handler:e=>typeof e!=`string`||Fe(e)}),f({id:`https://json-schema.org/format/uri-template`,handler:e=>typeof e!=`string`||He(e)}),f({id:`https://json-schema.org/format/json-pointer`,handler:e=>typeof e!=`string`||Ue(e)}),f({id:`https://json-schema.org/format/relative-json-pointer`,handler:e=>typeof e!=`string`||Ke(e)}),f({id:`https://json-schema.org/format/regex`,handler:e=>typeof e!=`string`||qe(e)});var Je={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{type:`integer`,minimum:1,$id:`https://example.com/v1`},email:{type:`string`,format:`email`,$id:`https://example.com/v2`},age:{type:`integer`,minimum:21,maximum:100,$id:`https://example.com/v3`},roles:{type:`array`,items:{type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`https://example.com/v5`},uniqueItems:!0,minItems:1,$id:`https://example.com/v4`}},additionalProperties:!1,$id:`https://example.com/v0`},Ye={"https://example.com/v1":d(`{"ast":{"metaData":{"https://example.com/v1":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v1#":[["https://json-schema.org/keyword/type","https://example.com/v1#/type","integer"],["https://json-schema.org/keyword/minimum","https://example.com/v1#/minimum",1]]},"schemaUri":"https://example.com/v1#"}`),"https://example.com/v2":d(`{"ast":{"metaData":{"https://example.com/v2":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v2#":[["https://json-schema.org/keyword/type","https://example.com/v2#/type","string"],["https://json-schema.org/keyword/draft-07/format","https://example.com/v2#/format","email"]]},"schemaUri":"https://example.com/v2#"}`),"https://example.com/v3":d(`{"ast":{"metaData":{"https://example.com/v3":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v3#":[["https://json-schema.org/keyword/type","https://example.com/v3#/type","integer"],["https://json-schema.org/keyword/minimum","https://example.com/v3#/minimum",21],["https://json-schema.org/keyword/maximum","https://example.com/v3#/maximum",100]]},"schemaUri":"https://example.com/v3#"}`),"https://example.com/v5":d(`{"ast":{"metaData":{"https://example.com/v5":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v5#":[["https://json-schema.org/keyword/type","https://example.com/v5#/type","string"],["https://json-schema.org/keyword/enum","https://example.com/v5#/enum",["\\"admin\\"","\\"editor\\"","\\"viewer\\""]]]},"schemaUri":"https://example.com/v5#"}`),"https://example.com/v4":d(`{"ast":{"metaData":{"https://example.com/v4":{"dynamicAnchors":{}},"https://example.com/v5":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v4#":[["https://json-schema.org/keyword/type","https://example.com/v4#/type","array"],["https://json-schema.org/keyword/draft-04/items","https://example.com/v4#/items","https://example.com/v5#"],["https://json-schema.org/keyword/uniqueItems","https://example.com/v4#/uniqueItems",true],["https://json-schema.org/keyword/minItems","https://example.com/v4#/minItems",1]],"https://example.com/v5#":[["https://json-schema.org/keyword/type","https://example.com/v5#/type","string"],["https://json-schema.org/keyword/enum","https://example.com/v5#/enum",["\\"admin\\"","\\"editor\\"","\\"viewer\\""]]]},"schemaUri":"https://example.com/v4#"}`),"https://example.com/v0":d(`{"ast":{"metaData":{"https://example.com/v0":{"dynamicAnchors":{}},"https://example.com/v1":{"dynamicAnchors":{}},"https://example.com/v2":{"dynamicAnchors":{}},"https://example.com/v3":{"dynamicAnchors":{}},"https://example.com/v4":{"dynamicAnchors":{}},"https://example.com/v5":{"dynamicAnchors":{}}},"plugins":[],"https://example.com/v0#":[["https://json-schema.org/keyword/title","https://example.com/v0#/title","User"],["https://json-schema.org/keyword/type","https://example.com/v0#/type","object"],["https://json-schema.org/keyword/required","https://example.com/v0#/required",["id","email","age","roles"]],["https://json-schema.org/keyword/properties","https://example.com/v0#/properties",{"id":"https://example.com/v1#","email":"https://example.com/v2#","age":"https://example.com/v3#","roles":"https://example.com/v4#"}],["https://json-schema.org/keyword/additionalProperties","https://example.com/v0#/additionalProperties",[{"a6d8f3e1-9b2c-4f7a-8d5b-1c2e3f4a5b6c":{"source":"^id$|^email$|^age$|^roles$","flags":"u"}},"https://example.com/v0#/additionalProperties"]]],"https://example.com/v1#":[["https://json-schema.org/keyword/type","https://example.com/v1#/type","integer"],["https://json-schema.org/keyword/minimum","https://example.com/v1#/minimum",1]],"https://example.com/v2#":[["https://json-schema.org/keyword/type","https://example.com/v2#/type","string"],["https://json-schema.org/keyword/draft-07/format","https://example.com/v2#/format","email"]],"https://example.com/v3#":[["https://json-schema.org/keyword/type","https://example.com/v3#/type","integer"],["https://json-schema.org/keyword/minimum","https://example.com/v3#/minimum",21],["https://json-schema.org/keyword/maximum","https://example.com/v3#/maximum",100]],"https://example.com/v4#":[["https://json-schema.org/keyword/type","https://example.com/v4#/type","array"],["https://json-schema.org/keyword/draft-04/items","https://example.com/v4#/items","https://example.com/v5#"],["https://json-schema.org/keyword/uniqueItems","https://example.com/v4#/uniqueItems",true],["https://json-schema.org/keyword/minItems","https://example.com/v4#/minItems",1]],"https://example.com/v5#":[["https://json-schema.org/keyword/type","https://example.com/v5#/type","string"],["https://json-schema.org/keyword/enum","https://example.com/v5#/enum",["\\"admin\\"","\\"editor\\"","\\"viewer\\""]]],"https://example.com/v0#/additionalProperties":false},"schemaUri":"https://example.com/v0#"}`)},Xe=a(`<!> <pre> </pre>`,1);function Ze(t,a){o(a,!0);let{defaults:l}=e(),u=ie({...l,schema:Je,validator:se({validatorRetriever:oe(Ye)}),fieldsValidationMode:11,resolver:ae});var d=Xe(),f=r(d);re(f,{get form(){return u},novalidate:!0});var p=ee(f,2),m=i(p,!0);n(e=>te(m,e),[()=>JSON.stringify(ne(u),null,2)]),s(t,d),c()}var Qe={files:{"src/routes/+page.svelte":t(`<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { fromValidators } from "@sjsf/form/validators/precompile";
  import { createFormValidatorFactory } from "@sjsf/hyperjump-validator/precompile";
  import "@hyperjump/json-schema/formats-lite";
  import "@hyperjump/json-schema/draft-07";

  import { getDemoContext } from "@/lib/demo";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import { validators } from "./validators.generated";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromValidators(validators),
    }),
    fieldsValidationMode,
    resolver,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/routes/compile-schema-script.ts":`import fs from "node:fs";
import path from "node:path";

import {
  registerSchema,
  unregisterSchema,
  validate,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";

import inputSchema from "../input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the \`schema\` and
// use it to generate the form
let id = 0;
const toId = (n: number) => \`https://example.com/v\${n}\`;
const patch = insertSubSchemaIds(inputSchema as any, {
  fieldsValidationMode,
  createId: () => toId(id++),
});

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  \`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = \${fieldsValidationMode}
export const schema = \${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;\`
);

const schemas = fragmentSchema(patch);

for (const schema of schemas) {
  registerSchema(
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema" },
      schema as SchemaObject
    )
  );
}

try {
  const serialized: Record<string, string> = {};
  for (const schema of schemas) {
    const validator = await validate(schema.$id!);
    serialized[schema.$id!] = validator.serialize();
  }

  fs.writeFileSync(
    path.join(import.meta.dirname, "validators.generated.ts"),
    \`import { restoreValidator } from "@hyperjump/json-schema/draft-07";

export const validators = {
\${Object.entries(serialized)
  .map(
    ([id, json]) =>
      \`  \${JSON.stringify(id)}: restoreValidator(\${JSON.stringify(json)}),\`
  )
  .join("\\n")}
};
\`
  );
} finally {
  for (const s of schemas) {
    unregisterSchema(s.$id!);
  }
}
`,"src/input-schema.json":h,"src/routes/patched-schema.ts":`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 11
export const schema = {
  "title": "User",
  "type": "object",
  "required": [
    "id",
    "email",
    "age",
    "roles"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "$id": "https://example.com/v1"
    },
    "email": {
      "type": "string",
      "format": "email",
      "$id": "https://example.com/v2"
    },
    "age": {
      "type": "integer",
      "minimum": 21,
      "maximum": 100,
      "$id": "https://example.com/v3"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "admin",
          "editor",
          "viewer"
        ],
        "$id": "https://example.com/v5"
      },
      "uniqueItems": true,
      "minItems": 1,
      "$id": "https://example.com/v4"
    }
  },
  "additionalProperties": false,
  "$id": "https://example.com/v0"
} as const satisfies Schema;`,"src/routes/validators.generated.ts":`import { restoreValidator } from "@hyperjump/json-schema/draft-07";

export const validators = {
  "https://example.com/v1": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v1\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v1#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v1#/type\\",\\"integer\\"],[\\"https://json-schema.org/keyword/minimum\\",\\"https://example.com/v1#/minimum\\",1]]},\\"schemaUri\\":\\"https://example.com/v1#\\"}"),
  "https://example.com/v2": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v2\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v2#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v2#/type\\",\\"string\\"],[\\"https://json-schema.org/keyword/draft-07/format\\",\\"https://example.com/v2#/format\\",\\"email\\"]]},\\"schemaUri\\":\\"https://example.com/v2#\\"}"),
  "https://example.com/v3": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v3\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v3#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v3#/type\\",\\"integer\\"],[\\"https://json-schema.org/keyword/minimum\\",\\"https://example.com/v3#/minimum\\",21],[\\"https://json-schema.org/keyword/maximum\\",\\"https://example.com/v3#/maximum\\",100]]},\\"schemaUri\\":\\"https://example.com/v3#\\"}"),
  "https://example.com/v5": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v5\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v5#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v5#/type\\",\\"string\\"],[\\"https://json-schema.org/keyword/enum\\",\\"https://example.com/v5#/enum\\",[\\"\\\\\\"admin\\\\\\"\\",\\"\\\\\\"editor\\\\\\"\\",\\"\\\\\\"viewer\\\\\\"\\"]]]},\\"schemaUri\\":\\"https://example.com/v5#\\"}"),
  "https://example.com/v4": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v4\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v5\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v4#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v4#/type\\",\\"array\\"],[\\"https://json-schema.org/keyword/draft-04/items\\",\\"https://example.com/v4#/items\\",\\"https://example.com/v5#\\"],[\\"https://json-schema.org/keyword/uniqueItems\\",\\"https://example.com/v4#/uniqueItems\\",true],[\\"https://json-schema.org/keyword/minItems\\",\\"https://example.com/v4#/minItems\\",1]],\\"https://example.com/v5#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v5#/type\\",\\"string\\"],[\\"https://json-schema.org/keyword/enum\\",\\"https://example.com/v5#/enum\\",[\\"\\\\\\"admin\\\\\\"\\",\\"\\\\\\"editor\\\\\\"\\",\\"\\\\\\"viewer\\\\\\"\\"]]]},\\"schemaUri\\":\\"https://example.com/v4#\\"}"),
  "https://example.com/v0": restoreValidator("{\\"ast\\":{\\"metaData\\":{\\"https://example.com/v0\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v1\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v2\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v3\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v4\\":{\\"dynamicAnchors\\":{}},\\"https://example.com/v5\\":{\\"dynamicAnchors\\":{}}},\\"plugins\\":[],\\"https://example.com/v0#\\":[[\\"https://json-schema.org/keyword/title\\",\\"https://example.com/v0#/title\\",\\"User\\"],[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v0#/type\\",\\"object\\"],[\\"https://json-schema.org/keyword/required\\",\\"https://example.com/v0#/required\\",[\\"id\\",\\"email\\",\\"age\\",\\"roles\\"]],[\\"https://json-schema.org/keyword/properties\\",\\"https://example.com/v0#/properties\\",{\\"id\\":\\"https://example.com/v1#\\",\\"email\\":\\"https://example.com/v2#\\",\\"age\\":\\"https://example.com/v3#\\",\\"roles\\":\\"https://example.com/v4#\\"}],[\\"https://json-schema.org/keyword/additionalProperties\\",\\"https://example.com/v0#/additionalProperties\\",[{\\"a6d8f3e1-9b2c-4f7a-8d5b-1c2e3f4a5b6c\\":{\\"source\\":\\"^id$|^email$|^age$|^roles$\\",\\"flags\\":\\"u\\"}},\\"https://example.com/v0#/additionalProperties\\"]]],\\"https://example.com/v1#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v1#/type\\",\\"integer\\"],[\\"https://json-schema.org/keyword/minimum\\",\\"https://example.com/v1#/minimum\\",1]],\\"https://example.com/v2#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v2#/type\\",\\"string\\"],[\\"https://json-schema.org/keyword/draft-07/format\\",\\"https://example.com/v2#/format\\",\\"email\\"]],\\"https://example.com/v3#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v3#/type\\",\\"integer\\"],[\\"https://json-schema.org/keyword/minimum\\",\\"https://example.com/v3#/minimum\\",21],[\\"https://json-schema.org/keyword/maximum\\",\\"https://example.com/v3#/maximum\\",100]],\\"https://example.com/v4#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v4#/type\\",\\"array\\"],[\\"https://json-schema.org/keyword/draft-04/items\\",\\"https://example.com/v4#/items\\",\\"https://example.com/v5#\\"],[\\"https://json-schema.org/keyword/uniqueItems\\",\\"https://example.com/v4#/uniqueItems\\",true],[\\"https://json-schema.org/keyword/minItems\\",\\"https://example.com/v4#/minItems\\",1]],\\"https://example.com/v5#\\":[[\\"https://json-schema.org/keyword/type\\",\\"https://example.com/v5#/type\\",\\"string\\"],[\\"https://json-schema.org/keyword/enum\\",\\"https://example.com/v5#/enum\\",[\\"\\\\\\"admin\\\\\\"\\",\\"\\\\\\"editor\\\\\\"\\",\\"\\\\\\"viewer\\\\\\"\\"]]],\\"https://example.com/v0#/additionalProperties\\":false},\\"schemaUri\\":\\"https://example.com/v0#\\"}"),
};
`},Component:Ze,meta:{validator:{name:`hyperjump`,draft2020:!1,precompiled:!0},fields:[`multi-enum`],widgets:[`checkboxes`]}};export{Qe as default};