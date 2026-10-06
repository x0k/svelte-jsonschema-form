import{$ as e,A as t,B as n,C as r,D as i,E as a,G as o,H as s,I as c,K as l,L as u,M as d,N as f,O as p,P as m,Q as h,R as g,S as _,U as v,V as y,W as b,X as x,Y as S,Z as ee,_ as C,at as w,b as T,d as E,et as D,f as O,g as k,h as A,it as j,j as M,k as te,l as N,m as P,nt as ne,ot as F,p as re,q as I,s as L,tt as ie,u as ae,v as R,x as z,z as B}from"./index-client.Bkw0bN1l.js";import{n as oe,t as se}from"./acorn-typescript.CNEuLqoS.js";function V(e,t){return Error(`${t}: ${e}`)}var ce={ON_INPUT:1,ON_CHANGE:2,ON_BLUR:4,ON_ARRAY_CHANGE:8,ON_OBJECT_CHANGE:16,AFTER_CHANGED:32,AFTER_TOUCHED:64,AFTER_SUBMITTED:128},le={typography:{name:`@tailwindcss/typography`,version:`0.5.19`,dev:!0},forms:{name:`@tailwindcss/forms`,version:`0.5.11`,dev:!0}};function H(e){return le[e]}function U(e,t){let n=t.imported??t.name,r=e.body.find(e=>e.type!==`ExportNamedDeclaration`||!e.source?!1:e.specifiers.some(e=>e.type===`ExportSpecifier`&&e.exported.type===`Identifier`&&e.exported.name===t.name));return r||(r={type:`ExportNamedDeclaration`,declaration:null,specifiers:[{type:`ExportSpecifier`,local:{type:`Identifier`,name:n},exported:{type:`Identifier`,name:t.name}}],source:{type:`Literal`,value:t.source},attributes:[]},e.body.push(r),r)}function W(e,t){return e.body.find(e=>{let n=e.type===`ExportNamedDeclaration`&&e.declaration?e.declaration:e;return n.type===`FunctionDeclaration`?n.id.name===t:n.type===`VariableDeclaration`&&n.declarations.some(e=>{if(e.id.type!==`Identifier`||e.id.name!==t)return!1;let n=e.init;return n?n.type===`ArrowFunctionExpression`||n.type===`FunctionExpression`:!1})})}function ue(e,t){let n=t.selector,r=e.children.filter(e=>e.type===`Rule`).find(e=>{let t=e.prelude.children[0].children[0].selectors[0];return t.type===`PseudoClassSelector`&&t.name===n});return r||(r={type:`Rule`,prelude:{type:`SelectorList`,children:[{type:`ComplexSelector`,children:[{type:`RelativeSelector`,selectors:[{type:`PseudoClassSelector`,name:n,args:null,start:0,end:0}],combinator:null,start:0,end:0}],start:0,end:0}],start:0,end:0},block:{type:`Block`,children:[],start:0,end:0},start:0,end:0},e.children.push(r)),r}var de={name_loc:{start:{column:0,line:0},end:{column:0,line:0}},start:0,end:0};function fe(e,t){let n=e.fragment.nodes.findIndex(e=>e.type===`SvelteHead`),r=e.fragment.nodes.splice(n+1);e.fragment.nodes.push({...de,type:`Component`,name:t.wrapper,attributes:t.attributes??[],fragment:{type:`Fragment`,nodes:r}})}function G(e){return Object.entries(ce).filter(([,t])=>e&t).map(([e])=>e)}function pe(e){return(t,n=``)=>e?t:n}function me(e){return e===`$lib`?e=>`$lib/${e}`:e=>`#lib/${e}.js`}function*he(){for(let e of g())a(e)||(yield e,t(e)&&(yield*u(e)));yield`skeleton4`}function K(e){return e}function*ge(){for(let e of S())b(e)||(yield K({name:e,draft2020:!1,precompiled:!1})),v(e)&&(b(e)||(yield K({name:e,draft2020:!0,precompiled:!1})),o(e)&&(yield K({name:e,draft2020:!1,precompiled:!0})))}function _e(e){return!s(e.name)}function ve({validator:e,lib:t,modelName:r}){if(e.precompiled){if(e.name===`hyperjump`){let{imports:e,body:n}=be(t,r);return{canInferFormType:!1,schemaImports:[],imports:e,validatorProp:`validator: createFormValidatorFactory({
  ${n}
})`}}return{canInferFormType:!1,schemaImports:[{as:r,from:t(`${r}/model.generated`)}],imports:[{imports:[`fromValidators`],from:y(`precompile`)},{imports:[`createFormValidatorFactory`],from:I(e.name)},{as:`validateFunctions`,from:t(`${r}/validators.generated`)}],validatorProp:`validator: createFormValidatorFactory({
  validatorRetriever: fromValidators(validateFunctions),
})`}}if(l(e.name)){let i={zod4:{import:{as:`z`,from:`zod`},path:x(`classic`),inferInput:`z.infer`},valibot:{import:{as:`v`,from:`valibot`},path:n(`valibot`).name,inferInput:`v.InferInput`},"standard-schema":{import:{imports:[`StandardSchemaV1`],from:`@standard-schema/spec`,isType:!0},path:y(`standard-schema`),inferInput:`StandardSchemaV1.InferInput`}}[e.name],a=`...adapt(${r}.schema)`;return{schemaImports:[],imports:[{imports:[`adapt`],from:i.path},{as:r,from:t(r)}],validatorProp:a,canInferFormType:!0}}return{canInferFormType:!1,schemaImports:[{as:r,from:t(r)}],imports:[],validatorProp:``}}function q(e,t){return e(`export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ${t}
  });
}`,`/**
 * @template T
 * @param {import("@sjsf/form").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
export const validator = (options) => createFormValidator({
  ...options,
  ${t}
});`)}function ye({validator:e,ts:t}){switch(e.name){case`ajv8`:return{imports:[{imports:[`addFormComponents`,`createFormValidator`],from:n(`ajv8`).name},{imports:[`Ajv2020`],from:`ajv/dist/2020.js`},{from:j(`ajvFormat`).name,as:`addFormats`,isDefault:!0}],code:q(t,`Ajv: Ajv2020, ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))`)};case`cfworker`:return{imports:[{imports:[`createFormValidator`],from:n(`cfworker`).name},{imports:[`Validator`,`type Schema`],from:`@cfworker/json-schema`}],code:q(t,`factory: (schema) => new Validator(schema, "2020-12", false)`)};case`schemasafe`:return{imports:[{imports:[`createFormValidator`,`DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS`],from:n(`schemasafe`).name},{imports:[`validator as safeValidator`,`type Schema`],from:`@exodus/schemasafe`},{imports:[`ROOT_SCHEMA_PREFIX`],from:`@sjsf/form/core`}],code:q(t,`factory: (schema, rootSchema) =>
      safeValidator(schema, {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
        schemas: {
          [ROOT_SCHEMA_PREFIX]: rootSchema,
        },
      })`)};case`ata`:return{imports:[{imports:[`createFormValidator`,`DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS`],from:n(`ata`).name},{imports:[`Validator`],from:`ata-validator`}],code:q(t,`factory: (schema) => new Validator(schema, DEFAULT_ATA_OPTIONS)`)};default:throw V(e.name,`unsupported 2020 validator`)}}function be(e,t){return{imports:[{as:t,from:e(`${t}/model.generated`)},{imports:[`ast`],from:e(`${t}/ast.generated`)},{imports:[`createFormValidatorFactory`,`fromAst`],from:I(`hyperjump`)}],body:`validatorRetriever: fromAst(ast)`}}function xe(e){return e&&`${e},`}function Se({validatorProp:e}){return xe(e)}function Ce({sveltekit:e,sveltekitPackage:t,isTs:n,disabled:r,modelName:i,validator:a,omitExtraData:o}){let s=Se(a),c=n&&!a.canInferFormType,l=c?`<${i}.Model>`:``,u=[],d=[];o&&(u.push({imports:[`withOmitExtraData`],from:y(`omit-extra-data`)}),d.push(`validator: withOmitExtraData(defaults.validator),`));let f=[];d.length>0&&f.push(...d),s.length>0&&f.push(s);let p=f.map(e=>`  ${e}`).join(`
`);if(e===`formActions`)return{formPackageImports:[`BasicForm`],additionalImports:[...a.imports,...u,{imports:[`createMeta`,`setupSvelteKitForm`],from:T(t,`client`)},{imports:[`ActionData`,`PageData`],from:`./$types`,isType:!0}],init:`const meta = createMeta<ActionData, PageData>().postForm;
const { form } = setupSvelteKitForm(meta, {
  ...defaults,
${p}
  onSuccess: (result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  },
})`,attributes:`method="POST"`};if(e===`remoteFunctions`)return{formPackageImports:[`BasicForm`,`createForm`],additionalImports:[...a.imports,...u,...c?a.schemaImports:[],{imports:[`connect`],from:T(t,`rf/client`)},{imports:[`createPost`,`getInitialData`],from:`./data.remote`}],init:`const initialData = await getInitialData();

createPost.enhance(async ({ submit }) => {
  if (await submit()) {
    console.log(createPost.result);
    form.reset();
  }
});

const form = createForm${l}(
  await connect(createPost, {
    ...defaults,
    ...initialData,
${p}
  }),
)`,attributes:``};if(e!==`no`)throw V(e,`unexpected sveltekit integration option`);return{formPackageImports:[`BasicForm`,`createForm`],additionalImports:a.imports.concat(a.schemaImports).concat(u),init:`const form = createForm${l}({
  ...defaults,
  ...${i},
${p}
  onSubmit: console.log,
  ${r===!1?``:`disabled: ${r},\n  `}
})`,attributes:``}}var we=oe.extend(se());function J(e){let t=we.parse(e,{ecmaVersion:`latest`,sourceType:`module`}),n=t.body.findIndex(e=>e.type===`ExportDefaultDeclaration`);if(n===-1)return{code:e,expression:e.trim()};let r=t.body[n],i=e.slice(r.declaration.start,r.declaration.end),a=t.body.filter((e,t)=>t!==n).map(t=>e.slice(t.start,t.end)).join(`
`);return{code:a?`${a}\n`:``,expression:i}}function Te(e,t){switch(t){case`formActions`:return T(e,``);case`remoteFunctions`:return T(e,`rf`);default:return h(`modern`)}}var Y=`// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/`;function Ee({themeOrSubTheme:t,validator:i,icons:a,resolver:o,sveltekit:l,sveltekitPackage:u,widgets:d,fields:p,isTs:m,ts:h,js:g,merger:_,focusOnFirstError:b,themeExtension:x,moduleAugmentation:S,uiOptionsRegistry:w}){return z.script(({ast:T,comments:E,js:O})=>{if(o===`inline`){if(!W(T,`resolver`)){O.imports.addNamed(T,{imports:[`getSimpleSchemaType`,`isFixedItems`],from:ee}),m&&O.imports.addNamed(T,{imports:[`FormState`,`ResolveFieldType`],from:D.name,isType:!0});let e=`${Array.from(R({wrappedFields:!1}),e=>`// import "${C(e,!0)}";`).join(`
`)}\n${Y}\n${h(`export function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`,`/**
 * @template T
 * @param {import("@sjsf/form").FormState<T>} ctx
 * @returns {import("@sjsf/form").ResolveFieldType}
 */
export function resolver(_ctx) {`)}
  return ({ schema }) => {
    if (schema.oneOf !== undefined) {
      return "oneOfField";
    }
    if (schema.anyOf !== undefined) {
      return "anyOfField";
    }
    const type = getSimpleSchemaType(schema);
    if (type === "array") {
      return isFixedItems(schema) ? "tupleField" : "arrayField";
    }
    return \`\${type}Field\`;
  };
}`;O.common.appendFromString(T,{code:e,comments:E})}}else{let e=U(T,{name:`resolver`,source:ie(o)}),t=new Set(p);for(let n of R({wrappedFields:!1}))t.has(n)?O.imports.addEmpty(T,{from:C(n,!0)}):E.add(e,{type:`Line`,value:` import "${C(n,!0)}";`});E.add(e,{type:`Line`,value:Y.slice(2)})}if(U(T,{name:`translation`,source:ne(`en`)}),L(_))U(T,{name:`merger`,imported:`createFormMerger`,source:e(`modern`)});else{O.imports.addNamed(T,{imports:[`createFormMerger`],from:e(`modern`)}),m&&O.imports.addNamed(T,{imports:[`FormMergerOptions`],from:e(`modern`),isType:!0});let t=JSON.stringify(_).slice(1,-1);O.common.appendFromString(T,{code:`${g(`/**
 * @param {import("${e(`modern`)}").FormMergerOptions} options
 * @returns {import("${D.name}").FormMerger}
 */\n`)}export function merger(options${h(`: FormMergerOptions`)}) {
  return createFormMerger({
    ...options,
    ${t},
  });
}`,comments:E})}U(T,{name:`idBuilder`,imported:`createFormIdBuilder`,source:Te(u,l)});let j=B(t),M=c(j).name,N=new Set(d),P;if(x.length>0){O.imports.addNamed(T,{imports:[`extendByRecord`],from:`@sjsf/form/lib/resolver`}),O.imports.addNamed(T,{from:M,imports:{theme:`base`}});for(let e of x)O.imports.addNamed(T,e);let e=x.flatMap(e=>Array.isArray(e.imports)?e.imports:Object.values(e.imports)).join(`, `),t=O.common.parseExpression(`extendByRecord(base, { ${e} })`),n=O.variables.declaration(T,{kind:`const`,name:`theme`,value:t});P=O.exports.createNamed(T,{name:`theme`,fallback:n})}else P=U(T,{name:`theme`,source:M});if(te(j)){let e=f(j);for(let t of k(e))N.has(t)?O.imports.addEmpty(T,{from:A(e,t,!0)}):E.add(P,{type:`Line`,value:` import "${A(e,t,!0)}";`})}for(let e of k(j))N.has(e)?O.imports.addEmpty(T,{from:A(j,e,!0)}):E.add(P,{type:`Line`,value:` import "${A(j,e,!0)}";`});if(a!==`none`&&U(T,{name:`icons`,source:r(a).name}),i.name===`hyperjump`&&(O.imports.addEmpty(T,{from:`@hyperjump/json-schema/formats-lite`}),O.imports.addEmpty(T,{from:`@hyperjump/json-schema/draft-07`})),b){O.imports.addNamed(T,{imports:[`createFocusOnFirstError`],from:`@sjsf/form/focus-on-first-error`});let e=O.common.parseExpression(`createFocusOnFirstError()`),t=O.variables.declaration(T,{kind:`const`,name:`onSubmitError`,value:e});O.exports.createNamed(T,{name:`onSubmitError`,fallback:t})}if(!L(S)){let e=[],t=[];if(S.componentProps!==void 0){e.push(`ComponentProps`);let n=Object.entries(S.componentProps).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface ComponentProps {\n${n}\n}`)}if(S.componentBindings!==void 0){e.push(`ComponentBindings`);let n=Object.entries(S.componentBindings).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface ComponentBindings {\n${n}\n}`)}if(S.uiOptionsRegistry!==void 0){e.push(`UiOptionsRegistry`);let n=Object.entries(S.uiOptionsRegistry).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface UiOptionsRegistry {\n${n}\n}`)}m?(O.imports.addNamed(T,{from:D.name,imports:e,isType:!0}),O.common.appendFromString(T,{code:`declare module "${D.name}" {
  ${t.join(`
  `)}
}`,comments:E})):O.common.appendFromString(T,{code:`/**
 * @typedef {import("${D.name}").${e.join(` & `)}} _ModuleAugmentation
 */`,comments:E})}if(!(W(T,`validator`)||i.precompiled||!(v(i.name)||i.name===`noop`))){if(i.draft2020){let{imports:e,code:t}=ye({validator:i,ts:h});for(let t of e)if(t.isDefault){if(t.as===void 0)continue;O.imports.addDefault(T,{from:t.from,as:t.as})}else O.imports.addNamed(T,{from:t.from,imports:t.imports??[],isType:t.isType});O.common.appendFromString(T,{code:t,comments:E})}else i.name===`ajv8`?(m&&O.imports.addNamed(T,{from:D.name,imports:[`ValidatorFactoryOptions`],isType:!0}),O.imports.addNamed(T,{from:n(i.name).name,imports:[`addFormComponents`,`createFormValidator`]}),O.imports.addDefault(T,{from:`ajv-formats`,as:`addFormats`}),O.common.appendFromString(T,{code:m?`export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });
}`:`/**
 * @template T
 * @param {import("${D.name}").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
export const validator = (options) => createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });`,comments:E})):U(T,{name:`validator`,imported:`createFormValidator`,source:s(i.name)?y(i.name):n(i.name).name});if(!L(w)){let e=[],t=new Set;for(let[n,r]of Object.entries(w))switch(r.kind){case`StringEnumValueMapperBuilder`:t.add(`StringEnumValueMapperBuilder`),e.push(`${n}: () => new StringEnumValueMapperBuilder()`);break;case`IdEnumValueMapperBuilder`:t.add(`IdEnumValueMapperBuilder`),e.push(`${n}: () => new IdEnumValueMapperBuilder()`)}for(let e of t)O.imports.addNamed(T,{from:`${D.name}/options.svelte`,imports:[e]});O.common.appendFromString(T,{code:`export const uiOptionsRegistry = {\n  ${e.join(`,
  `)},\n};`,comments:E})}}})}function De({addDependency:e,themeOrSubTheme:t,validator:a,icons:o,sveltekit:s,sveltekitPackage:l,widgets:u}){function f(t,n=!1){for(let r of w(t,n))e(r)}e(D);let m=B(t),h=c(m);e(h);let g=[];if(u.length>0)for(let e of u)for(let t of P(m,e))g.push(t);else g.push(F(`pikaday`),F(`skeletonSvelte`),F(`internationalizedDate`));if(f(h.dependencies,g),i(t)&&f(M(t)),p(m)){e(j(`tailwindcss4`)),e(j(`tailwindcss4Vite`));for(let t of d(m))e(H(t))}if(a.precompiled||a.draft2020||_e(a)){let t=n(a.name);e(t),f(t.dependencies),a.name===`ajv8`&&(e(j(`ajvFormat`)),a.precompiled&&e(j(`esbuild`))),a.name===`hyperjump`&&e(j(`devalue`))}else a.name===`standard-schema`&&f(D.dependencies,[F(`standardSchemaSpec`)]);if(o!==`none`){let t=r(o);e(t),f(t.dependencies)}(v(a.name)||a.name===`standard-schema`||a.name===`noop`)&&e(j(`jsonSchemaToTs`)),s!==`no`&&(e(l),f(l.dependencies))}var X=[`pico`,`daisyui5`,`flowbite3`,`skeleton5`,`shadcn4`,`shadcn-extras`,`beercss`];function Oe({language:e,validator:t,lib:n,themeOrSubTheme:r,form:i,html5Validation:a}){return z.svelteScript({language:e},({ast:e,js:o,svelte:s})=>{o.imports.addNamed(e.instance.content,{imports:i.formPackageImports,from:D.name});for(let t of i.additionalImports)`as`in t?o.imports.addNamespace(e.instance.content,t):o.imports.addNamed(e.instance.content,t);o.imports.addNamespace(e.instance.content,{as:`defaults`,from:n(`sjsf/defaults`)}),o.common.appendFromString(e.instance.content,{code:i.init}),!a&&t.name!==`noop`&&(i.attributes+=` novalidate`),X.includes(r)&&(i.attributes+=` style="padding: 2rem;"`),s.addFragment(e,`<BasicForm {form} ${i.attributes}/>`)})}function ke({validator:e,isTs:t,schema:n,ts:r,uiSchema:i,initialValue:a,fieldsValidationMode:o}){return z.script(({ast:s,js:c,comments:l})=>{if(v(e.name)||e.name===`noop`){t&&(c.imports.addNamed(s,{isType:!0,imports:[`FromSchema`],from:j(`jsonSchemaToTs`).name}),c.imports.addNamed(s,{isType:!0,imports:[`Schema`],from:D.name}));let e=c.common.parseFromString(`(${n}${r(` as const satisfies Schema`)})`),i=c.variables.declaration(s,{kind:`const`,name:`schema`,value:e});t||c.common.addJsDocTypeComment(i,l,{type:`import(${D.name}).Schema`}),c.exports.createNamed(s,{name:`schema`,fallback:i}),t&&c.common.appendFromString(s,{code:`export type Model = FromSchema<typeof schema>;`})}else if(e.name===`zod4`){let{code:e,expression:r}=J(n);e&&c.common.appendFromString(s,{code:e});let i=c.common.parseExpression(r),a=c.variables.declaration(s,{kind:`const`,name:`schema`,value:i});c.exports.createNamed(s,{name:`schema`,fallback:a}),t&&c.common.appendFromString(s,{code:`export type Model = z.infer<typeof schema>;`})}else if(e.name===`valibot`){let{code:e,expression:r}=J(n);e&&c.common.appendFromString(s,{code:e});let i=c.common.parseExpression(r),a=c.variables.declaration(s,{kind:`const`,name:`schema`,value:i});c.exports.createNamed(s,{name:`schema`,fallback:a}),t&&c.common.appendFromString(s,{code:`export type Model = v.InferInput<typeof schema>;`})}else if(e.name===`standard-schema`)t&&(c.imports.addNamed(s,{isType:!0,imports:[`FromSchema`],from:j(`jsonSchemaToTs`).name}),c.imports.addNamed(s,{isType:!0,imports:[`Schema`],from:D.name}),c.imports.addNamed(s,{imports:[`StandardSchemaV1`,`StandardJSONSchemaV1`],from:`@standard-schema/spec`,isType:!0})),c.common.appendFromString(s,{code:t?`const internalSchema = (${n}) as const satisfies Schema;`:`/** @type {import("${D.name}").Schema} */\nconst internalSchema = (${n});`,comments:l}),t&&c.common.appendFromString(s,{code:`type InternalModel = FromSchema<typeof internalSchema>;`,comments:l}),c.common.appendFromString(s,{code:`// TODO: Replace demo schema with real Standard Schema (arktype, typebox, valibot, zod, etc.)
export const schema${r(`: StandardSchemaV1<InternalModel> & StandardJSONSchemaV1`)} = {
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value) {
      return typeof value === "object" && value !== null
        ? { value${r(`: value as InternalModel`)} }
        : { issues: [{ message: "Invalid", path: [] }] };
    },
    jsonSchema: {
      input: () => internalSchema,
      output() {
        throw new Error("not implemented");
      },
    },
  },
};`,comments:l}),t&&c.common.appendFromString(s,{code:`export type Model = StandardSchemaV1.InferInput<typeof schema>;`,comments:l});else throw V(e.name,`unexpected validator`);if(!L(i)){t&&c.imports.addNamed(s,{isType:!0,imports:[`UiSchemaRoot`],from:D.name});let e=c.common.parseFromString(`(${JSON.stringify(i)}${r(` as const satisfies UiSchemaRoot`)})`),n=c.variables.declaration(s,{kind:`const`,name:`uiSchema`,value:e});c.exports.createNamed(s,{name:`uiSchema`,fallback:n})}if(a!==void 0){let e=c.common.parseFromString(`(${JSON.stringify(a)})`),t=c.variables.declaration(s,{kind:`const`,name:`initialValue`,value:e});c.exports.createNamed(s,{name:`initialValue`,fallback:t})}if(o>0){let e=G(o);c.imports.addNamed(s,{imports:e,from:D.name});let t=c.variables.declaration(s,{kind:`const`,name:`fieldsValidationMode`,value:c.common.parseFromString(e.join(` | `))});c.exports.createNamed(s,{name:`fieldsValidationMode`,fallback:t})}})}function Z(e){let t={ajv8:Ae,schemasafe:je,hyperjump:Q({parallel:!1,vendorImports:e=>{let t=e.validator.draft2020?`@hyperjump/json-schema/draft-2020-12`:`@hyperjump/json-schema/draft-07`;return`import {
  registerSchema,
  unregisterSchema,${e.ts(`
  type SchemaObject,`)}
} from "${t}";
import { ${e.ts(`type AST, `)}getSchema, Validation } from "@hyperjump/json-schema/experimental";
import { uneval } from "${j(`devalue`).name}";`},compileSchemaBody:({ctx:{validator:e,ts:t,language:n},definePatchAndSchemas:r,saveModel:i})=>`let id = 0;
const toId = (n${t(`: number`)}) => \`https://example.com/v\${n}\`;
${r(`createId: () => toId(id++)`)}

for (const schema of schemas) {
  registerSchema(${e.draft2020?`schema${t(` as SchemaObject`)}`:`
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema" },
      schema${t(` as SchemaObject`)}
    )
`});
}

try {
  // https://github.com/hyperjump-io/json-schema/issues/116
  const ast = { metaData: {}, plugins: new Set() }${t(` as unknown as AST`)};
  for (const schema of schemas) {
    const s = await getSchema(schema.$id!);
    await Validation.compile(s, ast, s);
  }
  ${i()};
  await fs.writeFile(
    path.join(modelDir, "ast.generated.${n}"),
    \`// Generated by \${SCRIPT_PATH} - do not edit
${t(`import type { AST } from "@hyperjump/json-schema/experimental";`)}
export const ast = \${uneval(ast)}${t(` as unknown as AST`)};\`
  );
} finally {
  for (const schema of schemas) {
    unregisterSchema(schema.$id${t(`!`)});
  }
}

`}),ata:Me};return z.script(({ast:n,comments:r,js:i})=>{let a=t[e.validator.name](e);i.common.appendFromString(n,{comments:r,code:a})})}function Q({vendorImports:e,compileSchemaBody:t,parallel:n}){return r=>{let{modelPaths:i,ts:a,language:o,fieldsValidationMode:s}=r,c=G(s),l=c.join(`, `),u=c.length>0?`import { ${l} } from "${D.name}";\n\n`:``,d=`import { convert } from "${D.name}/converters/draft-2020-12";\n\n`,f=c.length>0?`import { \${FIELDS_VALIDATION_KEYS} } from "${D.name}";\n`:``,p=c.length>0?`
export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE};
`:``;return`import fs from "node:fs/promises";
import path from "node:path";

${u}${d}import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${y(`precompile`)}";

${e(r)};

${c.length>0?`const FIELDS_VALIDATION = { ${l} };
const FIELDS_VALIDATION_KEYS = Object.keys(FIELDS_VALIDATION).join(", ");
const FIELDS_VALIDATION_MODE = Object.keys(FIELDS_VALIDATION).join(" | ");
const FIELDS_VALIDATION_MODE_VALUE = Object.values(FIELDS_VALIDATION).reduce(
  (a, b) => a | b, 0
);`:`const FIELDS_VALIDATION_MODE_VALUE = 0;`}
const MODEL_PATHS = ${JSON.stringify(i)};
const SCRIPT_PATH = path.relative(process.cwd(), import.meta.filename);

async function readJson(dir${a(`: string`)}, file${a(`: string`)}) {
  const filePath = path.join(dir, file);
  try {
    await fs.access(filePath);
    return JSON.parse(await fs.readFile(filePath, "utf-8"));
  } catch {
    return null;
  }
}

async function compileSchema(modelDirRelPath${a(`: string`)}) {
  const modelDir = path.resolve(modelDirRelPath);
  const schema = await readJson(modelDir, "schema.json");
  if (!schema) {
    throw new Error(\`schema.json file not found in "\${modelDir}" directory\`)
  }
  const uiSchema = await readJson(modelDir, "ui-schema.json");
  const initialValue = await readJson(modelDir, "initial-value.json");

  ${t({ctx:r,definePatchAndSchemas:(e=``)=>`const patch = insertSubSchemaIds(schema.$schema?.startsWith("https://json-schema.org/draft/2020-12/schema") ? convert(schema) : schema, {
  fieldsValidationMode: FIELDS_VALIDATION_MODE_VALUE,
  ${e}
});
const schemas = fragmentSchema(patch)`,saveModel:({importStatements:e=``,exportStatements:t=``}={})=>`// It is easier to save as a TS file
// https://github.com/microsoft/TypeScript/issues/32063
await fs.writeFile(
  path.join(modelDir, "model.generated.${o}"),
  \`// Generated by \${SCRIPT_PATH} - do not edit
${a(`import type { Schema, UiSchemaRoot } from "${D.name}";
import type { FromSchema } from "${j(`jsonSchemaToTs`).name}";
`)}${f}${e}${p}export const schema = \${JSON.stringify(patch.schema, null, 2)}${a(` as const satisfies Schema;
export type Model = FromSchema<typeof schema>`)};
${t}\${uiSchema ? "\\nexport const uiSchema = " + JSON.stringify(uiSchema, null, 2) + "${a(` as const satisfies UiSchemaRoot`)};" : ""}\${initialValue ? "\\nexport const initialValue = " + JSON.stringify(initialValue, null, 2) + ";" : ""}\`
  )`,saveValidators:e=>`await fs.writeFile(path.join(modelDir, "validators.generated.js"), \`// @ts-nocheck\\n\${${e}}\`)`})}
}

async function main() {
  ${n?`await Promise.all(
    MODEL_PATHS.map(compileSchema)
  );`:`for (const p of MODEL_PATHS) {
    await compileSchema(p)
  }`}
}

if (import.meta.main) {
  await main();
}
`}}var Ae=Q({parallel:!0,vendorImports:e=>`import { addFormComponents, DEFAULT_AJV_CONFIG } from "${n(`ajv8`).name}";
${e.validator.draft2020?`import { Ajv2020 } from "ajv/dist/2020.js";`:`import Ajv from "ajv";`}
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "${j(`ajvFormat`).name}";
import { build } from "${j(`esbuild`).name}"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>`${t()};
${n()};

const ajv = new ${e.validator.draft2020?`Ajv2020`:`Ajv`}({
  ...DEFAULT_AJV_CONFIG,
  schemas,
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
${r(`bundle`)};`}),je=Q({parallel:!0,vendorImports:()=>`import { validator } from "@exodus/schemasafe";
import {
  DEFAULT_VALIDATOR_OPTIONS,
  FORM_FORMATS,
} from "${n(`schemasafe`).name}"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>{let i=e.validator.draft2020?`
  $schemaDefault: "https://json-schema.org/draft/2020-12/schema",`:``;return`${t()};
${n()};
// @ts-expect-error Typings for \`multi\` version are missing
const validate = validator(schemas, {
  ...DEFAULT_VALIDATOR_OPTIONS,
  formats: FORM_FORMATS,
  schemas: new Map(schemas.map((schema) => [schema.$id, schema])),
  multi: true,${i}
});

const validateFunctions = \`export const [\${schemas.map((s) => s.$id).join(", ")}] = \${validate.toModule()}\`;

${r(`validateFunctions`)};`}}),Me=Q({parallel:!0,vendorImports:()=>`import { bundleCompact } from "ata-validator/build";
import { DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS } from "${n(`ata`).name}/precompile"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>{let i=e.validator.draft2020?`https://json-schema.org/draft/2020-12/schema`:`http://json-schema.org/draft-07/schema`;return`${t()};
${n()};

const base = { $schema: "${i}" };
const bundle = bundleCompact(
  schemas.map((s) => Object.assign(s, base)),
  DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS
)
  .replace(
    "const validators",
    \`export const [\${schemas.map((s) => s.$id).join(", ")}]\`
  )
  .slice(0, -50);

${r(`bundle`)}
`}}),$=`setShadcnThemeContext`;function Ne({themeOrSubTheme:e,resolveImportPath:t,widgets:n}){return z.script(({ast:r,js:i,comments:a})=>{if(e!==`shadcn4`&&e!==`shadcn-extras`)return!1;let o=e===`shadcn-extras`;i.imports.addNamed(r,{imports:[`setThemeContext`],from:c(`shadcn4`).name});let s=new Map,l=[],u=[],d=new Set,f=new Set(n);function p(e,t,n){let r=s.get(t);r||(r={active:[],commented:[]},s.set(t,r)),n?(r.active.push(e),l.push(e)):(r.commented.push(e),u.push(e))}for(let{folder:e,components:n}of re()){let r=t(e,O);for(let e of n)d.add(e),p(e,r,!0)}for(let e of N()){let n=f.has(e.widget);for(let[r,i]of Object.entries(e.components)){let e=t(r,O),a=Array.isArray(i)?i:Object.values(i);for(let t of a)d.has(t)||(d.add(t),p(t,e,n))}}if(o)for(let e of ae()){let n=f.has(e.widget);for(let[r,i]of Object.entries(e.components)){let e=t(r,E),a=Array.isArray(i)?i:Object.values(i);for(let t of a)d.has(t)||(d.add(t),p(t,e,n))}}for(let[e,{active:t}]of s)t.length>0&&i.imports.addNamed(r,{imports:t,from:e});W(r,$)||i.common.appendFromString(r,{code:`// https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/#components
export function ${$}() {
  setThemeContext({
    components: {
      ${l.join(`, `)}\n${u.map(e=>`// ${e}`).join(`,
`)}
    }
  })
}`,comments:a})})}function Pe({themeOrSubTheme:e,lib:t,instance:n,js:r}){if(e!==`shadcn4`&&e!==`shadcn-extras`)return;r.imports.addNamed(n.content,{imports:[$],from:t(`sjsf/shadcn`)});let i=r.common.parseStatement(`${$}();`);r.common.appendStatement(n.content,{statement:i})}function Fe({nodeModulesPath:e,themeOrSubTheme:t,icons:n,sandbox:r}){return z.css(({ast:i,css:a})=>{let o=Le(i),s=B(t);if(p(s)){let e=Array.from(d(s));for(let t of e){let e=H(t);a.addAtRule(i,{name:`plugin`,params:`'${e.name}'`,append:!1})}a.addAtRule(i,{name:`import`,params:`'tailwindcss'`,append:!1})}let c={nodeModulesPath:e,sandbox:r},l=m(t,c);n!==`none`&&(l=l.concat(_(n,c)));let u=[];for(let e of l)e.name===`import`?u.push(`"${e.params}"`):a.addAtRule(i,{name:e.name,params:`"${e.params}"`,append:!0});if(u.length>0&&a.addImports(i,{imports:u}),o){if(t===`daisyui5`)a.addAtRule(i,{name:`plugin`,params:`"daisyui"`,append:!0});else if(t===`flowbite3`)a.addAtRule(i,{name:`plugin`,params:`"flowbite/plugin"`,append:!0}),a.addAtRule(i,{name:`custom-variant`,params:`dark (&:where(.dark, .dark *))`,append:!0}),a.addAtRule(i,{name:`theme`,params:`{
  --color-primary-50: #fff5f2;
  --color-primary-100: #fff1ee;
  --color-primary-200: #ffe4de;
  --color-primary-300: #ffd5cc;
  --color-primary-400: #ffbcad;
  --color-primary-500: #fe795d;
  --color-primary-600: #ef562f;
  --color-primary-700: #eb4f27;
  --color-primary-800: #cc4522;
  --color-primary-900: #a5371b;

  --color-secondary-50: #f0f9ff;
  --color-secondary-100: #e0f2fe;
  --color-secondary-200: #bae6fd;
  --color-secondary-300: #7dd3fc;
  --color-secondary-400: #38bdf8;
  --color-secondary-500: #0ea5e9;
  --color-secondary-600: #0284c7;
  --color-secondary-700: #0369a1;
  --color-secondary-800: #075985;
  --color-secondary-900: #0c4a6e;
}`,append:!0}),r||a.addAtRule(i,{name:`source`,params:`"${e}/flowbite-svelte/dist"`,append:!0});else if(t===`skeleton5`)a.addAtRule(i,{name:`import`,params:`"@skeletonlabs/skeleton"`,append:!0}),a.addAtRule(i,{name:`import`,params:`"@skeletonlabs/skeleton-svelte"`,append:!0}),a.addAtRule(i,{name:`import`,params:`"@skeletonlabs/skeleton/themes/cerberus"`,append:!0});else if(t.startsWith(`shadcn`)){a.addAtRule(i,{name:`custom-variant`,params:`dark (&:where(.dark *))`,append:!0});let e=ue(i,{selector:`root`});for(let t of[{property:`--radius`,value:`0.625rem`},{property:`--background`,value:`oklch(1 0 0)`},{property:`--foreground`,value:`oklch(0.145 0 0)`},{property:`--card`,value:`oklch(1 0 0)`},{property:`--card-foreground`,value:`oklch(0.145 0 0)`},{property:`--popover`,value:`oklch(1 0 0)`},{property:`--popover-foreground`,value:`oklch(0.145 0 0)`},{property:`--primary`,value:`oklch(0.205 0 0)`},{property:`--primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--secondary`,value:`oklch(0.97 0 0)`},{property:`--secondary-foreground`,value:`oklch(0.205 0 0)`},{property:`--muted`,value:`oklch(0.97 0 0)`},{property:`--muted-foreground`,value:`oklch(0.556 0 0)`},{property:`--accent`,value:`oklch(0.97 0 0)`},{property:`--accent-foreground`,value:`oklch(0.205 0 0)`},{property:`--destructive`,value:`oklch(0.577 0.245 27.325)`},{property:`--border`,value:`oklch(0.922 0 0)`},{property:`--input`,value:`oklch(0.922 0 0)`},{property:`--ring`,value:`oklch(0.708 0 0)`},{property:`--chart-1`,value:`oklch(0.646 0.222 41.116)`},{property:`--chart-2`,value:`oklch(0.6 0.118 184.704)`},{property:`--chart-3`,value:`oklch(0.398 0.07 227.392)`},{property:`--chart-4`,value:`oklch(0.828 0.189 84.429)`},{property:`--chart-5`,value:`oklch(0.769 0.188 70.08)`},{property:`--sidebar`,value:`oklch(0.985 0 0)`},{property:`--sidebar-foreground`,value:`oklch(0.145 0 0)`},{property:`--sidebar-primary`,value:`oklch(0.205 0 0)`},{property:`--sidebar-primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-accent`,value:`oklch(0.97 0 0)`},{property:`--sidebar-accent-foreground`,value:`oklch(0.205 0 0)`},{property:`--sidebar-border`,value:`oklch(0.922 0 0)`},{property:`--sidebar-ring`,value:`oklch(0.708 0 0)`}])a.addDeclaration(e,t);let t=a.addRule(i,{selector:`dark`});for(let e of[{property:`--background`,value:`oklch(0.145 0 0)`},{property:`--foreground`,value:`oklch(0.985 0 0)`},{property:`--card`,value:`oklch(0.205 0 0)`},{property:`--card-foreground`,value:`oklch(0.985 0 0)`},{property:`--popover`,value:`oklch(0.269 0 0)`},{property:`--popover-foreground`,value:`oklch(0.985 0 0)`},{property:`--primary`,value:`oklch(0.922 0 0)`},{property:`--primary-foreground`,value:`oklch(0.205 0 0)`},{property:`--secondary`,value:`oklch(0.269 0 0)`},{property:`--secondary-foreground`,value:`oklch(0.985 0 0)`},{property:`--muted`,value:`oklch(0.269 0 0)`},{property:`--muted-foreground`,value:`oklch(0.708 0 0)`},{property:`--accent`,value:`oklch(0.371 0 0)`},{property:`--accent-foreground`,value:`oklch(0.985 0 0)`},{property:`--destructive`,value:`oklch(0.704 0.191 22.216)`},{property:`--border`,value:`oklch(1 0 0 / 10%)`},{property:`--input`,value:`oklch(1 0 0 / 15%)`},{property:`--ring`,value:`oklch(0.556 0 0)`},{property:`--chart-1`,value:`oklch(0.488 0.243 264.376)`},{property:`--chart-2`,value:`oklch(0.696 0.17 162.48)`},{property:`--chart-3`,value:`oklch(0.769 0.188 70.08)`},{property:`--chart-4`,value:`oklch(0.627 0.265 303.9)`},{property:`--chart-5`,value:`oklch(0.645 0.246 16.439)`},{property:`--sidebar`,value:`oklch(0.205 0 0)`},{property:`--sidebar-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-primary`,value:`oklch(0.488 0.243 264.376)`},{property:`--sidebar-primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-accent`,value:`oklch(0.269 0 0)`},{property:`--sidebar-accent-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-border`,value:`oklch(1 0 0 / 10%)`},{property:`--sidebar-ring`,value:`oklch(0.439 0 0)`}])a.addDeclaration(t,e);a.addAtRule(i,{name:`theme`,params:`inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}`,append:!0}),a.addAtRule(i,{name:`layer`,params:`base {
  * {
    @apply border-border outline-ring/50;
  }
 
  body {
    @apply bg-background text-foreground;
  }
}`,append:!0})}}})}var Ie=[{name:`import`,params:`tailwindcss`},{name:`plugin`,params:`@tailwindcss/forms`},{name:`plugin`,params:`@tailwindcss/typography`}];function Le(e){for(let t of e.children)if(t.type!==`Atrule`||Ie.findIndex(e=>e.name===t.name&&t.prelude.includes(e.params))<0)return!1;return!0}function Re({svelteVersion:e=`5`,language:t,stylesheetPath:n,lib:r,isKit:i,themeOrSubTheme:a}){return z.svelteScript({language:t},t=>{let{ast:o,svelte:s,js:c}=t;n&&c.imports.addEmpty(o.instance.content,{from:n}),Pe({themeOrSubTheme:a,instance:o.instance,js:c,lib:r}),i&&o.fragment.nodes.length===0&&s.addSlot(o,{svelteVersion:e}),a===`svar`?(c.imports.addNamed(o.instance.content,{imports:[`Willow`],from:`@svar-ui/svelte-core`}),fe(o,{wrapper:`Willow`})):a===`beercss`&&c.imports.addEmpty(o.instance.content,{from:`beercss/dist/cdn/beer.css`})})}var ze=new Set([`@sjsf/form`,`svelte`,`tailwind-merge`]);function Be({themeOrSubTheme:e,icons:t,sveltekit:n,sveltekitPackage:i}){return z.script(({ast:a,js:o,comments:s})=>{let l=B(e),u=o.vite.getConfig(a);p(l)&&(o.imports.addDefault(a,{as:`tailwindcss`,from:`@tailwindcss/vite`}),o.vite.addPlugin(a,{code:`tailwindcss()`,mode:`append`}));let d=new Set;if(t&&t!==`none`)for(let e of r(t).dependencies)ze.has(e.name)||d.add(e.name);if(c(l).dependencies.some(e=>e.name===`@lucide/svelte`)&&d.add(`@lucide/svelte`),d.size>0){let e=o.vite.configProperty(a,u,{name:`ssr`,fallback:o.object.create({})}),t=o.object.property(e,{name:`noExternal`,fallback:o.array.create()});for(let e of d)o.array.append(t,e)}if(n===`remoteFunctions`){let e=o.vite.configProperty(a,u,{name:`optimizeDeps`,fallback:o.object.create({})}),t=o.object.property(e,{name:`exclude`,fallback:o.array.create()});s.add(t,{type:`Line`,value:` https://github.com/sveltejs/kit/issues/14788`}),o.array.append(t,`@sjsf/form`),o.array.append(t,T(i,`rf/client`))}})}export{Z as a,Oe as c,Ce as d,ve as f,pe as g,me as h,Ne as i,De as l,ge as m,Re as n,ke as o,he as p,Fe as r,X as s,Be as t,Ee as u};