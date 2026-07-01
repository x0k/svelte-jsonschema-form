import{n as e}from"./schema-transform.BNDWTQ3M.js";var t=(e,t)=>e.anyOf.length?e.anyOf.length===1?D(e.anyOf[0],{...t,path:[...t.path,`anyOf`,0]}):`z.union([${e.anyOf.map((e,n)=>D(e,{...t,path:[...t.path,`anyOf`,n]})).join(`, `)}])`:`z.any()`,n=e=>`z.boolean()`,r=e=>`z.any()`,i=(e,t)=>`z.union([${e.type.map(n=>D({...e,type:n},{...t,withoutDefaults:!0})).join(`, `)}])`,a=(e,t)=>`z.any().refine((value) => !${D(e.not,{...t,path:[...t.path,`not`]})}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`,o=e=>`z.null()`,s=e=>[e.slice(0,e.length/2),e.slice(e.length/2)],c=Symbol(`Original index`),l=e=>{let t=[];for(let n=0;n<e.length;n++){let r=e[n];if(typeof r==`boolean`)t.push(r?{[c]:n}:{[c]:n,not:{}});else if(c in r)return e;else t.push({...r,[c]:n})}return t};function u(e,t){if(e.allOf.length===0)return`z.never()`;if(e.allOf.length===1){let n=e.allOf[0];return D(n,{...t,path:[...t.path,`allOf`,n[c]]})}else{let[n,r]=s(l(e.allOf));return`z.intersection(${u({allOf:n},t)}, ${u({allOf:r},t)})`}}function d(e,t,n,r){let i=e[t],a=``;if(i!==void 0){let o=n({value:i,json:JSON.stringify(i)});if(o){let n=o[0],i=o.length===3?o[1]:``,s=o.length===3?o[2]:o[1];a+=n;let c=e.errorMessage?.[t]??r;c!==void 0&&(a+=i+JSON.stringify(c)),a+=s}}return a}var f=(e,t)=>{if(Array.isArray(e.items))return`z.tuple([${e.items.map((e,n)=>D(e,{...t,path:[...t.path,`items`,n]}))}])`;let n=e.items?`z.array(${D(e.items,{...t,path:[...t.path,`items`]})})`:`z.array(z.any())`;return n+=d(e,`minItems`,({json:e})=>[`.min(${e}`,`, `,`)`]),n+=d(e,`maxItems`,({json:e})=>[`.max(${e}`,`, `,`)`]),e.uniqueItems===!0&&(n+=d(e,`uniqueItems`,()=>[`.refine((arr) => arr.every((item, i) => arr.indexOf(item) == i)`,`, `,`)`],`All items must be unique!`)),n},p=e=>`z.literal(${JSON.stringify(e.const)})`,m=e=>e.enum.length===0?`z.never()`:e.enum.length===1?`z.literal(${JSON.stringify(e.enum[0])})`:e.enum.every(e=>typeof e==`string`)?`z.enum([${e.enum.map(e=>JSON.stringify(e))}])`:`z.union([${e.enum.map(e=>`z.literal(${JSON.stringify(e)})`).join(`, `)}])`,h=(e,t)=>{let n=D(e.if,{...t,path:[...t.path,`if`]}),r=D(e.then,{...t,path:[...t.path,`then`]}),i=D(e.else,{...t,path:[...t.path,`else`]});return`z.union([${r}, ${i}]).superRefine((value,ctx) => {
  const result = ${n}.safeParse(value).success
    ? ${r}.safeParse(value)
    : ${i}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`},g=e=>{let t=`z.number()`;return e.type===`integer`?t+=d(e,`type`,()=>[`.int(`,`)`]):t+=d(e,`format`,({value:e})=>{if(e===`int64`)return[`.int(`,`)`]}),t+=d(e,`multipleOf`,({value:e,json:n})=>e===1?t.startsWith(`z.number().int(`)?void 0:[`.int(`,`)`]:[`.multipleOf(${n}`,`, `,`)`]),typeof e.minimum==`number`?e.exclusiveMinimum===!0?t+=d(e,`minimum`,({json:e})=>[`.gt(${e}`,`, `,`)`]):t+=d(e,`minimum`,({json:e})=>[`.gte(${e}`,`, `,`)`]):typeof e.exclusiveMinimum==`number`&&(t+=d(e,`exclusiveMinimum`,({json:e})=>[`.gt(${e}`,`, `,`)`])),typeof e.maximum==`number`?e.exclusiveMaximum===!0?t+=d(e,`maximum`,({json:e})=>[`.lt(${e}`,`, `,`)`]):t+=d(e,`maximum`,({json:e})=>[`.lte(${e}`,`, `,`)`]):typeof e.exclusiveMaximum==`number`&&(t+=d(e,`exclusiveMaximum`,({json:e})=>[`.lt(${e}`,`, `,`)`])),t},_=(e,t)=>{let n=t.zodVersion===3;return e.oneOf.length?e.oneOf.length===1?D(e.oneOf[0],{...t,path:[...t.path,`oneOf`,0]}):`z.any().superRefine((x, ctx) => {
    const schemas = [${e.oneOf.map((e,n)=>D(e,{...t,path:[...t.path,`oneOf`,n]})).join(`, `)}];
    const { errors, failed } = schemas.reduce<{
      errors: z.${n?`ZodError`:`core.$ZodIssue`}[];
      failed: number;
    }>(
      ({ errors, failed }, schema) =>
        ((result) =>
          result.error
            ? {
                errors: [...errors, ${n?`result.error`:`...result.error.issues`}],
                failed: failed + 1,
              }
            : { errors, failed })(
          schema.safeParse(x),
        ),
      { errors: [], failed: 0 },
    );
    const passed = schemas.length - failed;
    if (passed !== 1) {
      ctx.addIssue(errors.length ? {
        path: ${n?`ctx.path`:`[]`},
        code: "invalid_union",
        ${n?`unionErrors: errors`:`errors: [errors]`},
        message: "Invalid input: Should pass single schema. Passed " + passed,
      } : {
        path: ${n?`ctx.path`:`[]`},
        code: "custom",${n?``:`
        errors: [errors],`}
        message: "Invalid input: Should pass single schema. Passed " + passed,
      });
    }
  })`:`z.any()`},v=e=>{let t=e.split(`
`);return`/**${t.length===1?t[0]:`\n${t.map(e=>`* ${e}`).join(`
`)}\n`}*/\n`},y=(e,t)=>{let n=e.description;return n?`\n${v(n)}${t}`:t};function b(e,t){return t.zodVersion===3?`z.record(${e})`:`z.record(z.string(), ${e})`}function x(e){return e.zodVersion===3?`path: [...ctx.path, key]`:`path: [key]`}function S(e,n){let r;e.properties&&(Object.keys(e.properties).length?(r=`z.object({ `,r+=Object.keys(e.properties).map(t=>{let r=e.properties[t],i=`${JSON.stringify(t)}: ${D(r,{...n,path:[...n.path,`properties`,t]})}`;n.withJsdocs&&typeof r==`object`&&(i=y(r,i));let a=typeof r==`object`&&r.default!==void 0,o=Array.isArray(e.required)?e.required.includes(t):typeof r==`object`&&r.required===!0;return!a&&!o?`${i}.optional()`:i}).join(`, `),r+=` })`):r=`z.object({})`);let i=e.additionalProperties===void 0?void 0:D(e.additionalProperties,{...n,path:[...n.path,`additionalProperties`]}),a;if(e.patternProperties){let t=Object.fromEntries(Object.entries(e.patternProperties).map(([e,t])=>[e,D(t,{...n,path:[...n.path,`patternProperties`,e]})],{}));a=``,r?i?a+=`.catchall(z.union([${[...Object.values(t),i].join(`, `)}]))`:Object.keys(t).length>1?a+=`.catchall(z.union([${Object.values(t).join(`, `)}]))`:a+=`.catchall(${Object.values(t)})`:i?a+=b(`z.union([${[...Object.values(t),i].join(`, `)}])`,n):Object.keys(t).length>1?a+=b(`z.union([${Object.values(t).join(`, `)}])`,n):a+=b(`${Object.values(t)}`,n),a+=`.superRefine((value, ctx) => {
`,a+=`for (const key in value) {
`,i&&(e.properties?a+=`let evaluated = [${Object.keys(e.properties).map(e=>JSON.stringify(e)).join(`, `)}].includes(key)\n`:a+=`let evaluated = false
`);for(let r in e.patternProperties)a+=`if (key.match(new RegExp(`+JSON.stringify(r)+`))) {
`,i&&(a+=`evaluated = true
`),a+=`const result = `+t[r]+`.safeParse(value[key])
`,a+=`if (!result.success) {
`,a+=`ctx.addIssue({
          ${x(n)},
          code: 'custom',
          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`,a+=`}
`,a+=`}
`;i&&(a+=`if (!evaluated) {
`,a+=`const result = `+i+`.safeParse(value[key])
`,a+=`if (!result.success) {
`,a+=`ctx.addIssue({
          ${x(n)},
          code: 'custom',
          message: \`Invalid input: must match catchall schema\`,
          params: {
            issues: result.error.issues
          }
        })\n`,a+=`}
`,a+=`}
`),a+=`}
`,a+=`})`}let o=r?a?r+a:i?i===`z.never()`?r+`.strict()`:r+`.catchall(${i})`:r:a||b(i||`z.any()`,n);return M.an.anyOf(e)&&(o+=`.and(${t({...e,anyOf:e.anyOf.map(e=>typeof e==`object`&&!e.type&&(e.properties||e.additionalProperties||e.patternProperties)?{...e,type:`object`}:e)},n)})`),M.a.oneOf(e)&&(o+=`.and(${_({...e,oneOf:e.oneOf.map(e=>typeof e==`object`&&!e.type&&(e.properties||e.additionalProperties||e.patternProperties)?{...e,type:`object`}:e)},n)})`),M.an.allOf(e)&&(o+=`.and(${u({...e,allOf:e.allOf.map(e=>typeof e==`object`&&!e.type&&(e.properties||e.additionalProperties||e.patternProperties)?{...e,type:`object`}:e)},n)})`),o}var C=e=>{let t=`z.string()`;t+=d(e,`format`,({value:e})=>{switch(e){case`email`:return[`.email(`,`)`];case`ip`:return[`.ip(`,`)`];case`ipv4`:return[`.ip({ version: "v4"`,`, message: `,` })`];case`ipv6`:return[`.ip({ version: "v6"`,`, message: `,` })`];case`uri`:return[`.url(`,`)`];case`uuid`:return[`.uuid(`,`)`];case`date-time`:return[`.datetime({ offset: true`,`, message: `,` })`];case`time`:return[`.time(`,`)`];case`date`:return[`.date(`,`)`];case`binary`:return[`.base64(`,`)`];case`duration`:return[`.duration(`,`)`]}}),t+=d(e,`pattern`,({json:e})=>[`.regex(new RegExp(${e})`,`, `,`)`]),t+=d(e,`minLength`,({json:e})=>[`.min(${e}`,`, `,`)`]),t+=d(e,`maxLength`,({json:e})=>[`.max(${e}`,`, `,`)`]),t+=d(e,`contentEncoding`,({value:e})=>{if(e===`base64`)return[`.base64(`,`)`]});let n=d(e,`contentMediaType`,({value:e})=>{if(e===`application/json`)return[`.transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}`,`, `,`)`]});return n!=``&&(t+=n,t+=d(e,`contentSchema`,({value:e})=>{if(e&&e instanceof Object)return[`.pipe(${D(e)}`,`, `,`)`]})),t},w=(e,t)=>e.oneOf.length?e.oneOf.length===1?D(e.oneOf[0],{...t,path:[...t.path,`oneOf`,0]}):`z.discriminatedUnion("${e.discriminator.propertyName}", [${e.oneOf.map((e,n)=>D(e,{...t,path:[...t.path,`oneOf`,n]})).join(`, `)}])`:`z.any()`,T=(e,...t)=>Object.keys(e).reduce((n,r)=>(t.includes(r)||(n[r]=e[r]),n),{}),E=(e,t)=>`${D(T(e,`nullable`),t,!0)}.nullable()`,D=(e,t={seen:new Map,path:[]},n)=>{if(typeof e!=`object`)return e?`z.any()`:`z.never()`;if(t.parserOverride){let n=t.parserOverride(e,t);if(typeof n==`string`)return n}let r=t.seen.get(e);if(r){if(r.r!==void 0)return r.r;if(t.depth===void 0||r.n>=t.depth)return`z.any()`;r.n+=1}else r={r:void 0,n:0},t.seen.set(e,r);let i=j(e,t);return n||(t.withoutDescribes||(i=O(e,i)),t.withoutDefaults||(i=k(e,i)),i=A(e,i)),r.r=i,i},O=(e,t)=>(e.description&&(t+=`.describe(${JSON.stringify(e.description)})`),t),k=(e,t)=>(e.default!==void 0&&(t+=`.default(${JSON.stringify(e.default)})`),t),A=(e,t)=>(e.readOnly&&(t+=`.readonly()`),t),j=(e,s)=>M.a.nullable(e)?E(e,s):M.an.object(e)?S(e,s):M.an.array(e)?f(e,s):M.an.anyOf(e)?t(e,s):M.an.allOf(e)?u(e,s):M.a.simpleDiscriminatedOneOf(e)?w(e,s):M.a.oneOf(e)?_(e,s):M.a.not(e)?a(e,s):M.an.enum(e)?m(e):M.a.const(e)?p(e):M.a.multipleType(e)?i(e,s):M.a.primitive(e,`string`)?C(e):M.a.primitive(e,`number`)||M.a.primitive(e,`integer`)?g(e):M.a.primitive(e,`boolean`)?n(e):M.a.primitive(e,`null`)?o(e):M.a.conditional(e)?h(e,s):r(e),M={an:{object:e=>e.type===`object`,array:e=>e.type===`array`,anyOf:e=>e.anyOf!==void 0,allOf:e=>e.allOf!==void 0,enum:e=>e.enum!==void 0},a:{nullable:e=>e.nullable===!0,multipleType:e=>Array.isArray(e.type),not:e=>e.not!==void 0,const:e=>e.const!==void 0,primitive:(e,t)=>e.type===t,conditional:e=>!!(`if`in e&&e.if&&`then`in e&&`else`in e&&e.then&&e.else),simpleDiscriminatedOneOf:e=>{if(!e.oneOf||!Array.isArray(e.oneOf)||e.oneOf.length===0||!e.discriminator||typeof e.discriminator!=`object`||!(`propertyName`in e.discriminator)||typeof e.discriminator.propertyName!=`string`)return!1;let t=e.discriminator.propertyName;return e.oneOf.every(e=>{if(!e||typeof e!=`object`||e.type!==`object`||!e.properties||typeof e.properties!=`object`||!(t in e.properties))return!1;let n=e.properties[t];return n&&typeof n==`object`&&n.type===`string`&&(n.const!==void 0||n.enum&&Array.isArray(n.enum)&&n.enum.length===1)&&Array.isArray(e.required)&&e.required.includes(t)})},oneOf:e=>e.oneOf!==void 0}},N=(e,{module:t,name:n,type:r,noImport:i,zodVersion:a=4,...o}={})=>{if(r&&(!n||t!==`esm`))throw Error("Option `type` requires `name` to be set and `module` to be `esm`");let s=D(e,{module:t,name:n,path:[],seen:new Map,zodVersion:a,...o}),c=o.withJsdocs&&typeof e!=`boolean`&&e.description?v(e.description):``;if(t===`cjs`?(s=`${c}module.exports = ${n?`{ ${JSON.stringify(n)}: ${s} }`:s}
`,i||(s=`${c}const { z } = require("zod")

${s}`)):t===`esm`?(s=`${c}export ${n?`const ${n} =`:`default`} ${s}
`,i||(s=`import { z } from "zod"

${s}`)):n&&(s=`${c}const ${n} = ${s}`),r&&n){let e=typeof r==`string`?r:`${n[0].toUpperCase()}${n.substring(1)}`;s+=`export type ${e} = z.infer<typeof ${n}>
`}return s},P=e({additionalImports:`import * as z from "zod"; import { adapt } from "@sjsf/zod4-validator/classic";`,createSchemaCode:e=>N(e,{noImport:!0})});export{P as default};