import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import"./index-client.DAEmVQx2.js";import{$t as t,At as n,Qt as r,an as i,at as a,et as o,jt as s,kt as c,st as l,wt as u}from"./client.B0k3dZbu.js";import{a as d,d as f}from"./playground.BD3tCRMM.js";import{X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{a as g,i as _}from"./demo.yFJ0eT_4.js";import{t as v}from"./precompile.CaLSvE89.js";import{t as y}from"./input-schema.D8cf2JKT.js";var b={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{type:`integer`,minimum:1,$id:`v1`},email:{type:`string`,format:`email`,$id:`v2`},age:{type:`integer`,minimum:21,maximum:100,$id:`v3`},roles:{type:`array`,items:{type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`v5`},uniqueItems:!0,minItems:1,$id:`v4`}},additionalProperties:!1,$id:`v0`},x=e({v0:()=>H,v1:()=>T,v2:()=>O,v3:()=>M,v4:()=>R,v5:()=>F}),S=(e,t)=>()=>{try{return t||e((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},C=S((e,t)=>{t.exports=function e(t,n){if(t===n)return!0;if(t&&n&&typeof t==`object`&&typeof n==`object`){if(t.constructor!==n.constructor)return!1;var r,i,a;if(Array.isArray(t)){if(r=t.length,r!=n.length)return!1;for(i=r;i--!==0;)if(!e(t[i],n[i]))return!1;return!0}if(t.constructor===RegExp)return t.source===n.source&&t.flags===n.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===n.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===n.toString();if(a=Object.keys(t),r=a.length,r!==Object.keys(n).length)return!1;for(i=r;i--!==0;)if(!Object.prototype.hasOwnProperty.call(n,a[i]))return!1;for(i=r;i--!==0;){var o=a[i];if(!e(t[o],n[o]))return!1}return!0}return t!==t&&n!==n}}),w=S(e=>{Object.defineProperty(e,"__esModule",{value:!0});var t=C();t.code=`require("ajv/dist/runtime/equal").default`,e.default=t}),T=D,E={type:`integer`,minimum:1,$id:`v1`};function D(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(!(typeof e==`number`&&!(e%1)&&!isNaN(e))){let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`integer`},message:`must be integer`,schema:E.type,parentSchema:E,data:e};a===null?a=[n]:a.push(n),o++}if(typeof e==`number`&&(e<1||isNaN(e))){let n={instancePath:t,schemaPath:`#/minimum`,keyword:`minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,schema:1,parentSchema:E,data:e};a===null?a=[n]:a.push(n),o++}return D.errors=a,o===0}var O=j,k={type:`string`,format:`email`,$id:`v2`},A=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;function j(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(typeof e==`string`){if(!A.test(e)){let n={instancePath:t,schemaPath:`#/format`,keyword:`format`,params:{format:`email`},message:`must match format "email"`,schema:`email`,parentSchema:k,data:e};a===null?a=[n]:a.push(n),o++}}else{let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`string`},message:`must be string`,schema:k.type,parentSchema:k,data:e};a===null?a=[n]:a.push(n),o++}return j.errors=a,o===0}var M=P,N={type:`integer`,minimum:21,maximum:100,$id:`v3`};function P(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(!(typeof e==`number`&&!(e%1)&&!isNaN(e))){let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`integer`},message:`must be integer`,schema:N.type,parentSchema:N,data:e};a===null?a=[n]:a.push(n),o++}if(typeof e==`number`){if(e>100||isNaN(e)){let n={instancePath:t,schemaPath:`#/maximum`,keyword:`maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,schema:100,parentSchema:N,data:e};a===null?a=[n]:a.push(n),o++}if(e<21||isNaN(e)){let n={instancePath:t,schemaPath:`#/minimum`,keyword:`minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,schema:21,parentSchema:N,data:e};a===null?a=[n]:a.push(n),o++}}return P.errors=a,o===0}var F=L,I={type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`v5`};function L(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(typeof e!=`string`){let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`string`},message:`must be string`,schema:I.type,parentSchema:I,data:e};a===null?a=[n]:a.push(n),o++}if(!(e===`admin`||e===`editor`||e===`viewer`)){let n={instancePath:t,schemaPath:`#/enum`,keyword:`enum`,params:{allowedValues:I.enum},message:`must be equal to one of the allowed values`,schema:I.enum,parentSchema:I,data:e};a===null?a=[n]:a.push(n),o++}return L.errors=a,o===0}var R=V,z={type:`array`,items:{$ref:`v5#`},uniqueItems:!0,minItems:1,$id:`v4`},B=w().default;function V(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(Array.isArray(e)){if(e.length<1){let n={instancePath:t,schemaPath:`#/minItems`,keyword:`minItems`,params:{limit:1},message:`must NOT have fewer than 1 items`,schema:1,parentSchema:z,data:e};a===null?a=[n]:a.push(n),o++}let n=e.length;for(let r=0;r<n;r++){let n=e[r];if(typeof n!=`string`){let e={instancePath:t+`/`+r,schemaPath:`v5#/type`,keyword:`type`,params:{type:`string`},message:`must be string`,schema:I.type,parentSchema:I,data:n};a===null?a=[e]:a.push(e),o++}if(!(n===`admin`||n===`editor`||n===`viewer`)){let e={instancePath:t+`/`+r,schemaPath:`v5#/enum`,keyword:`enum`,params:{allowedValues:I.enum},message:`must be equal to one of the allowed values`,schema:I.enum,parentSchema:I,data:n};a===null?a=[e]:a.push(e),o++}}let r=e.length,i;if(r>1){e:for(;r--;)for(i=r;i--;)if(B(e[r],e[i])){let n={instancePath:t,schemaPath:`#/uniqueItems`,keyword:`uniqueItems`,params:{i:r,j:i},message:`must NOT have duplicate items (items ## `+i+` and `+r+` are identical)`,schema:!0,parentSchema:z,data:e};a===null?a=[n]:a.push(n),o++;break e}}}else{let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`array`},message:`must be array`,schema:z.type,parentSchema:z,data:e};a===null?a=[n]:a.push(n),o++}return V.errors=a,o===0}var H=W,U={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{$ref:`v1#`},email:{$ref:`v2#`},age:{$ref:`v3#`},roles:{$ref:`v4#`}},additionalProperties:!1,$id:`v0`};function W(e,{instancePath:t=``,parentData:n,parentDataProperty:r,rootData:i=e}={}){let a=null,o=0;if(e&&typeof e==`object`&&!Array.isArray(e)){if(e.id===void 0){let n={instancePath:t,schemaPath:`#/required`,keyword:`required`,params:{missingProperty:`id`},message:`must have required property 'id'`,schema:U.required,parentSchema:U,data:e};a===null?a=[n]:a.push(n),o++}if(e.email===void 0){let n={instancePath:t,schemaPath:`#/required`,keyword:`required`,params:{missingProperty:`email`},message:`must have required property 'email'`,schema:U.required,parentSchema:U,data:e};a===null?a=[n]:a.push(n),o++}if(e.age===void 0){let n={instancePath:t,schemaPath:`#/required`,keyword:`required`,params:{missingProperty:`age`},message:`must have required property 'age'`,schema:U.required,parentSchema:U,data:e};a===null?a=[n]:a.push(n),o++}if(e.roles===void 0){let n={instancePath:t,schemaPath:`#/required`,keyword:`required`,params:{missingProperty:`roles`},message:`must have required property 'roles'`,schema:U.required,parentSchema:U,data:e};a===null?a=[n]:a.push(n),o++}for(let n in e)if(!(n===`id`||n===`email`||n===`age`||n===`roles`)){let r={instancePath:t,schemaPath:`#/additionalProperties`,keyword:`additionalProperties`,params:{additionalProperty:n},message:`must NOT have additional properties`,schema:!1,parentSchema:U,data:e};a===null?a=[r]:a.push(r),o++}if(e.id!==void 0){let n=e.id;if(!(typeof n==`number`&&!(n%1)&&!isNaN(n))){let e={instancePath:t+`/id`,schemaPath:`v1#/type`,keyword:`type`,params:{type:`integer`},message:`must be integer`,schema:E.type,parentSchema:E,data:n};a===null?a=[e]:a.push(e),o++}if(typeof n==`number`&&(n<1||isNaN(n))){let e={instancePath:t+`/id`,schemaPath:`v1#/minimum`,keyword:`minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,schema:1,parentSchema:E,data:n};a===null?a=[e]:a.push(e),o++}}if(e.email!==void 0){let n=e.email;if(typeof n==`string`){if(!A.test(n)){let e={instancePath:t+`/email`,schemaPath:`v2#/format`,keyword:`format`,params:{format:`email`},message:`must match format "email"`,schema:`email`,parentSchema:k,data:n};a===null?a=[e]:a.push(e),o++}}else{let e={instancePath:t+`/email`,schemaPath:`v2#/type`,keyword:`type`,params:{type:`string`},message:`must be string`,schema:k.type,parentSchema:k,data:n};a===null?a=[e]:a.push(e),o++}}if(e.age!==void 0){let n=e.age;if(!(typeof n==`number`&&!(n%1)&&!isNaN(n))){let e={instancePath:t+`/age`,schemaPath:`v3#/type`,keyword:`type`,params:{type:`integer`},message:`must be integer`,schema:N.type,parentSchema:N,data:n};a===null?a=[e]:a.push(e),o++}if(typeof n==`number`){if(n>100||isNaN(n)){let e={instancePath:t+`/age`,schemaPath:`v3#/maximum`,keyword:`maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,schema:100,parentSchema:N,data:n};a===null?a=[e]:a.push(e),o++}if(n<21||isNaN(n)){let e={instancePath:t+`/age`,schemaPath:`v3#/minimum`,keyword:`minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,schema:21,parentSchema:N,data:n};a===null?a=[e]:a.push(e),o++}}}e.roles!==void 0&&(V(e.roles,{instancePath:t+`/roles`,parentData:e,parentDataProperty:`roles`,rootData:i})||(a=a===null?V.errors:a.concat(V.errors),o=a.length))}else{let n={instancePath:t,schemaPath:`#/type`,keyword:`type`,params:{type:`object`},message:`must be object`,schema:U.type,parentSchema:U,data:e};a===null?a=[n]:a.push(n),o++}return W.errors=a,o===0}var G=l(`<!> <pre> </pre>`,1);function K(e,l){t(l,!0);let{defaults:_}=g(),y=h({..._,schema:b,validator:v({validatorRetriever:f(x)}),fieldsValidationMode:11,resolver:d});var S=G(),C=n(S);m(C,{get form(){return y},novalidate:!0});var w=s(C,2),T=c(w,!0);i(w),u(e=>o(T,e),[()=>JSON.stringify(p(y),null,2)]),a(e,S),r()}var q={files:{"src/routes/+page.svelte":_(`<script lang="ts">
  import { createFormValidatorFactory } from "@sjsf/ajv8-validator/precompile";
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { fromValidators } from "@sjsf/form/validators/precompile";

  import { getDemoContext } from "@/lib/demo";

  import { schema, fieldsValidationMode } from "./patched-schema";
  import * as validateFunctions from "./validate-functions";

  const { defaults } = getDemoContext();

  const form = createForm({
    ...defaults,
    schema,
    validator: createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    }),
    fieldsValidationMode,
    resolver,
  });
<\/script>

<BasicForm {form} novalidate />

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
`),"src/routes/compile-schema-script.ts":`import fs from "node:fs";
import path from "node:path";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "@sjsf/ajv8-validator";
import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import Ajv from "ajv";
import addFormats from "ajv-formats";
import standaloneCode from "ajv/dist/standalone/index.js";
import { build } from "esbuild";

import inputSchema from "../input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the \`schema\` and
// use it to generate the form
const patch = insertSubSchemaIds(inputSchema as any, { fieldsValidationMode });

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  \`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = \${fieldsValidationMode}
export const schema = \${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;\`
);

const ajv = new Ajv({
  ...DEFAULT_AJV_CONFIG,
  schemas: fragmentSchema(patch),
  formats: {
    "phone-us": /\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$/,
    "area-code": /\\d{3}/,
  },
  code: {
    source: true,
    esm: true,
  },
});
const modules = standaloneCode(addFormComponents(addFormats(ajv)));

// https://github.com/ajv-validator/ajv/issues/2209#issuecomment-2580172967
const { outputFiles } = await build({
  minify: true,
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  sourcemap: false,
  stdin: {
    contents: modules,
    resolveDir: process.cwd(),
    sourcefile: "input.js",
    loader: "js",
  },
});
const bundle = outputFiles[0].text;

fs.writeFileSync(
  path.join(import.meta.dirname, "validate-functions.js"),
  bundle
);
`,"src/input-schema.json":y,"src/routes/patched-schema.ts":`import type { Schema } from "@sjsf/form";
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
      "$id": "v1"
    },
    "email": {
      "type": "string",
      "format": "email",
      "$id": "v2"
    },
    "age": {
      "type": "integer",
      "minimum": 21,
      "maximum": 100,
      "$id": "v3"
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
        "$id": "v5"
      },
      "uniqueItems": true,
      "minItems": 1,
      "$id": "v4"
    }
  },
  "additionalProperties": false,
  "$id": "v0"
} as const satisfies Schema;`,"src/routes/validate-functions.js":`var S=(r,t)=>()=>{try{return t||r((t={exports:{}}).exports,t),t.exports}catch(i){throw t=0,i}};var k=S((I,q)=>{"use strict";q.exports=function r(t,i){if(t===i)return!0;if(t&&i&&typeof t=="object"&&typeof i=="object"){if(t.constructor!==i.constructor)return!1;var o,n,e;if(Array.isArray(t)){if(o=t.length,o!=i.length)return!1;for(n=o;n--!==0;)if(!r(t[n],i[n]))return!1;return!0}if(t.constructor===RegExp)return t.source===i.source&&t.flags===i.flags;if(t.valueOf!==Object.prototype.valueOf)return t.valueOf()===i.valueOf();if(t.toString!==Object.prototype.toString)return t.toString()===i.toString();if(e=Object.keys(t),o=e.length,o!==Object.keys(i).length)return!1;for(n=o;n--!==0;)if(!Object.prototype.hasOwnProperty.call(i,e[n]))return!1;for(n=o;n--!==0;){var m=e[n];if(!r(t[m],i[m]))return!1}return!0}return t!==t&&i!==i}});var N=S(P=>{"use strict";Object.defineProperty(P,"__esModule",{value:!0});var b=k();b.code='require("ajv/dist/runtime/equal").default';P.default=b});var T=D,h={type:"integer",minimum:1,$id:"v1"};function D(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(!(typeof r=="number"&&!(r%1)&&!isNaN(r))){let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"integer"},message:"must be integer",schema:h.type,parentSchema:h,data:r};e===null?e=[s]:e.push(s),m++}if(typeof r=="number"&&(r<1||isNaN(r))){let s={instancePath:t,schemaPath:"#/minimum",keyword:"minimum",params:{comparison:">=",limit:1},message:"must be >= 1",schema:1,parentSchema:h,data:r};e===null?e=[s]:e.push(s),m++}return D.errors=e,m===0}var V=O,y={type:"string",format:"email",$id:"v2"},j=/^[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;function O(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(typeof r=="string"){if(!j.test(r)){let s={instancePath:t,schemaPath:"#/format",keyword:"format",params:{format:"email"},message:'must match format "email"',schema:"email",parentSchema:y,data:r};e===null?e=[s]:e.push(s),m++}}else{let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"string"},message:"must be string",schema:y.type,parentSchema:y,data:r};e===null?e=[s]:e.push(s),m++}return O.errors=e,m===0}var M=$,c={type:"integer",minimum:21,maximum:100,$id:"v3"};function $(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(!(typeof r=="number"&&!(r%1)&&!isNaN(r))){let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"integer"},message:"must be integer",schema:c.type,parentSchema:c,data:r};e===null?e=[s]:e.push(s),m++}if(typeof r=="number"){if(r>100||isNaN(r)){let s={instancePath:t,schemaPath:"#/maximum",keyword:"maximum",params:{comparison:"<=",limit:100},message:"must be <= 100",schema:100,parentSchema:c,data:r};e===null?e=[s]:e.push(s),m++}if(r<21||isNaN(r)){let s={instancePath:t,schemaPath:"#/minimum",keyword:"minimum",params:{comparison:">=",limit:21},message:"must be >= 21",schema:21,parentSchema:c,data:r};e===null?e=[s]:e.push(s),m++}}return $.errors=e,m===0}var R=x,p={type:"string",enum:["admin","editor","viewer"],$id:"v5"};function x(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(typeof r!="string"){let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"string"},message:"must be string",schema:p.type,parentSchema:p,data:r};e===null?e=[s]:e.push(s),m++}if(!(r==="admin"||r==="editor"||r==="viewer")){let s={instancePath:t,schemaPath:"#/enum",keyword:"enum",params:{allowedValues:p.enum},message:"must be equal to one of the allowed values",schema:p.enum,parentSchema:p,data:r};e===null?e=[s]:e.push(s),m++}return x.errors=e,m===0}var U=v,w={type:"array",items:{$ref:"v5#"},uniqueItems:!0,minItems:1,$id:"v4"},E=N().default;function v(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(Array.isArray(r)){if(r.length<1){let u={instancePath:t,schemaPath:"#/minItems",keyword:"minItems",params:{limit:1},message:"must NOT have fewer than 1 items",schema:1,parentSchema:w,data:r};e===null?e=[u]:e.push(u),m++}let s=r.length;for(let u=0;u<s;u++){let f=r[u];if(typeof f!="string"){let d={instancePath:t+"/"+u,schemaPath:"v5#/type",keyword:"type",params:{type:"string"},message:"must be string",schema:p.type,parentSchema:p,data:f};e===null?e=[d]:e.push(d),m++}if(!(f==="admin"||f==="editor"||f==="viewer")){let d={instancePath:t+"/"+u,schemaPath:"v5#/enum",keyword:"enum",params:{allowedValues:p.enum},message:"must be equal to one of the allowed values",schema:p.enum,parentSchema:p,data:f};e===null?e=[d]:e.push(d),m++}}let a=r.length,g;if(a>1){e:for(;a--;)for(g=a;g--;)if(E(r[a],r[g])){let u={instancePath:t,schemaPath:"#/uniqueItems",keyword:"uniqueItems",params:{i:a,j:g},message:"must NOT have duplicate items (items ## "+g+" and "+a+" are identical)",schema:!0,parentSchema:w,data:r};e===null?e=[u]:e.push(u),m++;break e}}}else{let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"array"},message:"must be array",schema:w.type,parentSchema:w,data:r};e===null?e=[s]:e.push(s),m++}return v.errors=e,m===0}var B=z,l={title:"User",type:"object",required:["id","email","age","roles"],properties:{id:{$ref:"v1#"},email:{$ref:"v2#"},age:{$ref:"v3#"},roles:{$ref:"v4#"}},additionalProperties:!1,$id:"v0"};function z(r,{instancePath:t="",parentData:i,parentDataProperty:o,rootData:n=r}={}){let e=null,m=0;if(r&&typeof r=="object"&&!Array.isArray(r)){if(r.id===void 0){let s={instancePath:t,schemaPath:"#/required",keyword:"required",params:{missingProperty:"id"},message:"must have required property 'id'",schema:l.required,parentSchema:l,data:r};e===null?e=[s]:e.push(s),m++}if(r.email===void 0){let s={instancePath:t,schemaPath:"#/required",keyword:"required",params:{missingProperty:"email"},message:"must have required property 'email'",schema:l.required,parentSchema:l,data:r};e===null?e=[s]:e.push(s),m++}if(r.age===void 0){let s={instancePath:t,schemaPath:"#/required",keyword:"required",params:{missingProperty:"age"},message:"must have required property 'age'",schema:l.required,parentSchema:l,data:r};e===null?e=[s]:e.push(s),m++}if(r.roles===void 0){let s={instancePath:t,schemaPath:"#/required",keyword:"required",params:{missingProperty:"roles"},message:"must have required property 'roles'",schema:l.required,parentSchema:l,data:r};e===null?e=[s]:e.push(s),m++}for(let s in r)if(!(s==="id"||s==="email"||s==="age"||s==="roles")){let a={instancePath:t,schemaPath:"#/additionalProperties",keyword:"additionalProperties",params:{additionalProperty:s},message:"must NOT have additional properties",schema:!1,parentSchema:l,data:r};e===null?e=[a]:e.push(a),m++}if(r.id!==void 0){let s=r.id;if(!(typeof s=="number"&&!(s%1)&&!isNaN(s))){let a={instancePath:t+"/id",schemaPath:"v1#/type",keyword:"type",params:{type:"integer"},message:"must be integer",schema:h.type,parentSchema:h,data:s};e===null?e=[a]:e.push(a),m++}if(typeof s=="number"&&(s<1||isNaN(s))){let a={instancePath:t+"/id",schemaPath:"v1#/minimum",keyword:"minimum",params:{comparison:">=",limit:1},message:"must be >= 1",schema:1,parentSchema:h,data:s};e===null?e=[a]:e.push(a),m++}}if(r.email!==void 0){let s=r.email;if(typeof s=="string"){if(!j.test(s)){let a={instancePath:t+"/email",schemaPath:"v2#/format",keyword:"format",params:{format:"email"},message:'must match format "email"',schema:"email",parentSchema:y,data:s};e===null?e=[a]:e.push(a),m++}}else{let a={instancePath:t+"/email",schemaPath:"v2#/type",keyword:"type",params:{type:"string"},message:"must be string",schema:y.type,parentSchema:y,data:s};e===null?e=[a]:e.push(a),m++}}if(r.age!==void 0){let s=r.age;if(!(typeof s=="number"&&!(s%1)&&!isNaN(s))){let a={instancePath:t+"/age",schemaPath:"v3#/type",keyword:"type",params:{type:"integer"},message:"must be integer",schema:c.type,parentSchema:c,data:s};e===null?e=[a]:e.push(a),m++}if(typeof s=="number"){if(s>100||isNaN(s)){let a={instancePath:t+"/age",schemaPath:"v3#/maximum",keyword:"maximum",params:{comparison:"<=",limit:100},message:"must be <= 100",schema:100,parentSchema:c,data:s};e===null?e=[a]:e.push(a),m++}if(s<21||isNaN(s)){let a={instancePath:t+"/age",schemaPath:"v3#/minimum",keyword:"minimum",params:{comparison:">=",limit:21},message:"must be >= 21",schema:21,parentSchema:c,data:s};e===null?e=[a]:e.push(a),m++}}}r.roles!==void 0&&(v(r.roles,{instancePath:t+"/roles",parentData:r,parentDataProperty:"roles",rootData:n})||(e=e===null?v.errors:e.concat(v.errors),m=e.length))}else{let s={instancePath:t,schemaPath:"#/type",keyword:"type",params:{type:"object"},message:"must be object",schema:l.type,parentSchema:l,data:r};e===null?e=[s]:e.push(s),m++}return z.errors=e,m===0}export{B as v0,T as v1,V as v2,M as v3,U as v4,R as v5};
`},Component:K,meta:{validator:{name:`ajv8`,draft2020:!1,precompiled:!0},fields:[`multi-enum`],widgets:[`checkboxes`]}};export{q as default};