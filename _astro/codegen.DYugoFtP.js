import{$ as e,A as t,B as n,C as r,F as i,G as a,H as o,I as s,J as c,K as l,M as u,N as d,O as f,P as p,Q as m,R as h,S as g,T as _,U as v,V as y,W as b,Y as x,Z as S,_ as C,b as w,c as T,ct as E,d as D,et as O,f as k,g as A,h as j,it as M,j as ee,k as N,m as P,nt as F,ot as I,p as te,q as ne,rt as re,st as L,tt as R,v as z,w as ie,y as B,z as ae}from"./index-client.Cj_4OtE4.js";import{n as oe,t as se}from"./acorn-typescript.BXlCKlrM.js";function V(e,t){return Error(`${t}: ${e}`)}var ce={ON_INPUT:1,ON_CHANGE:2,ON_BLUR:4,ON_ARRAY_CHANGE:8,ON_OBJECT_CHANGE:16,AFTER_CHANGED:32,AFTER_TOUCHED:64,AFTER_SUBMITTED:128},le={typography:{name:`@tailwindcss/typography`,version:`0.5.19`,dev:!0},forms:{name:`@tailwindcss/forms`,version:`0.5.11`,dev:!0}};function H(e){return le[e]}function U(e,t){let n=t.imported??t.name,r=e.body.find(e=>e.type!==`ExportNamedDeclaration`||!e.source?!1:e.specifiers.some(e=>e.type===`ExportSpecifier`&&e.exported.type===`Identifier`&&e.exported.name===t.name));return r||(r={type:`ExportNamedDeclaration`,declaration:null,specifiers:[{type:`ExportSpecifier`,local:{type:`Identifier`,name:n},exported:{type:`Identifier`,name:t.name}}],source:{type:`Literal`,value:t.source},attributes:[]},e.body.push(r),r)}function W(e,t){return e.body.find(e=>{let n=e.type===`ExportNamedDeclaration`&&e.declaration?e.declaration:e;return n.type===`FunctionDeclaration`?n.id.name===t:n.type===`VariableDeclaration`&&n.declarations.some(e=>{if(e.id.type!==`Identifier`||e.id.name!==t)return!1;let n=e.init;return n?n.type===`ArrowFunctionExpression`||n.type===`FunctionExpression`:!1})})}function ue(e,t){let n=t.selector,r=e.children.filter(e=>e.type===`Rule`).find(e=>{let t=e.prelude.children[0].children[0].selectors[0];return t.type===`PseudoClassSelector`&&t.name===n});return r||(r={type:`Rule`,prelude:{type:`SelectorList`,children:[{type:`ComplexSelector`,children:[{type:`RelativeSelector`,selectors:[{type:`PseudoClassSelector`,name:n,args:null,start:0,end:0}],combinator:null,start:0,end:0}],start:0,end:0}],start:0,end:0},block:{type:`Block`,children:[],start:0,end:0},start:0,end:0},e.children.push(r)),r}var de={name_loc:{start:{column:0,line:0},end:{column:0,line:0}},start:0,end:0};function fe(e,t){let n=e.fragment.nodes.findIndex(e=>e.type===`SvelteHead`),r=e.fragment.nodes.splice(n+1);e.fragment.nodes.push({...de,type:`Component`,name:t.wrapper,attributes:t.attributes??[],fragment:{type:`Fragment`,nodes:r}})}function G(e){return Object.entries(ce).filter(([,t])=>e&t).map(([e])=>e)}function pe(e){return(t,n=``)=>e?t:n}function me(e){return e===`$lib`?e=>`$lib/${e}`:e=>`#lib/${e}.js`}function*he(){for(let e of n())f(e)||(yield e,u(e)&&(yield*ae(e)));yield`skeleton4`}function K(e){return e}function*ge(){for(let e of S())l(e)||(yield K({name:e,draft2020:!1,precompiled:!1})),a(e)&&(l(e)||(yield K({name:e,draft2020:!0,precompiled:!1})),ne(e)&&(yield K({name:e,draft2020:!1,precompiled:!0})))}function _e(e){return!b(e.name)}function ve({validator:e,lib:t,modelName:n}){if(e.precompiled){if(e.name===`hyperjump`){let{imports:e,body:r}=be(t,n);return{canInferFormType:!1,schemaImports:[],imports:e,validatorProp:`validator: createFormValidatorFactory({
  ${r}
})`}}return{canInferFormType:!1,schemaImports:[{as:n,from:t(`${n}/model.generated`)}],imports:[{imports:[`fromValidators`],from:v(`precompile`)},{imports:[`createFormValidatorFactory`],from:x(e.name)},{as:`validateFunctions`,from:t(`${n}/validators.generated`)}],validatorProp:`validator: createFormValidatorFactory({
  validatorRetriever: fromValidators(validateFunctions),
})`}}if(c(e.name)){let r={zod4:{import:{as:`z`,from:`zod`},path:m(`classic`),inferInput:`z.infer`},valibot:{import:{as:`v`,from:`valibot`},path:o(`valibot`).name,inferInput:`v.InferInput`},"standard-schema":{import:{imports:[`StandardSchemaV1`],from:`@standard-schema/spec`,isType:!0},path:v(`standard-schema`),inferInput:`StandardSchemaV1.InferInput`}}[e.name],i=`...adapt(${n}.schema)`;return{schemaImports:[],imports:[{imports:[`adapt`],from:r.path},{as:n,from:t(n)}],validatorProp:i,canInferFormType:!0}}return{canInferFormType:!1,schemaImports:[{as:n,from:t(n)}],imports:[],validatorProp:``}}function q(e,t){return e(`export function validator<T>(options: ValidatorFactoryOptions) {
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
});`)}function ye({validator:e,ts:t}){switch(e.name){case`ajv8`:return{imports:[{imports:[`addFormComponents`,`createFormValidator`],from:o(`ajv8`).name},{imports:[`Ajv2020`],from:`ajv/dist/2020.js`},{from:I(`ajvFormat`).name,as:`addFormats`,isDefault:!0}],code:q(t,`Ajv: Ajv2020, ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))`)};case`cfworker`:return{imports:[{imports:[`createFormValidator`],from:o(`cfworker`).name},{imports:[`Validator`,`type Schema`],from:`@cfworker/json-schema`}],code:q(t,`factory: (schema) => new Validator(schema, "2020-12", false)`)};case`schemasafe`:return{imports:[{imports:[`createFormValidator`,`DEFAULT_VALIDATOR_OPTIONS as DEFAULT_SCHEMASAFE_OPTIONS`],from:o(`schemasafe`).name},{imports:[`validator as safeValidator`,`type Schema`],from:`@exodus/schemasafe`},{imports:[`ROOT_SCHEMA_PREFIX`],from:`@sjsf/form/core`}],code:q(t,`factory: (schema, rootSchema) =>
      safeValidator(schema, {
        ...DEFAULT_SCHEMASAFE_OPTIONS,
        $schemaDefault: "https://json-schema.org/draft/2020-12/schema",
        schemas: {
          [ROOT_SCHEMA_PREFIX]: rootSchema,
        },
      })`)};case`ata`:return{imports:[{imports:[`createFormValidator`,`DEFAULT_VALIDATOR_OPTIONS as DEFAULT_ATA_OPTIONS`],from:o(`ata`).name},{imports:[`Validator`],from:`ata-validator`}],code:q(t,`factory: (schema) => new Validator(schema, DEFAULT_ATA_OPTIONS)`)};default:throw V(e.name,`unsupported 2020 validator`)}}function be(e,t){return{imports:[{as:t,from:e(`${t}/model.generated`)},{imports:[`fromValidators`],from:v(`precompile`)},{imports:[`createFormValidatorFactory`],from:x(`hyperjump`)},{imports:[`validators`],from:e(`${t}/validators.generated`)}],body:`validatorRetriever: fromValidators(validators)`}}function xe(e){return e&&`${e},`}function Se({validatorProp:e}){return xe(e)}function Ce({sveltekit:e,sveltekitPackage:t,isTs:n,disabled:r,modelName:i,validator:a,omitExtraData:o}){let s=Se(a),c=n&&!a.canInferFormType,l=c?`<${i}.Model>`:``,u=[],d=[];o&&(u.push({imports:[`withOmitExtraData`],from:v(`omit-extra-data`)}),d.push(`validator: withOmitExtraData(defaults.validator),`));let f=[];d.length>0&&f.push(...d),s.length>0&&f.push(s);let p=f.map(e=>`  ${e}`).join(`
`);if(e===`formActions`)return{formPackageImports:[`BasicForm`],additionalImports:[...a.imports,...u,{imports:[`createMeta`,`setupSvelteKitForm`],from:g(t,`client`)},{imports:[`ActionData`,`PageData`],from:`./$types`,isType:!0}],init:`const meta = createMeta<ActionData, PageData>().postForm;
const { form } = setupSvelteKitForm(meta, {
  ...defaults,
${p}
  onSuccess: (result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  },
})`,attributes:`method="POST"`};if(e===`remoteFunctions`)return{formPackageImports:[`BasicForm`,`createForm`],additionalImports:[...a.imports,...u,...c?a.schemaImports:[],{imports:[`connect`],from:g(t,`rf/client`)},{imports:[`createPost`,`getInitialData`],from:`./data.remote`}],init:`const initialData = await getInitialData();

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
`);return{code:a?`${a}\n`:``,expression:i}}function Te(e,t){switch(t){case`formActions`:return g(e,``);case`remoteFunctions`:return g(e,`rf`);default:return O(`modern`)}}var Y=`// https://x0k.dev/svelte-jsonschema-form/guides/fields-resolution/`;function Ee({themeOrSubTheme:t,validator:n,icons:s,resolver:c,sveltekit:l,sveltekitPackage:u,widgets:d,fields:f,isTs:p,ts:m,js:g,merger:x,focusOnFirstError:S,themeExtension:E,moduleAugmentation:D,uiOptionsRegistry:O}){return r.script(({ast:r,comments:k,js:A})=>{if(c===`inline`){if(!W(r,`resolver`)){A.imports.addNamed(r,{imports:[`getSimpleSchemaType`,`isFixedItems`],from:e}),p&&A.imports.addNamed(r,{imports:[`FormState`,`ResolveFieldType`],from:F.name,isType:!0});let t=`${Array.from(w({wrappedFields:!1}),e=>`// import "${B(e,!0)}";`).join(`
`)}\n${Y}\n${m(`export function resolver<T>(_ctx: FormState<T>): ResolveFieldType {`,`/**
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
}`;A.common.appendFromString(r,{code:t,comments:k})}}else{let e=U(r,{name:`resolver`,source:re(c)}),t=new Set(f);for(let n of w({wrappedFields:!1}))t.has(n)?A.imports.addEmpty(r,{from:B(n,!0)}):k.add(e,{type:`Line`,value:` import "${B(n,!0)}";`});k.add(e,{type:`Line`,value:Y.slice(2)})}if(U(r,{name:`translation`,source:M(`en`)}),T(x))U(r,{name:`merger`,imported:`createFormMerger`,source:R(`modern`)});else{A.imports.addNamed(r,{imports:[`createFormMerger`],from:R(`modern`)}),p&&A.imports.addNamed(r,{imports:[`FormMergerOptions`],from:R(`modern`),isType:!0});let e=JSON.stringify(x).slice(1,-1);A.common.appendFromString(r,{code:`${g(`/**
 * @param {import("${R(`modern`)}").FormMergerOptions} options
 * @returns {import("${F.name}").FormMerger}
 */\n`)}export function merger(options${m(`: FormMergerOptions`)}) {
  return createFormMerger({
    ...options,
    ${e},
  });
}`,comments:k})}U(r,{name:`idBuilder`,imported:`createFormIdBuilder`,source:Te(u,l)});let j=y(t),N=h(j).name,P=new Set(d),I;if(E.length>0){A.imports.addNamed(r,{imports:[`extendByRecord`],from:`@sjsf/form/lib/resolver`}),A.imports.addNamed(r,{from:N,imports:{theme:`base`}});for(let e of E)A.imports.addNamed(r,e);let e=E.flatMap(e=>Array.isArray(e.imports)?e.imports:Object.values(e.imports)).join(`, `),t=A.common.parseExpression(`extendByRecord(base, { ${e} })`),n=A.variables.declaration(r,{kind:`const`,name:`theme`,value:t});I=A.exports.createNamed(r,{name:`theme`,fallback:n})}else I=U(r,{name:`theme`,source:N});if(ee(j)){let e=i(j);for(let t of z(e))P.has(t)?A.imports.addEmpty(r,{from:C(e,t,!0)}):k.add(I,{type:`Line`,value:` import "${C(e,t,!0)}";`})}for(let e of z(j))P.has(e)?A.imports.addEmpty(r,{from:C(j,e,!0)}):k.add(I,{type:`Line`,value:` import "${C(j,e,!0)}";`});if(s!==`none`&&U(r,{name:`icons`,source:_(s).name}),n.name===`hyperjump`&&(A.imports.addEmpty(r,{from:`@hyperjump/json-schema/formats-lite`}),A.imports.addEmpty(r,{from:`@hyperjump/json-schema/draft-07`})),S){A.imports.addNamed(r,{imports:[`createFocusOnFirstError`],from:`@sjsf/form/focus-on-first-error`});let e=A.common.parseExpression(`createFocusOnFirstError()`),t=A.variables.declaration(r,{kind:`const`,name:`onSubmitError`,value:e});A.exports.createNamed(r,{name:`onSubmitError`,fallback:t})}if(!T(D)){let e=[],t=[];if(D.componentProps!==void 0){e.push(`ComponentProps`);let n=Object.entries(D.componentProps).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface ComponentProps {\n${n}\n}`)}if(D.componentBindings!==void 0){e.push(`ComponentBindings`);let n=Object.entries(D.componentBindings).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface ComponentBindings {\n${n}\n}`)}if(D.uiOptionsRegistry!==void 0){e.push(`UiOptionsRegistry`);let n=Object.entries(D.uiOptionsRegistry).map(([e,t])=>`  ${e}: ${t};`).join(`
`);t.push(`interface UiOptionsRegistry {\n${n}\n}`)}p?(A.imports.addNamed(r,{from:F.name,imports:e,isType:!0}),A.common.appendFromString(r,{code:`declare module "${F.name}" {
  ${t.join(`
  `)}
}`,comments:k})):A.common.appendFromString(r,{code:`/**
 * @typedef {import("${F.name}").${e.join(` & `)}} _ModuleAugmentation
 */`,comments:k})}if(!(W(r,`validator`)||n.precompiled||!(a(n.name)||n.name===`noop`))){if(n.draft2020){let{imports:e,code:t}=ye({validator:n,ts:m});for(let t of e)if(t.isDefault){if(t.as===void 0)continue;A.imports.addDefault(r,{from:t.from,as:t.as})}else A.imports.addNamed(r,{from:t.from,imports:t.imports??[],isType:t.isType});A.common.appendFromString(r,{code:t,comments:k})}else n.name===`ajv8`?(p&&A.imports.addNamed(r,{from:F.name,imports:[`ValidatorFactoryOptions`],isType:!0}),A.imports.addNamed(r,{from:o(n.name).name,imports:[`addFormComponents`,`createFormValidator`]}),A.imports.addDefault(r,{from:`ajv-formats`,as:`addFormats`}),A.common.appendFromString(r,{code:p?`export function validator<T>(options: ValidatorFactoryOptions) {
  return createFormValidator<T>({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });
}`:`/**
 * @template T
 * @param {import("${F.name}").ValidatorFactoryOptions} options
 * @returns {ReturnType<typeof createFormValidator<T>>}
 */
export const validator = (options) => createFormValidator({
    ...options,
    ajvPlugins: (ajv) => addFormComponents(addFormats(ajv))
  });`,comments:k})):U(r,{name:`validator`,imported:`createFormValidator`,source:b(n.name)?v(n.name):o(n.name).name});if(!T(O)){let e=[],t=new Set;for(let[n,r]of Object.entries(O))switch(r.kind){case`StringEnumValueMapperBuilder`:t.add(`StringEnumValueMapperBuilder`),e.push(`${n}: () => new StringEnumValueMapperBuilder()`);break;case`IdEnumValueMapperBuilder`:t.add(`IdEnumValueMapperBuilder`),e.push(`${n}: () => new IdEnumValueMapperBuilder()`)}for(let e of t)A.imports.addNamed(r,{from:`${F.name}/options.svelte`,imports:[e]});A.common.appendFromString(r,{code:`export const uiOptionsRegistry = {\n  ${e.join(`,
  `)},\n};`,comments:k})}}})}function De({addDependency:e,themeOrSubTheme:n,validator:r,icons:i,sveltekit:s,sveltekitPackage:c,widgets:l}){function u(t,n=!1){for(let r of L(t,n))e(r)}e(F);let f=y(n),m=h(f);e(m);let g=[];if(l.length>0)for(let e of l)for(let t of A(f,e))g.push(t);else g.push(E(`pikaday`),E(`skeletonSvelte`),E(`internationalizedDate`));if(u(m.dependencies,g),N(n)&&u(d(n)),t(f)){e(I(`tailwindcss4`)),e(I(`tailwindcss4Vite`));for(let t of p(f))e(H(t))}if(r.precompiled||r.draft2020||_e(r)){let t=o(r.name);e(t),u(t.dependencies),r.name===`ajv8`&&(e(I(`ajvFormat`)),r.precompiled&&e(I(`esbuild`)))}else r.name===`standard-schema`&&u(F.dependencies,[E(`standardSchemaSpec`)]);if(i!==`none`){let t=_(i);e(t),u(t.dependencies)}(a(r.name)||r.name===`standard-schema`||r.name===`noop`)&&e(I(`jsonSchemaToTs`)),s!==`no`&&(e(c),u(c.dependencies))}var X=[`pico`,`daisyui5`,`flowbite3`,`skeleton5`,`shadcn4`,`shadcn-extras`,`beercss`];function Oe({language:e,validator:t,lib:n,themeOrSubTheme:i,form:a,html5Validation:o}){return r.svelteScript({language:e},({ast:e,js:r,svelte:s})=>{r.imports.addNamed(e.instance.content,{imports:a.formPackageImports,from:F.name});for(let t of a.additionalImports)`as`in t?r.imports.addNamespace(e.instance.content,t):r.imports.addNamed(e.instance.content,t);r.imports.addNamespace(e.instance.content,{as:`defaults`,from:n(`sjsf/defaults`)}),r.common.appendFromString(e.instance.content,{code:a.init}),!o&&t.name!==`noop`&&(a.attributes+=` novalidate`),X.includes(i)&&(a.attributes+=` style="padding: 2rem;"`),s.addFragment(e,`<BasicForm {form} ${a.attributes}/>`)})}function ke({validator:e,isTs:t,schema:n,ts:i,uiSchema:o,initialValue:s,fieldsValidationMode:c}){return r.script(({ast:r,js:l,comments:u})=>{if(a(e.name)||e.name===`noop`){t&&(l.imports.addNamed(r,{isType:!0,imports:[`FromSchema`],from:I(`jsonSchemaToTs`).name}),l.imports.addNamed(r,{isType:!0,imports:[`Schema`],from:F.name}));let e=l.common.parseFromString(`(${n}${i(` as const satisfies Schema`)})`),a=l.variables.declaration(r,{kind:`const`,name:`schema`,value:e});t||l.common.addJsDocTypeComment(a,u,{type:`import(${F.name}).Schema`}),l.exports.createNamed(r,{name:`schema`,fallback:a}),t&&l.common.appendFromString(r,{code:`export type Model = FromSchema<typeof schema>;`})}else if(e.name===`zod4`){let{code:e,expression:i}=J(n);e&&l.common.appendFromString(r,{code:e});let a=l.common.parseExpression(i),o=l.variables.declaration(r,{kind:`const`,name:`schema`,value:a});l.exports.createNamed(r,{name:`schema`,fallback:o}),t&&l.common.appendFromString(r,{code:`export type Model = z.infer<typeof schema>;`})}else if(e.name===`valibot`){let{code:e,expression:i}=J(n);e&&l.common.appendFromString(r,{code:e});let a=l.common.parseExpression(i),o=l.variables.declaration(r,{kind:`const`,name:`schema`,value:a});l.exports.createNamed(r,{name:`schema`,fallback:o}),t&&l.common.appendFromString(r,{code:`export type Model = v.InferInput<typeof schema>;`})}else if(e.name===`standard-schema`)t&&(l.imports.addNamed(r,{isType:!0,imports:[`FromSchema`],from:I(`jsonSchemaToTs`).name}),l.imports.addNamed(r,{isType:!0,imports:[`Schema`],from:F.name}),l.imports.addNamed(r,{imports:[`StandardSchemaV1`,`StandardJSONSchemaV1`],from:`@standard-schema/spec`,isType:!0})),l.common.appendFromString(r,{code:t?`const internalSchema = (${n}) as const satisfies Schema;`:`/** @type {import("${F.name}").Schema} */\nconst internalSchema = (${n});`,comments:u}),t&&l.common.appendFromString(r,{code:`type InternalModel = FromSchema<typeof internalSchema>;`,comments:u}),l.common.appendFromString(r,{code:`// TODO: Replace demo schema with real Standard Schema (arktype, typebox, valibot, zod, etc.)
export const schema${i(`: StandardSchemaV1<InternalModel> & StandardJSONSchemaV1`)} = {
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value) {
      return typeof value === "object" && value !== null
        ? { value${i(`: value as InternalModel`)} }
        : { issues: [{ message: "Invalid", path: [] }] };
    },
    jsonSchema: {
      input: () => internalSchema,
      output() {
        throw new Error("not implemented");
      },
    },
  },
};`,comments:u}),t&&l.common.appendFromString(r,{code:`export type Model = StandardSchemaV1.InferInput<typeof schema>;`,comments:u});else throw V(e.name,`unexpected validator`);if(!T(o)){t&&l.imports.addNamed(r,{isType:!0,imports:[`UiSchemaRoot`],from:F.name});let e=l.common.parseFromString(`(${JSON.stringify(o)}${i(` as const satisfies UiSchemaRoot`)})`),n=l.variables.declaration(r,{kind:`const`,name:`uiSchema`,value:e});l.exports.createNamed(r,{name:`uiSchema`,fallback:n})}if(s!==void 0){let e=l.common.parseFromString(`(${JSON.stringify(s)})`),t=l.variables.declaration(r,{kind:`const`,name:`initialValue`,value:e});l.exports.createNamed(r,{name:`initialValue`,fallback:t})}if(c>0){let e=G(c);l.imports.addNamed(r,{imports:e,from:F.name});let t=l.variables.declaration(r,{kind:`const`,name:`fieldsValidationMode`,value:l.common.parseFromString(e.join(` | `))});l.exports.createNamed(r,{name:`fieldsValidationMode`,fallback:t})}})}function Z(e){let t=e=>e?`@hyperjump/json-schema/draft-2020-12`:`@hyperjump/json-schema/draft-07`,n={ajv8:Ae,schemasafe:je,hyperjump:Q({parallel:!1,vendorImports:e=>`import {
  registerSchema,
  unregisterSchema,
  validate,${e.ts(`
  type SchemaObject,`)}
} from "${t(e.validator.draft2020)}";`,compileSchemaBody:({ctx:{validator:e,ts:n,language:r},definePatchAndSchemas:i,saveModel:a})=>`let id = 0;
const toId = (n${n(`: number`)}) => \`https://example.com/v\${n}\`;
${i(`createId: () => toId(id++)`)}

for (const schema of schemas) {
  registerSchema(${e.draft2020?`schema${n(` as SchemaObject`)}`:`
    Object.assign(
      { $schema: "http://json-schema.org/draft-07/schema" },
      schema${n(` as SchemaObject`)}
    )
`});
}

try {
  ${a()};
  const serialized${n(`: Record<string, string>`)} = {};
  for (const schema of schemas) {
    const validator = await validate(schema.$id${n(`!`)});
    serialized[schema.$id${n(`!`)}] = validator.serialize();
  }
  await fs.writeFile(
    path.join(modelDir, "validators.generated.${r}"),
    \`// Generated by \${SCRIPT_PATH} - do not edit
${n(`import { restoreValidator } from "${t(e.draft2020)}";`)}

export const validators = {
\${Object.entries(serialized)
  .map(([id, json]) => \`  \${JSON.stringify(id)}: restoreValidator(\${JSON.stringify(json)}),\`)
  .join("\\n")}
};
\`
  );
} finally {
  for (const schema of schemas) {
    unregisterSchema(schema.$id${n(`!`)});
  }
}

`}),ata:Me};return r.script(({ast:t,comments:r,js:i})=>{let a=n[e.validator.name](e);i.common.appendFromString(t,{comments:r,code:a})})}function Q({vendorImports:e,compileSchemaBody:t,parallel:n}){return r=>{let{modelPaths:i,ts:a,language:o,fieldsValidationMode:s}=r,c=G(s),l=c.join(`, `),u=c.length>0?`import { ${l} } from "${F.name}";\n\n`:``,d=`import { convert } from "${F.name}/converters/draft-2020-12";\n\n`,f=c.length>0?`import { \${FIELDS_VALIDATION_KEYS} } from "${F.name}";\n`:``,p=c.length>0?`
export const fieldsValidationMode = \${FIELDS_VALIDATION_MODE};
`:``;return`import fs from "node:fs/promises";
import path from "node:path";

${u}${d}import {
  insertSubSchemaIds,
  fragmentSchema,
} from "${v(`precompile`)}";

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
${a(`import type { Schema, UiSchemaRoot } from "${F.name}";
import type { FromSchema } from "${I(`jsonSchemaToTs`).name}";
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
`}}var Ae=Q({parallel:!0,vendorImports:e=>`import { addFormComponents, DEFAULT_AJV_CONFIG } from "${o(`ajv8`).name}";
${e.validator.draft2020?`import { Ajv2020 } from "ajv/dist/2020.js";`:`import Ajv from "ajv";`}
import standaloneCode from "ajv/dist/standalone/index.js";
import addFormats from "${I(`ajvFormat`).name}";
import { build } from "${I(`esbuild`).name}"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>`${t()};
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
} from "${o(`schemasafe`).name}"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>{let i=e.validator.draft2020?`
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
import { DEFAULT_PRECOMPILED_VALIDATOR_OPTIONS } from "${o(`ata`).name}/precompile"`,compileSchemaBody:({ctx:e,definePatchAndSchemas:t,saveModel:n,saveValidators:r})=>{let i=e.validator.draft2020?`https://json-schema.org/draft/2020-12/schema`:`http://json-schema.org/draft-07/schema`;return`${t()};
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
`}}),$=`setShadcnThemeContext`;function Ne({themeOrSubTheme:e,resolveImportPath:t,widgets:n}){return r.script(({ast:r,js:i,comments:a})=>{if(e!==`shadcn4`&&e!==`shadcn-extras`)return!1;let o=e===`shadcn-extras`;i.imports.addNamed(r,{imports:[`setThemeContext`],from:h(`shadcn4`).name});let s=new Map,c=[],l=[],u=new Set,d=new Set(n);function f(e,t,n){let r=s.get(t);r||(r={active:[],commented:[]},s.set(t,r)),n?(r.active.push(e),c.push(e)):(r.commented.push(e),l.push(e))}for(let{folder:e,components:n}of j()){let r=t(e,P);for(let e of n)u.add(e),f(e,r,!0)}for(let e of D()){let n=d.has(e.widget);for(let[r,i]of Object.entries(e.components)){let e=t(r,P),a=Array.isArray(i)?i:Object.values(i);for(let t of a)u.has(t)||(u.add(t),f(t,e,n))}}if(o)for(let e of k()){let n=d.has(e.widget);for(let[r,i]of Object.entries(e.components)){let e=t(r,te),a=Array.isArray(i)?i:Object.values(i);for(let t of a)u.has(t)||(u.add(t),f(t,e,n))}}for(let[e,{active:t}]of s)t.length>0&&i.imports.addNamed(r,{imports:t,from:e});W(r,$)||i.common.appendFromString(r,{code:`// https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/#components
export function ${$}() {
  setThemeContext({
    components: {
      ${c.join(`, `)}\n${l.map(e=>`// ${e}`).join(`,
`)}
    }
  })
}`,comments:a})})}function Pe({themeOrSubTheme:e,lib:t,instance:n,js:r}){if(e!==`shadcn4`&&e!==`shadcn-extras`)return;r.imports.addNamed(n.content,{imports:[$],from:t(`sjsf/shadcn`)});let i=r.common.parseStatement(`${$}();`);r.common.appendStatement(n.content,{statement:i})}function Fe({nodeModulesPath:e,themeOrSubTheme:n,icons:i,sandbox:a}){return r.css(({ast:r,css:o})=>{let c=Le(r),l=y(n);if(t(l)){let e=Array.from(p(l));for(let t of e){let e=H(t);o.addAtRule(r,{name:`plugin`,params:`'${e.name}'`,append:!1})}o.addAtRule(r,{name:`import`,params:`'tailwindcss'`,append:!1})}let u={nodeModulesPath:e,sandbox:a},d=s(n,u);i!==`none`&&(d=d.concat(ie(i,u)));let f=[];for(let e of d)e.name===`import`?f.push(`"${e.params}"`):o.addAtRule(r,{name:e.name,params:`"${e.params}"`,append:!0});if(f.length>0&&o.addImports(r,{imports:f}),c){if(n===`daisyui5`)o.addAtRule(r,{name:`plugin`,params:`"daisyui"`,append:!0});else if(n===`flowbite3`)o.addAtRule(r,{name:`plugin`,params:`"flowbite/plugin"`,append:!0}),o.addAtRule(r,{name:`custom-variant`,params:`dark (&:where(.dark, .dark *))`,append:!0}),o.addAtRule(r,{name:`theme`,params:`{
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
}`,append:!0}),a||o.addAtRule(r,{name:`source`,params:`"${e}/flowbite-svelte/dist"`,append:!0});else if(n===`skeleton5`)o.addAtRule(r,{name:`import`,params:`"@skeletonlabs/skeleton"`,append:!0}),o.addAtRule(r,{name:`import`,params:`"@skeletonlabs/skeleton-svelte"`,append:!0}),o.addAtRule(r,{name:`import`,params:`"@skeletonlabs/skeleton/themes/cerberus"`,append:!0});else if(n.startsWith(`shadcn`)){o.addAtRule(r,{name:`custom-variant`,params:`dark (&:where(.dark *))`,append:!0});let e=ue(r,{selector:`root`});for(let t of[{property:`--radius`,value:`0.625rem`},{property:`--background`,value:`oklch(1 0 0)`},{property:`--foreground`,value:`oklch(0.145 0 0)`},{property:`--card`,value:`oklch(1 0 0)`},{property:`--card-foreground`,value:`oklch(0.145 0 0)`},{property:`--popover`,value:`oklch(1 0 0)`},{property:`--popover-foreground`,value:`oklch(0.145 0 0)`},{property:`--primary`,value:`oklch(0.205 0 0)`},{property:`--primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--secondary`,value:`oklch(0.97 0 0)`},{property:`--secondary-foreground`,value:`oklch(0.205 0 0)`},{property:`--muted`,value:`oklch(0.97 0 0)`},{property:`--muted-foreground`,value:`oklch(0.556 0 0)`},{property:`--accent`,value:`oklch(0.97 0 0)`},{property:`--accent-foreground`,value:`oklch(0.205 0 0)`},{property:`--destructive`,value:`oklch(0.577 0.245 27.325)`},{property:`--border`,value:`oklch(0.922 0 0)`},{property:`--input`,value:`oklch(0.922 0 0)`},{property:`--ring`,value:`oklch(0.708 0 0)`},{property:`--chart-1`,value:`oklch(0.646 0.222 41.116)`},{property:`--chart-2`,value:`oklch(0.6 0.118 184.704)`},{property:`--chart-3`,value:`oklch(0.398 0.07 227.392)`},{property:`--chart-4`,value:`oklch(0.828 0.189 84.429)`},{property:`--chart-5`,value:`oklch(0.769 0.188 70.08)`},{property:`--sidebar`,value:`oklch(0.985 0 0)`},{property:`--sidebar-foreground`,value:`oklch(0.145 0 0)`},{property:`--sidebar-primary`,value:`oklch(0.205 0 0)`},{property:`--sidebar-primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-accent`,value:`oklch(0.97 0 0)`},{property:`--sidebar-accent-foreground`,value:`oklch(0.205 0 0)`},{property:`--sidebar-border`,value:`oklch(0.922 0 0)`},{property:`--sidebar-ring`,value:`oklch(0.708 0 0)`}])o.addDeclaration(e,t);let t=o.addRule(r,{selector:`dark`});for(let e of[{property:`--background`,value:`oklch(0.145 0 0)`},{property:`--foreground`,value:`oklch(0.985 0 0)`},{property:`--card`,value:`oklch(0.205 0 0)`},{property:`--card-foreground`,value:`oklch(0.985 0 0)`},{property:`--popover`,value:`oklch(0.269 0 0)`},{property:`--popover-foreground`,value:`oklch(0.985 0 0)`},{property:`--primary`,value:`oklch(0.922 0 0)`},{property:`--primary-foreground`,value:`oklch(0.205 0 0)`},{property:`--secondary`,value:`oklch(0.269 0 0)`},{property:`--secondary-foreground`,value:`oklch(0.985 0 0)`},{property:`--muted`,value:`oklch(0.269 0 0)`},{property:`--muted-foreground`,value:`oklch(0.708 0 0)`},{property:`--accent`,value:`oklch(0.371 0 0)`},{property:`--accent-foreground`,value:`oklch(0.985 0 0)`},{property:`--destructive`,value:`oklch(0.704 0.191 22.216)`},{property:`--border`,value:`oklch(1 0 0 / 10%)`},{property:`--input`,value:`oklch(1 0 0 / 15%)`},{property:`--ring`,value:`oklch(0.556 0 0)`},{property:`--chart-1`,value:`oklch(0.488 0.243 264.376)`},{property:`--chart-2`,value:`oklch(0.696 0.17 162.48)`},{property:`--chart-3`,value:`oklch(0.769 0.188 70.08)`},{property:`--chart-4`,value:`oklch(0.627 0.265 303.9)`},{property:`--chart-5`,value:`oklch(0.645 0.246 16.439)`},{property:`--sidebar`,value:`oklch(0.205 0 0)`},{property:`--sidebar-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-primary`,value:`oklch(0.488 0.243 264.376)`},{property:`--sidebar-primary-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-accent`,value:`oklch(0.269 0 0)`},{property:`--sidebar-accent-foreground`,value:`oklch(0.985 0 0)`},{property:`--sidebar-border`,value:`oklch(1 0 0 / 10%)`},{property:`--sidebar-ring`,value:`oklch(0.439 0 0)`}])o.addDeclaration(t,e);o.addAtRule(r,{name:`theme`,params:`inline {
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
}`,append:!0}),o.addAtRule(r,{name:`layer`,params:`base {
  * {
    @apply border-border outline-ring/50;
  }
 
  body {
    @apply bg-background text-foreground;
  }
}`,append:!0})}}})}var Ie=[{name:`import`,params:`tailwindcss`},{name:`plugin`,params:`@tailwindcss/forms`},{name:`plugin`,params:`@tailwindcss/typography`}];function Le(e){for(let t of e.children)if(t.type!==`Atrule`||Ie.findIndex(e=>e.name===t.name&&t.prelude.includes(e.params))<0)return!1;return!0}function Re({svelteVersion:e=`5`,language:t,stylesheetPath:n,lib:i,isKit:a,themeOrSubTheme:o}){return r.svelteScript({language:t},t=>{let{ast:r,svelte:s,js:c}=t;n&&c.imports.addEmpty(r.instance.content,{from:n}),Pe({themeOrSubTheme:o,instance:r.instance,js:c,lib:i}),a&&r.fragment.nodes.length===0&&s.addSlot(r,{svelteVersion:e}),o===`svar`?(c.imports.addNamed(r.instance.content,{imports:[`Willow`],from:`@svar-ui/svelte-core`}),fe(r,{wrapper:`Willow`})):o===`beercss`&&c.imports.addEmpty(r.instance.content,{from:`beercss/dist/cdn/beer.css`})})}var ze=new Set([`@sjsf/form`,`svelte`,`tailwind-merge`]);function Be({themeOrSubTheme:e,icons:n,sveltekit:i,sveltekitPackage:a}){return r.script(({ast:r,js:o,comments:s})=>{let c=y(e),l=o.vite.getConfig(r);t(c)&&(o.imports.addDefault(r,{as:`tailwindcss`,from:`@tailwindcss/vite`}),o.vite.addPlugin(r,{code:`tailwindcss()`,mode:`append`}));let u=new Set;if(n&&n!==`none`)for(let e of _(n).dependencies)ze.has(e.name)||u.add(e.name);if(h(c).dependencies.some(e=>e.name===`@lucide/svelte`)&&u.add(`@lucide/svelte`),u.size>0){let e=o.vite.configProperty(r,l,{name:`ssr`,fallback:o.object.create({})}),t=o.object.property(e,{name:`noExternal`,fallback:o.array.create()});for(let e of u)o.array.append(t,e)}if(i===`remoteFunctions`){let e=o.vite.configProperty(r,l,{name:`optimizeDeps`,fallback:o.object.create({})}),t=o.object.property(e,{name:`exclude`,fallback:o.array.create()});s.add(t,{type:`Line`,value:` https://github.com/sveltejs/kit/issues/14788`}),o.array.append(t,`@sjsf/form`),o.array.append(t,g(a,`rf/client`))}})}export{Z as a,Oe as c,Ce as d,ve as f,pe as g,me as h,Ne as i,De as l,ge as m,Re as n,ke as o,he as p,Fe as r,X as s,Be as t,Ee as u};