import{r as e}from"./rolldown-runtime.DAXXjFlN.js";import"./index-client.DAEmVQx2.js";import{$t as t,At as n,Qt as r,an as i,at as a,et as o,jt as s,kt as c,st as l,wt as u}from"./client.B0k3dZbu.js";import{a as d,d as f}from"./playground.81JXgRlA.js";import{X as p,i as m,u as h}from"./form.B8CJIVHV.js";import{a as g,i as _}from"./demo.BFc_HmCR.js";import{t as v}from"./input-schema.D8cf2JKT.js";import{t as y}from"./precompile.DBVjTwM1.js";var b={title:`User`,type:`object`,required:[`id`,`email`,`age`,`roles`],properties:{id:{type:`integer`,minimum:1,$id:`v1`},email:{type:`string`,format:`email`,$id:`v2`},age:{type:`integer`,minimum:21,maximum:100,$id:`v3`},roles:{type:`array`,items:{type:`string`,enum:[`admin`,`editor`,`viewer`],$id:`v5`},uniqueItems:!0,minItems:1,$id:`v4`}},additionalProperties:!1,$id:`v0`},x=e({v0:()=>A,v1:()=>T,v2:()=>E,v3:()=>D,v4:()=>k,v5:()=>O}),S=Object.freeze({valid:!0,errors:Object.freeze([])}),C=[function(e,t){return function(n){return!Number.isInteger(n)||n<1?t(n):e}},function(e,t){return function(n){if(typeof n!=`string`)return t(n);{let e=n.indexOf(`@`);if(e<=0||e>=n.length-1||n.indexOf(`.`,e)<=e+1)return t(n)}return e}},function(e,t){return function(n){return!Number.isInteger(n)||n<21||n>100?t(n):e}},function(e,t){return function(n){return typeof n!=`string`||!(n===`admin`||n===`editor`||n===`viewer`)?t(n):e}},function(e,t){return function(n){if(!Array.isArray(n)||n.length<1)return t(n);{let e=function(t){return typeof t!=`object`||!t?typeof t+`:`+t:Array.isArray(t)?`[`+t.map(e).join(`,`)+`]`:`{`+Object.keys(t).sort().map(function(n){return JSON.stringify(n)+`:`+e(t[n])}).join(`,`)+`}`},r=new Set;for(let i=0;i<n.length;i++){let a=e(n[i]);if(r.has(a))return t(n);r.add(a)}}for(let e=0;e<n.length;e++){let r=n[e];if(typeof r!=`string`||!(r===`admin`||r===`editor`||r===`viewer`))return t(n)}return e}},function(e,t){return function(n){if(typeof n!=`object`||!n||Array.isArray(n)||n.id===void 0||n.email===void 0||n.age===void 0||n.roles===void 0||!Number.isInteger(n.id)||n.id<1||typeof n.email!=`string`)return t(n);{let e=n.email.indexOf(`@`);if(e<=0||e>=n.email.length-1||n.email.indexOf(`.`,e)<=e+1)return t(n)}if(!Number.isInteger(n.age)||n.age<21||n.age>100||!Array.isArray(n.roles)||n.roles.length<1)return t(n);{let e=function(t){return typeof t!=`object`||!t?typeof t+`:`+t:Array.isArray(t)?`[`+t.map(e).join(`,`)+`]`:`{`+Object.keys(t).sort().map(function(n){return JSON.stringify(n)+`:`+e(t[n])}).join(`,`)+`}`},r=new Set;for(let i=0;i<n.roles.length;i++){let a=e(n.roles[i]);if(r.has(a))return t(n);r.add(a)}}for(let e=0;e<n.roles.length;e++){let r=n.roles[e];if(typeof r!=`string`||!(r===`admin`||r===`editor`||r===`viewer`))return t(n)}var r=0;for(var i in n)r++;return r===4?e:t(n)}}],w=[function(e){var t=!0;let n=[];return!Number.isInteger(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`number`&&e<1&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:``,schemaPath:`#/minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];if(typeof e!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t))return{valid:!1,errors:n};if(typeof e==`string`){let r=e.indexOf(`@`);if((r<=0||r>=e.length-1||e.indexOf(`.`,r)<=r+1)&&(n.push({code:`ATA3001`,keyword:`format`,instancePath:``,schemaPath:`#/format`,params:{format:`email`},message:`must match format "email"`,docUrl:`https://ata-validator.com/e/ATA3001`}),!t))return{valid:!1,errors:n}}return{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];return!Number.isInteger(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`number`&&e<21&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:``,schemaPath:`#/minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)||typeof e==`number`&&e>100&&(n.push({code:`ATA2004`,keyword:`maximum`,instancePath:``,schemaPath:`#/maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,docUrl:`https://ata-validator.com/e/ATA2004`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];return typeof e!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||!(e===`admin`||e===`editor`||e===`viewer`)&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:``,schemaPath:`#/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t)?{valid:!1,errors:n}:{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];if(!Array.isArray(e)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`array`},message:`must be array`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||Array.isArray(e)&&e.length<1&&(n.push({code:`ATA2008`,keyword:`minItems`,instancePath:``,schemaPath:`#/minItems`,params:{limit:1},message:`must NOT have fewer than 1 items`,docUrl:`https://ata-validator.com/e/ATA2008`}),!t))return{valid:!1,errors:n};if(Array.isArray(e)){let r=function(e){return typeof e!=`object`||!e?typeof e+`:`+e:Array.isArray(e)?`[`+e.map(r).join(`,`)+`]`:`{`+Object.keys(e).sort().map(function(t){return JSON.stringify(t)+`:`+r(e[t])}).join(`,`)+`}`},i=new Map;for(let a=0;a<e.length;a++){let o=r(e[a]),s=i.get(o);if(s!==void 0){if(n.push({code:`ATA2012`,keyword:`uniqueItems`,instancePath:``,schemaPath:`#/uniqueItems`,params:{i:s,j:a},message:`must NOT have duplicate items (items ## `+a+` and `+s+` are identical)`,docUrl:`https://ata-validator.com/e/ATA2012`}),!t)return{valid:!1,errors:n};break}i.set(o,a)}}if(Array.isArray(e))for(let r=0;r<e.length;r++){let i=e[r];if(typeof i!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/`+r,schemaPath:`#/items/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||!(i===`admin`||i===`editor`||i===`viewer`)&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:`/`+r,schemaPath:`#/items/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t))return{valid:!1,errors:n}}return{valid:n.length===0,errors:n}},function(e){var t=!0;let n=[];if(!(typeof e==`object`&&e&&!Array.isArray(e))&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:``,schemaPath:`#/type`,params:{type:`object`},message:`must be object`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&!(`id`in e)&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`id`},message:`must have required property 'id'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&!(`email`in e)&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`email`},message:`must have required property 'email'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&!(`age`in e)&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`age`},message:`must have required property 'age'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t)||typeof e==`object`&&e&&!Array.isArray(e)&&!(`roles`in e)&&(n.push({code:`ATA7001`,keyword:`required`,instancePath:``,schemaPath:`#/required`,params:{missingProperty:`roles`},message:`must have required property 'roles'`,docUrl:`https://ata-validator.com/e/ATA7001`}),!t))return{valid:!1,errors:n};if(typeof e==`object`&&e&&!Array.isArray(e)){let r=Object.keys(e),i=new Set([`id`,`email`,`age`,`roles`]);for(let e=0;e<r.length;e++)if(!i.has(r[e])&&(n.push({code:`ATA7002`,keyword:`additionalProperties`,instancePath:``,schemaPath:`#/additionalProperties`,params:{additionalProperty:r[e]},message:`must NOT have additional properties`,docUrl:`https://ata-validator.com/e/ATA7002`}),!t))return{valid:!1,errors:n}}if(typeof e==`object`&&e&&!Array.isArray(e)&&`id`in e&&(!Number.isInteger(e.id)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/id`,schemaPath:`#/properties/id/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e.id==`number`&&e.id<1&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:`/id`,schemaPath:`#/properties/id/minimum`,params:{comparison:`>=`,limit:1},message:`must be >= 1`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)))return{valid:!1,errors:n};if(typeof e==`object`&&e&&!Array.isArray(e)&&`email`in e){if(typeof e.email!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/email`,schemaPath:`#/properties/email/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t))return{valid:!1,errors:n};if(typeof e.email==`string`){let r=e.email.indexOf(`@`);if((r<=0||r>=e.email.length-1||e.email.indexOf(`.`,r)<=r+1)&&(n.push({code:`ATA3001`,keyword:`format`,instancePath:`/email`,schemaPath:`#/properties/email/format`,params:{format:`email`},message:`must match format "email"`,docUrl:`https://ata-validator.com/e/ATA3001`}),!t))return{valid:!1,errors:n}}}if(typeof e==`object`&&e&&!Array.isArray(e)&&`age`in e&&(!Number.isInteger(e.age)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/age`,schemaPath:`#/properties/age/type`,params:{type:`integer`},message:`must be integer`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||typeof e.age==`number`&&e.age<21&&(n.push({code:`ATA2003`,keyword:`minimum`,instancePath:`/age`,schemaPath:`#/properties/age/minimum`,params:{comparison:`>=`,limit:21},message:`must be >= 21`,docUrl:`https://ata-validator.com/e/ATA2003`}),!t)||typeof e.age==`number`&&e.age>100&&(n.push({code:`ATA2004`,keyword:`maximum`,instancePath:`/age`,schemaPath:`#/properties/age/maximum`,params:{comparison:`<=`,limit:100},message:`must be <= 100`,docUrl:`https://ata-validator.com/e/ATA2004`}),!t)))return{valid:!1,errors:n};if(typeof e==`object`&&e&&!Array.isArray(e)&&`roles`in e){if(!Array.isArray(e.roles)&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/roles`,schemaPath:`#/properties/roles/type`,params:{type:`array`},message:`must be array`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||Array.isArray(e.roles)&&e.roles.length<1&&(n.push({code:`ATA2008`,keyword:`minItems`,instancePath:`/roles`,schemaPath:`#/properties/roles/minItems`,params:{limit:1},message:`must NOT have fewer than 1 items`,docUrl:`https://ata-validator.com/e/ATA2008`}),!t))return{valid:!1,errors:n};if(Array.isArray(e.roles)){let r=function(e){return typeof e!=`object`||!e?typeof e+`:`+e:Array.isArray(e)?`[`+e.map(r).join(`,`)+`]`:`{`+Object.keys(e).sort().map(function(t){return JSON.stringify(t)+`:`+r(e[t])}).join(`,`)+`}`},i=new Map;for(let a=0;a<e.roles.length;a++){let o=r(e.roles[a]),s=i.get(o);if(s!==void 0){if(n.push({code:`ATA2012`,keyword:`uniqueItems`,instancePath:`/roles`,schemaPath:`#/properties/roles/uniqueItems`,params:{i:s,j:a},message:`must NOT have duplicate items (items ## `+a+` and `+s+` are identical)`,docUrl:`https://ata-validator.com/e/ATA2012`}),!t)return{valid:!1,errors:n};break}i.set(o,a)}}if(Array.isArray(e.roles))for(let r=0;r<e.roles.length;r++){let i=e.roles[r];if(typeof i!=`string`&&(n.push({code:`ATA1001`,keyword:`type`,instancePath:`/roles/`+r,schemaPath:`#/properties/roles/items/type`,params:{type:`string`},message:`must be string`,docUrl:`https://ata-validator.com/e/ATA1001`}),!t)||!(i===`admin`||i===`editor`||i===`viewer`)&&(n.push({code:`ATA6001`,keyword:`enum`,instancePath:`/roles/`+r,schemaPath:`#/properties/roles/items/enum`,params:{allowedValues:[`admin`,`editor`,`viewer`]},message:`must be equal to one of the allowed values`,docUrl:`https://ata-validator.com/e/ATA6001`}),!t))return{valid:!1,errors:n}}}return{valid:n.length===0,errors:n}}],[T,E,D,O,k,A]=[C[0](S,w[0]),C[1](S,w[1]),C[2](S,w[2]),C[3](S,w[3]),C[4](S,w[4]),C[5](S,w[5])],j=l(`<!> <pre> </pre>`,1);function M(e,l){t(l,!0);let{defaults:_}=g(),v=h({..._,schema:b,validator:y({validatorRetriever:f(x)}),fieldsValidationMode:11,resolver:d});var S=j(),C=n(S);m(C,{get form(){return v},novalidate:!0});var w=s(C,2),T=c(w,!0);i(w),u(e=>o(T,e),[()=>JSON.stringify(p(v),null,2)]),a(e,S),r()}var N={files:{"src/routes/+page.svelte":_(`<script lang="ts">
  import { createFormValidatorFactory } from "@sjsf-lab/ata-validator/precompile";
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

import { DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS } from "@sjsf-lab/ata-validator/precompile";
import { ON_ARRAY_CHANGE, ON_CHANGE, ON_INPUT } from "@sjsf/form";
import {
  insertSubSchemaIds,
  fragmentSchema,
} from "@sjsf/form/validators/precompile";
import { bundleCompact } from "ata-validator/build";

import inputSchema from "../input-schema.json" with { type: "json" };

const fieldsValidationMode = ON_INPUT | ON_CHANGE | ON_ARRAY_CHANGE;

// NOTE: After calling this function, be sure to save the \`schema\` and
// use it to generate the form
const patch = insertSubSchemaIds(inputSchema as any, {
  fieldsValidationMode,
});

// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
fs.writeFileSync(
  path.join(import.meta.dirname, "patched-schema.ts"),
  \`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = \${fieldsValidationMode}
export const schema = \${JSON.stringify(patch.schema, null, 2)} as const satisfies Schema;\`
);

const base = { $schema: "http://json-schema.org/draft-07/schema" };
const schemas = fragmentSchema(patch);
const bundle = bundleCompact(
  schemas.map((s) => Object.assign(s, base)),
  DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS
)
  .replace(
    "const validators",
    \`export const [\${schemas.map((s) => s.$id).join(", ")}]\`
  )
  .slice(0, -50);

fs.writeFileSync(
  path.join(import.meta.dirname, "validate-functions.js"),
  bundle
);
`,"src/input-schema.json":v,"src/routes/patched-schema.ts":`import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 11;
export const schema = {
  title: "User",
  type: "object",
  required: ["id", "email", "age", "roles"],
  properties: {
    id: {
      type: "integer",
      minimum: 1,
      $id: "v1",
    },
    email: {
      type: "string",
      format: "email",
      $id: "v2",
    },
    age: {
      type: "integer",
      minimum: 21,
      maximum: 100,
      $id: "v3",
    },
    roles: {
      type: "array",
      items: {
        type: "string",
        enum: ["admin", "editor", "viewer"],
        $id: "v5",
      },
      uniqueItems: true,
      minItems: 1,
      $id: "v4",
    },
  },
  additionalProperties: false,
  $id: "v0",
} as const satisfies Schema;
`,"src/routes/validate-functions.js":`// Auto-generated by ata-validator — do not edit
const R = Object.freeze({ valid: true, errors: Object.freeze([]) });
const H = [
  function (R, E) {
    return function (d) {
      if (!Number.isInteger(d)) return E(d);
      if (d < 1) return E(d);
      return R;
    };
  },
  function (R, E) {
    return function (d) {
      if (typeof d !== "string") return E(d);
      {
        const _at = d.indexOf("@");
        if (_at <= 0 || _at >= d.length - 1 || d.indexOf(".", _at) <= _at + 1)
          return E(d);
      }
      return R;
    };
  },
  function (R, E) {
    return function (d) {
      if (!Number.isInteger(d)) return E(d);
      if (d < 21) return E(d);
      if (d > 100) return E(d);
      return R;
    };
  },
  function (R, E) {
    return function (d) {
      if (typeof d !== "string") return E(d);
      if (!(d === "admin" || d === "editor" || d === "viewer")) return E(d);
      return R;
    };
  },
  function (R, E) {
    return function (d) {
      if (!Array.isArray(d)) return E(d);
      if (d.length < 1) return E(d);
      {
        const _cn0 = function (x) {
          if (x === null || typeof x !== "object") return typeof x + ":" + x;
          if (Array.isArray(x)) return "[" + x.map(_cn0).join(",") + "]";
          return (
            "{" +
            Object.keys(x)
              .sort()
              .map(function (k) {
                return JSON.stringify(k) + ":" + _cn0(x[k]);
              })
              .join(",") +
            "}"
          );
        };
        const _s0 = new Set();
        for (let _i = 0; _i < d.length; _i++) {
          const _k = _cn0(d[_i]);
          if (_s0.has(_k)) return E(d);
          _s0.add(_k);
        }
      }
      for (let _j1 = 0; _j1 < d.length; _j1++) {
        const _e1 = d[_j1];
        if (typeof _e1 !== "string") return E(d);
        if (!(_e1 === "admin" || _e1 === "editor" || _e1 === "viewer"))
          return E(d);
      }
      return R;
    };
  },
  function (R, E) {
    return function (d) {
      if (typeof d !== "object" || d === null || Array.isArray(d)) return E(d);
      if (
        d["id"] === undefined ||
        d["email"] === undefined ||
        d["age"] === undefined ||
        d["roles"] === undefined
      )
        return E(d);
      if (!Number.isInteger(d["id"])) return E(d);
      if (d["id"] < 1) return E(d);
      if (typeof d["email"] !== "string") return E(d);
      {
        const _at = d["email"].indexOf("@");
        if (
          _at <= 0 ||
          _at >= d["email"].length - 1 ||
          d["email"].indexOf(".", _at) <= _at + 1
        )
          return E(d);
      }
      if (!Number.isInteger(d["age"])) return E(d);
      if (d["age"] < 21) return E(d);
      if (d["age"] > 100) return E(d);
      if (!Array.isArray(d["roles"])) return E(d);
      if (d["roles"].length < 1) return E(d);
      {
        const _cn0 = function (x) {
          if (x === null || typeof x !== "object") return typeof x + ":" + x;
          if (Array.isArray(x)) return "[" + x.map(_cn0).join(",") + "]";
          return (
            "{" +
            Object.keys(x)
              .sort()
              .map(function (k) {
                return JSON.stringify(k) + ":" + _cn0(x[k]);
              })
              .join(",") +
            "}"
          );
        };
        const _s0 = new Set();
        for (let _i = 0; _i < d["roles"].length; _i++) {
          const _k = _cn0(d["roles"][_i]);
          if (_s0.has(_k)) return E(d);
          _s0.add(_k);
        }
      }
      for (let _j1 = 0; _j1 < d["roles"].length; _j1++) {
        const _e1 = d["roles"][_j1];
        if (typeof _e1 !== "string") return E(d);
        if (!(_e1 === "admin" || _e1 === "editor" || _e1 === "viewer"))
          return E(d);
      }
      var _n = 0;
      for (var _k in d) _n++;
      if (_n !== 4) return E(d);
      return R;
    };
  },
];
const EF = [
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!Number.isInteger(d)) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "integer" },
        message: "must be integer",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (typeof d === "number" && d < 1) {
      _e.push({
        code: "ATA2003",
        keyword: "minimum",
        instancePath: "",
        schemaPath: "#/minimum",
        params: { comparison: ">=", limit: 1 },
        message: "must be >= 1",
        docUrl: "https://ata-validator.com/e/ATA2003",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    return { valid: _e.length === 0, errors: _e };
  },
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!(typeof d === "string")) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "string" },
        message: "must be string",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (typeof d === "string") {
      const _at = d.indexOf("@");
      if (_at <= 0 || _at >= d.length - 1 || d.indexOf(".", _at) <= _at + 1) {
        _e.push({
          code: "ATA3001",
          keyword: "format",
          instancePath: "",
          schemaPath: "#/format",
          params: { format: "email" },
          message: 'must match format "email"',
          docUrl: "https://ata-validator.com/e/ATA3001",
        });
        if (!_all) return { valid: false, errors: _e };
      }
    }
    return { valid: _e.length === 0, errors: _e };
  },
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!Number.isInteger(d)) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "integer" },
        message: "must be integer",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (typeof d === "number" && d < 21) {
      _e.push({
        code: "ATA2003",
        keyword: "minimum",
        instancePath: "",
        schemaPath: "#/minimum",
        params: { comparison: ">=", limit: 21 },
        message: "must be >= 21",
        docUrl: "https://ata-validator.com/e/ATA2003",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (typeof d === "number" && d > 100) {
      _e.push({
        code: "ATA2004",
        keyword: "maximum",
        instancePath: "",
        schemaPath: "#/maximum",
        params: { comparison: "<=", limit: 100 },
        message: "must be <= 100",
        docUrl: "https://ata-validator.com/e/ATA2004",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    return { valid: _e.length === 0, errors: _e };
  },
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!(typeof d === "string")) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "string" },
        message: "must be string",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (!(d === "admin" || d === "editor" || d === "viewer")) {
      _e.push({
        code: "ATA6001",
        keyword: "enum",
        instancePath: "",
        schemaPath: "#/enum",
        params: { allowedValues: ["admin", "editor", "viewer"] },
        message: "must be equal to one of the allowed values",
        docUrl: "https://ata-validator.com/e/ATA6001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    return { valid: _e.length === 0, errors: _e };
  },
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!Array.isArray(d)) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "array" },
        message: "must be array",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (Array.isArray(d) && d.length < 1) {
      _e.push({
        code: "ATA2008",
        keyword: "minItems",
        instancePath: "",
        schemaPath: "#/minItems",
        params: { limit: 1 },
        message: "must NOT have fewer than 1 items",
        docUrl: "https://ata-validator.com/e/ATA2008",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (Array.isArray(d)) {
      const _cn0 = function (x) {
        if (x === null || typeof x !== "object") return typeof x + ":" + x;
        if (Array.isArray(x)) return "[" + x.map(_cn0).join(",") + "]";
        return (
          "{" +
          Object.keys(x)
            .sort()
            .map(function (k) {
              return JSON.stringify(k) + ":" + _cn0(x[k]);
            })
            .join(",") +
          "}"
        );
      };
      const _s0 = new Map();
      for (let _i = 0; _i < d.length; _i++) {
        const _k = _cn0(d[_i]);
        const _prev = _s0.get(_k);
        if (_prev !== undefined) {
          _e.push({
            code: "ATA2012",
            keyword: "uniqueItems",
            instancePath: "",
            schemaPath: "#/uniqueItems",
            params: { i: _prev, j: _i },
            message:
              "must NOT have duplicate items (items ## " +
              _i +
              " and " +
              _prev +
              " are identical)",
            docUrl: "https://ata-validator.com/e/ATA2012",
          });
          if (!_all) return { valid: false, errors: _e };
          break;
        }
        _s0.set(_k, _i);
      }
    }
    if (Array.isArray(d)) {
      for (let _j1 = 0; _j1 < d.length; _j1++) {
        const _ei1 = d[_j1];
        if (!(typeof _ei1 === "string")) {
          _e.push({
            code: "ATA1001",
            keyword: "type",
            instancePath: "/" + _j1,
            schemaPath: "#/items/type",
            params: { type: "string" },
            message: "must be string",
            docUrl: "https://ata-validator.com/e/ATA1001",
          });
          if (!_all) return { valid: false, errors: _e };
        }
        if (!(_ei1 === "admin" || _ei1 === "editor" || _ei1 === "viewer")) {
          _e.push({
            code: "ATA6001",
            keyword: "enum",
            instancePath: "/" + _j1,
            schemaPath: "#/items/enum",
            params: { allowedValues: ["admin", "editor", "viewer"] },
            message: "must be equal to one of the allowed values",
            docUrl: "https://ata-validator.com/e/ATA6001",
          });
          if (!_all) return { valid: false, errors: _e };
        }
      }
    }
    return { valid: _e.length === 0, errors: _e };
  },
  function (d) {
    var _all = true;
    const _e = [];
    const _cpLen = (s) => {
      let n = 0;
      for (const _ of s) n++;
      return n;
    };
    if (!(typeof d === "object" && d !== null && !Array.isArray(d))) {
      _e.push({
        code: "ATA1001",
        keyword: "type",
        instancePath: "",
        schemaPath: "#/type",
        params: { type: "object" },
        message: "must be object",
        docUrl: "https://ata-validator.com/e/ATA1001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      !("id" in d)
    ) {
      _e.push({
        code: "ATA7001",
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "id" },
        message: "must have required property 'id'",
        docUrl: "https://ata-validator.com/e/ATA7001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      !("email" in d)
    ) {
      _e.push({
        code: "ATA7001",
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "email" },
        message: "must have required property 'email'",
        docUrl: "https://ata-validator.com/e/ATA7001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      !("age" in d)
    ) {
      _e.push({
        code: "ATA7001",
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "age" },
        message: "must have required property 'age'",
        docUrl: "https://ata-validator.com/e/ATA7001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      !("roles" in d)
    ) {
      _e.push({
        code: "ATA7001",
        keyword: "required",
        instancePath: "",
        schemaPath: "#/required",
        params: { missingProperty: "roles" },
        message: "must have required property 'roles'",
        docUrl: "https://ata-validator.com/e/ATA7001",
      });
      if (!_all) return { valid: false, errors: _e };
    }
    if (typeof d === "object" && d !== null && !Array.isArray(d)) {
      const _k0 = Object.keys(d);
      const _a0 = new Set(["id", "email", "age", "roles"]);
      for (let _i = 0; _i < _k0.length; _i++) {
        if (!_a0.has(_k0[_i])) {
          _e.push({
            code: "ATA7002",
            keyword: "additionalProperties",
            instancePath: "",
            schemaPath: "#/additionalProperties",
            params: { additionalProperty: _k0[_i] },
            message: "must NOT have additional properties",
            docUrl: "https://ata-validator.com/e/ATA7002",
          });
          if (!_all) return { valid: false, errors: _e };
        }
      }
    }
    if (typeof d === "object" && d !== null && !Array.isArray(d) && "id" in d) {
      if (!Number.isInteger(d["id"])) {
        _e.push({
          code: "ATA1001",
          keyword: "type",
          instancePath: "/id",
          schemaPath: "#/properties/id/type",
          params: { type: "integer" },
          message: "must be integer",
          docUrl: "https://ata-validator.com/e/ATA1001",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d["id"] === "number" && d["id"] < 1) {
        _e.push({
          code: "ATA2003",
          keyword: "minimum",
          instancePath: "/id",
          schemaPath: "#/properties/id/minimum",
          params: { comparison: ">=", limit: 1 },
          message: "must be >= 1",
          docUrl: "https://ata-validator.com/e/ATA2003",
        });
        if (!_all) return { valid: false, errors: _e };
      }
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      "email" in d
    ) {
      if (!(typeof d["email"] === "string")) {
        _e.push({
          code: "ATA1001",
          keyword: "type",
          instancePath: "/email",
          schemaPath: "#/properties/email/type",
          params: { type: "string" },
          message: "must be string",
          docUrl: "https://ata-validator.com/e/ATA1001",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d["email"] === "string") {
        const _at = d["email"].indexOf("@");
        if (
          _at <= 0 ||
          _at >= d["email"].length - 1 ||
          d["email"].indexOf(".", _at) <= _at + 1
        ) {
          _e.push({
            code: "ATA3001",
            keyword: "format",
            instancePath: "/email",
            schemaPath: "#/properties/email/format",
            params: { format: "email" },
            message: 'must match format "email"',
            docUrl: "https://ata-validator.com/e/ATA3001",
          });
          if (!_all) return { valid: false, errors: _e };
        }
      }
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      "age" in d
    ) {
      if (!Number.isInteger(d["age"])) {
        _e.push({
          code: "ATA1001",
          keyword: "type",
          instancePath: "/age",
          schemaPath: "#/properties/age/type",
          params: { type: "integer" },
          message: "must be integer",
          docUrl: "https://ata-validator.com/e/ATA1001",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d["age"] === "number" && d["age"] < 21) {
        _e.push({
          code: "ATA2003",
          keyword: "minimum",
          instancePath: "/age",
          schemaPath: "#/properties/age/minimum",
          params: { comparison: ">=", limit: 21 },
          message: "must be >= 21",
          docUrl: "https://ata-validator.com/e/ATA2003",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (typeof d["age"] === "number" && d["age"] > 100) {
        _e.push({
          code: "ATA2004",
          keyword: "maximum",
          instancePath: "/age",
          schemaPath: "#/properties/age/maximum",
          params: { comparison: "<=", limit: 100 },
          message: "must be <= 100",
          docUrl: "https://ata-validator.com/e/ATA2004",
        });
        if (!_all) return { valid: false, errors: _e };
      }
    }
    if (
      typeof d === "object" &&
      d !== null &&
      !Array.isArray(d) &&
      "roles" in d
    ) {
      if (!Array.isArray(d["roles"])) {
        _e.push({
          code: "ATA1001",
          keyword: "type",
          instancePath: "/roles",
          schemaPath: "#/properties/roles/type",
          params: { type: "array" },
          message: "must be array",
          docUrl: "https://ata-validator.com/e/ATA1001",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (Array.isArray(d["roles"]) && d["roles"].length < 1) {
        _e.push({
          code: "ATA2008",
          keyword: "minItems",
          instancePath: "/roles",
          schemaPath: "#/properties/roles/minItems",
          params: { limit: 1 },
          message: "must NOT have fewer than 1 items",
          docUrl: "https://ata-validator.com/e/ATA2008",
        });
        if (!_all) return { valid: false, errors: _e };
      }
      if (Array.isArray(d["roles"])) {
        const _cn2 = function (x) {
          if (x === null || typeof x !== "object") return typeof x + ":" + x;
          if (Array.isArray(x)) return "[" + x.map(_cn2).join(",") + "]";
          return (
            "{" +
            Object.keys(x)
              .sort()
              .map(function (k) {
                return JSON.stringify(k) + ":" + _cn2(x[k]);
              })
              .join(",") +
            "}"
          );
        };
        const _s2 = new Map();
        for (let _i = 0; _i < d["roles"].length; _i++) {
          const _k = _cn2(d["roles"][_i]);
          const _prev = _s2.get(_k);
          if (_prev !== undefined) {
            _e.push({
              code: "ATA2012",
              keyword: "uniqueItems",
              instancePath: "/roles",
              schemaPath: "#/properties/roles/uniqueItems",
              params: { i: _prev, j: _i },
              message:
                "must NOT have duplicate items (items ## " +
                _i +
                " and " +
                _prev +
                " are identical)",
              docUrl: "https://ata-validator.com/e/ATA2012",
            });
            if (!_all) return { valid: false, errors: _e };
            break;
          }
          _s2.set(_k, _i);
        }
      }
      if (Array.isArray(d["roles"])) {
        for (let _j3 = 0; _j3 < d["roles"].length; _j3++) {
          const _ei3 = d["roles"][_j3];
          if (!(typeof _ei3 === "string")) {
            _e.push({
              code: "ATA1001",
              keyword: "type",
              instancePath: "/roles" + "/" + _j3,
              schemaPath: "#/properties/roles/items/type",
              params: { type: "string" },
              message: "must be string",
              docUrl: "https://ata-validator.com/e/ATA1001",
            });
            if (!_all) return { valid: false, errors: _e };
          }
          if (!(_ei3 === "admin" || _ei3 === "editor" || _ei3 === "viewer")) {
            _e.push({
              code: "ATA6001",
              keyword: "enum",
              instancePath: "/roles" + "/" + _j3,
              schemaPath: "#/properties/roles/items/enum",
              params: { allowedValues: ["admin", "editor", "viewer"] },
              message: "must be equal to one of the allowed values",
              docUrl: "https://ata-validator.com/e/ATA6001",
            });
            if (!_all) return { valid: false, errors: _e };
          }
        }
      }
    }
    return { valid: _e.length === 0, errors: _e };
  },
];
export const [v1, v2, v3, v5, v4, v0] = [
  H[0](R, EF[0]),
  H[1](R, EF[1]),
  H[2](R, EF[2]),
  H[3](R, EF[3]),
  H[4](R, EF[4]),
  H[5](R, EF[5]),
];
`},Component:M,meta:{validator:{name:`ata`,draft2020:!1,precompiled:!0},fields:[`multi-enum`],widgets:[`checkboxes`]}};export{N as default};