import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import"./index-client.DAEmVQx2.js";import{$t as t,At as n,Qt as r,an as i,at as a,et as o,jt as s,kt as c,st as l,wt as u}from"./client.B0k3dZbu.js";import{a as d,d as f}from"./playground.BD3tCRMM.js";import{X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{a as g,i as _}from"./demo.yFJ0eT_4.js";import{t as v}from"./input-schema.D8cf2JKT.js";import{t as y}from"./precompile.DitnMsNN.js";var b={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{type:`integer`,minimum:1,$id:`v1`},email:{type:`string`,format:`email`,$id:`v2`},age:{type:`integer`,minimum:21,maximum:100,$id:`v3`},roles:{type:`array`,items:{type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`v5`},uniqueItems:!0,minItems:1,$id:`v4`}},additionalProperties:!1,$id:`v0`},x=e({v0:()=>D,v1:()=>S,v2:()=>C,v3:()=>w,v4:()=>E,v5:()=>T}),[S,C,w,T,E,D]=(function(){let e=function e(t){e.errors=null;let n=0;return Number.isInteger(t)?1<=t||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/minimum`,instanceLocation:`#`}),n++):(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),n++),n===0},t=e=>{if(e.length>318)return!1;if(/^[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,20}(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]{1,21}){0,2}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i.test(e))return!0;if(!e.includes(`@`)||/(^\.|^"|\.@|\.\.)/.test(e))return!1;let[t,n,...r]=e.split(`@`);return!t||!n||r.length!==0||t.length>64||n.length>253||!/^[a-z0-9.-]+$/i.test(n)||!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(t)?!1:n.split(`.`).every(e=>/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(e))},n=function e(n){e.errors=null;let r=0;return typeof n==`string`?r===r&&(t(n)||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/format`,instanceLocation:`#`}),r++)):(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),r++),r===0},r=function e(t){e.errors=null;let n=0;return Number.isInteger(t)?(21<=t||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/minimum`,instanceLocation:`#`}),n++),100>=t||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/maximum`,instanceLocation:`#`}),n++)):(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),n++),n===0},i=function e(t){e.errors=null;let n=0;return typeof t==`string`?t===`admin`||t===`editor`||t===`viewer`||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/enum`,instanceLocation:`#`}),n++):(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),n++),n===0},a=Function.prototype.call.bind(Object.prototype.hasOwnProperty),o=({keywordLocation:e,instanceLocation:t},n,r)=>({keywordLocation:`${n}${e.slice(1)}`,instanceLocation:`${r}${t.slice(1)}`}),s=e=>{if(e.length<2)return!0;if(e.length===2)return!c(e[0],e[1]);let t=[],n=e.length>20?new Set:null,r=0,i=0;for(let a of e){if(typeof a==`object`)t.push(a);else if(n){if(n.add(a),n.size!==++r)return!1}else if(e.indexOf(a,i+1)!==-1)return!1;i++}for(let e=1;e<t.length;e++)for(let n=0;n<e;n++)if(c(t[e],t[n]))return!1;return!0},c=(e,t)=>{if(e===t)return!0;if(!e||!t||typeof e!=typeof t||e!==t&&typeof e!=`object`)return!1;let n=Object.getPrototypeOf(e);if(n!==Object.getPrototypeOf(t))return!1;if(n===Array.prototype)return!Array.isArray(e)||!Array.isArray(t)||e.length!==t.length?!1:e.every((e,n)=>c(e,t[n]));if(n===Object.prototype){let[n,r]=[Object.keys(e),Object.keys(t)];return n.length===r.length?new Set([...n,...r]).size===n.length&&n.every(n=>c(e[n],t[n])):!1}return!1},l=function e(t){e.errors=null;let n=0;if(!Array.isArray(t))e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),n++;else{let r=n;t.length<1&&(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/minItems`,instanceLocation:`#`}),n++);for(let r=0;r<t.length;r++)if(r in t&&a(t,r)){let a=e.errors,s=i(t[r]),c=i.errors;e.errors=a,s||(e.errors===null&&(e.errors=[]),e.errors.push(...c.map(e=>o(e,`#/items/$ref`,`#/`+r))),n++)}n===r&&(s(t)||(e.errors===null&&(e.errors=[]),e.errors.push({keywordLocation:`#/uniqueItems`,instanceLocation:`#`}),n++))}return n===0},u=e=>/~\//.test(e)?`${e}`.replace(/~/g,`~0`).replace(/\//g,`~1`):e;return[e,n,r,i,l,function t(i){t.errors=null;let s=0;if(!(typeof i==`object`&&i&&!Array.isArray(i)))t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/type`,instanceLocation:`#`}),s++;else{if(`id`in i&&a(i,`id`)||(t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/required`,instanceLocation:`#/id`}),s++),`email`in i&&a(i,`email`)||(t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/required`,instanceLocation:`#/email`}),s++),`age`in i&&a(i,`age`)||(t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/required`,instanceLocation:`#/age`}),s++),`roles`in i&&a(i,`roles`)||(t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/required`,instanceLocation:`#/roles`}),s++),`id`in i&&a(i,`id`)){let n=t.errors,r=e(i.id),a=e.errors;t.errors=n,r||(t.errors===null&&(t.errors=[]),t.errors.push(...a.map(e=>o(e,`#/properties/id/$ref`,`#/id`))),s++)}if(`email`in i&&a(i,`email`)){let e=t.errors,r=n(i.email),a=n.errors;t.errors=e,r||(t.errors===null&&(t.errors=[]),t.errors.push(...a.map(e=>o(e,`#/properties/email/$ref`,`#/email`))),s++)}if(`age`in i&&a(i,`age`)){let e=t.errors,n=r(i.age),a=r.errors;t.errors=e,n||(t.errors===null&&(t.errors=[]),t.errors.push(...a.map(e=>o(e,`#/properties/age/$ref`,`#/age`))),s++)}if(`roles`in i&&a(i,`roles`)){let e=t.errors,n=l(i.roles),r=l.errors;t.errors=e,n||(t.errors===null&&(t.errors=[]),t.errors.push(...r.map(e=>o(e,`#/properties/roles/$ref`,`#/roles`))),s++)}for(let e of Object.keys(i))e!==`id`&&e!==`email`&&e!==`age`&&e!==`roles`&&(t.errors===null&&(t.errors=[]),t.errors.push({keywordLocation:`#/additionalProperties`,instanceLocation:`#/`+u(e)}),s++)}return s===0}]})(),O=l(`<!> <pre> </pre>`,1);function k(e,l){t(l,!0);let{defaults:_}=g(),v=h({..._,schema:b,validator:y({validatorRetriever:f(x)}),fieldsValidationMode:11,resolver:d});var S=O(),C=n(S);m(C,{get form(){return v},novalidate:!0});var w=s(C,2),T=c(w,!0);i(w),u(e=>o(T,e),[()=>JSON.stringify(p(v),null,2)]),a(e,S),r()}var A={files:{"src/routes/+page.svelte":_(`<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { fromValidators } from "@sjsf/form/validators/precompile";
  import { createFormValidatorFactory } from "@sjsf/schemasafe-validator/precompile";

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

import { validator } from "@exodus/schemasafe";
import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  FORM_FORMATS,
} from "@sjsf/schemasafe-validator";

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

const schemas = fragmentSchema(patch);

// @ts-expect-error Typings for \`multi\` version are missing
const validate = validator(schemas, {
  ...DEFAULT_VALIDATOR_OPTIONS,
  formats: {
    ...FORM_FORMATS,
    "phone-us": /\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$/,
    "area-code": /\\d{3}/,
  },
  schemas: new Map(schemas.map((schema) => [schema.$id, schema])),
  multi: true,
});

const validateFunctions = \`export const [\${schemas.map((s) => s.$id).join(", ")}] = \${validate.toModule()}\`;

fs.writeFileSync(
  path.join(import.meta.dirname, "validate-functions.js"),
  validateFunctions
);
`,"src/input-schema.json":v,"src/routes/patched-schema.ts":`import type { Schema } from "@sjsf/form";
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
} as const satisfies Schema;`,"src/routes/validate-functions.js":`export const [v1, v2, v3, v5, v4, v0] = (function() {
'use strict'
const ref0 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Number.isInteger(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(1 <= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minimum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const format0 = (input) => {
    if (input.length > 318) return false
    const fast = /^[a-z0-9!#$%&'*+/=?^_\`{|}~-]{1,20}(?:\\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]{1,21}){0,2}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\\.[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?){0,3}$/i
    if (fast.test(input)) return true
    if (!input.includes('@') || /(^\\.|^"|\\.@|\\.\\.)/.test(input)) return false
    const [name, host, ...rest] = input.split('@')
    if (!name || !host || rest.length !== 0 || name.length > 64 || host.length > 253) return false
    if (!/^[a-z0-9.-]+$/i.test(host) || !/^[a-z0-9.!#$%&'*+/=?^_\`{|}~-]+$/i.test(name)) return false
    return host.split('.').every((part) => /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(part))
  };
const ref1 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    const prev0 = errorCount
    if (errorCount === prev0) {
      if (!format0(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/format", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const ref2 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Number.isInteger(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(21 <= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minimum", instanceLocation: "#" })
      errorCount++
    }
    if (!(100 >= data)) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/maximum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const ref3 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "string")) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!(data === "admin" || data === "editor" || data === "viewer")) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/enum", instanceLocation: "#" })
      errorCount++
    }
  }
  return errorCount === 0
};
const hasOwn = Function.prototype.call.bind(Object.prototype.hasOwnProperty);
const errorMerge = ({ keywordLocation, instanceLocation }, schemaBase, dataBase) => ({
  keywordLocation: \`\${schemaBase}\${keywordLocation.slice(1)}\`,
  instanceLocation: \`\${dataBase}\${instanceLocation.slice(1)}\`,
});
const unique = (array) => {
  if (array.length < 2) return true
  if (array.length === 2) return !deepEqual(array[0], array[1])
  const objects = []
  const primitives = array.length > 20 ? new Set() : null
  let primitivesCount = 0
  let pos = 0
  for (const item of array) {
    if (typeof item === 'object') {
      objects.push(item)
    } else if (primitives) {
      primitives.add(item)
      if (primitives.size !== ++primitivesCount) return false
    } else {
      if (array.indexOf(item, pos + 1) !== -1) return false
    }
    pos++
  }
  for (let i = 1; i < objects.length; i++)
    for (let j = 0; j < i; j++) if (deepEqual(objects[i], objects[j])) return false
  return true
};
const deepEqual = (obj, obj2) => {
  if (obj === obj2) return true
  if (!obj || !obj2 || typeof obj !== typeof obj2) return false
  if (obj !== obj2 && typeof obj !== 'object') return false

  const proto = Object.getPrototypeOf(obj)
  if (proto !== Object.getPrototypeOf(obj2)) return false

  if (proto === Array.prototype) {
    if (!Array.isArray(obj) || !Array.isArray(obj2)) return false
    if (obj.length !== obj2.length) return false
    return obj.every((x, i) => deepEqual(x, obj2[i]))
  } else if (proto === Object.prototype) {
    const [keys, keys2] = [Object.keys(obj), Object.keys(obj2)]
    if (keys.length !== keys2.length) return false
    const keyset2 = new Set([...keys, ...keys2])
    return keyset2.size === keys.length && keys.every((key) => deepEqual(obj[key], obj2[key]))
  }
  return false
};
const ref4 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!Array.isArray(data)) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    const prev1 = errorCount
    if (data.length < 1) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/minItems", instanceLocation: "#" })
      errorCount++
    }
    for (let i = 0; i < data.length; i++) {
      if (i in data && hasOwn(data, i)) {
        const err0 = validate.errors
        const res0 = ref3(data[i])
        const suberr0 = ref3.errors
        validate.errors = err0
        if (!res0) {
          if (validate.errors === null) validate.errors = []
          validate.errors.push(...suberr0.map(e => errorMerge(e, "#/items/$ref", "#/"+i)))
          errorCount++
        }
      }
    }
    if (errorCount === prev1) {
      if (!unique(data)) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/uniqueItems", instanceLocation: "#" })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
const pointerPart = (s) => (/~\\//.test(s) ? \`\${s}\`.replace(/~/g, '~0').replace(/\\//g, '~1') : s);
const ref5 = function validate(data) {
  validate.errors = null
  let errorCount = 0
  if (!(typeof data === "object" && data && !Array.isArray(data))) {
    if (validate.errors === null) validate.errors = []
    validate.errors.push({ keywordLocation: "#/type", instanceLocation: "#" })
    errorCount++
  }
  else {
    if (!("id" in data && hasOwn(data, "id"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/id" })
      errorCount++
    }
    if (!("email" in data && hasOwn(data, "email"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/email" })
      errorCount++
    }
    if (!("age" in data && hasOwn(data, "age"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/age" })
      errorCount++
    }
    if (!("roles" in data && hasOwn(data, "roles"))) {
      if (validate.errors === null) validate.errors = []
      validate.errors.push({ keywordLocation: "#/required", instanceLocation: "#/roles" })
      errorCount++
    }
    if ("id" in data && hasOwn(data, "id")) {
      const err1 = validate.errors
      const res1 = ref0(data.id)
      const suberr1 = ref0.errors
      validate.errors = err1
      if (!res1) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr1.map(e => errorMerge(e, "#/properties/id/$ref", "#/id")))
        errorCount++
      }
    }
    if ("email" in data && hasOwn(data, "email")) {
      const err2 = validate.errors
      const res2 = ref1(data.email)
      const suberr2 = ref1.errors
      validate.errors = err2
      if (!res2) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr2.map(e => errorMerge(e, "#/properties/email/$ref", "#/email")))
        errorCount++
      }
    }
    if ("age" in data && hasOwn(data, "age")) {
      const err3 = validate.errors
      const res3 = ref2(data.age)
      const suberr3 = ref2.errors
      validate.errors = err3
      if (!res3) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr3.map(e => errorMerge(e, "#/properties/age/$ref", "#/age")))
        errorCount++
      }
    }
    if ("roles" in data && hasOwn(data, "roles")) {
      const err4 = validate.errors
      const res4 = ref4(data.roles)
      const suberr4 = ref4.errors
      validate.errors = err4
      if (!res4) {
        if (validate.errors === null) validate.errors = []
        validate.errors.push(...suberr4.map(e => errorMerge(e, "#/properties/roles/$ref", "#/roles")))
        errorCount++
      }
    }
    for (const key0 of Object.keys(data)) {
      if (key0 !== "id" && key0 !== "email" && key0 !== "age" && key0 !== "roles") {
        if (validate.errors === null) validate.errors = []
        validate.errors.push({ keywordLocation: "#/additionalProperties", instanceLocation: "#/"+pointerPart(key0) })
        errorCount++
      }
    }
  }
  return errorCount === 0
};
return ([
  ref0,
  ref1,
  ref2,
  ref3,
  ref4,
  ref5
])})();`},Component:k,meta:{validator:{name:`schemasafe`,draft2020:!1,precompiled:!0},fields:[`multi-enum`],widgets:[`checkboxes`]}};export{A as default};