import{dn as e,fn as t}from"./form.DfNULKYA.js";import{g as n,h as r,p as i}from"./shared.Dmo3Y9LT.js";var a=[`svelte-exmarkdown`],o=[`json-schema-typed`],s=[`ajv`,`@sjsf/ajv8-validator`,...a,...o];function c(e,t){return{...e,...t,runes:e.runes&&t.runes}}function l(e,t){return{...e,...t,alias:{...e.alias,...t.alias}}}function u(e,t){return{...e,...t,compilerOptions:e.compilerOptions&&t.compilerOptions?c(e.compilerOptions,t.compilerOptions):e.compilerOptions??t.compilerOptions,kit:e.kit&&t.kit?l(e.kit,t.kit):e.kit??t.kit}}function d(e,t){return{...e,peerDependencies:{...e.peerDependencies,...t.peerDependencies},dependencies:{...e.dependencies,...t.dependencies},devDependencies:{...e.devDependencies,...t.devDependencies}}}function f(e,n){return{...e,...n,exclude:t([...e.exclude??[],...n.exclude??[]])}}function p(e,t){return{plugins:{...e.plugins,...t.plugins},optimizeDeps:e.optimizeDeps&&t.optimizeDeps?f(e.optimizeDeps,t.optimizeDeps):e.optimizeDeps??t.optimizeDeps}}function m(e,n){return{...e,...n,widgets:t([...e.widgets??[],...n.widgets??[]])}}function h(e,t){return{package:e.package&&t.package?d(e.package,t.package):t.package??e.package,vite:e.vite&&t.vite?p(e.vite,t.vite):t.vite??e.vite,formDefaults:e.formDefaults&&t.formDefaults?m(e.formDefaults,t.formDefaults):t.formDefaults??e.formDefaults,files:{...e.files,...t.files},codeTransformers:e.codeTransformers&&t.codeTransformers?e.codeTransformers.concat(t.codeTransformers):e.codeTransformers??t.codeTransformers,svelte:e.svelte&&t.svelte?u(e.svelte,t.svelte):e.svelte??t.svelte}}var g=i.split(`.`)[0];function _(e){return JSON.stringify(e,(e,t)=>t===`workspace:*`?e.startsWith(`@sjsf-lab/`)?g:i:t,2)}function v({plugins:e={},optimizeDeps:t={}}){return`import { defineConfig } from 'vite';
${Object.entries(e).map(([e,t])=>`import ${t.import} from "${e}";`).join(`
`)}
export default defineConfig({
  plugins: [${Object.values(e).map(e=>e.call).join(`, `)}],
  optimizeDeps: ${JSON.stringify(t)}
})`}function y({resolver:e=`basic`,theme:t=`basic`,validator:i=`Ajv`,widgets:a=[],idBuilderPackage:o=`@sjsf/form/id-builders/modern`}){let s=n(i),c=s?`
export { createFormValidator as validator } from "${s}";
`:``;return`export { resolver } from "@sjsf/form/resolvers/${e}";

export { theme } from "@sjsf${r(t)?`-lab`:``}/${t}-theme";
${a.map(e=>`import "@sjsf/${t}-theme/extra-widgets/${e}-include";`).join(`
`)}

export { translation } from "@sjsf/form/translations/en";

export { createFormIdBuilder as idBuilder } from "${o}";

export { createFormMerger as merger } from "@sjsf/form/mergers/modern";
${c}`}function b(e){let t=e?.compilerOptions?.runes??!0,n=e?.kit?.alias??{};return`import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
    alias: ${JSON.stringify(n)},
  },
  compilerOptions: {
    runes: ${t?`true`:`undefined`},
    experimental: {
      async: true,
    },
  },
};

export default config;
`}function x(e){let t={...e.files,"svelte.config.js":b(e.svelte)};if(e.package&&(t[`package.json`]=_(e.package)),e.vite&&(t[`vite.config.js`]=v(e.vite)),e.formDefaults&&(t[`src/lib/form-defaults.ts`]=y(e.formDefaults)),e.codeTransformers)for(let n of e.codeTransformers)for(let[e,r]of Object.entries(t))t[e]=n(e,r);return t}function S(e){return x(e.reduce(h))}function C(e,t){let n=new Map(Object.entries(e.dependencies??{})),r=new Map(Object.entries(e.devDependencies??{})),i=new Map(Object.entries(e.peerDependencies??{}));for(let e of t)n.delete(e),r.delete(e),i.delete(e);return{...e,peerDependencies:e.peerDependencies&&Object.fromEntries(i),dependencies:Object.fromEntries(n),devDependencies:Object.fromEntries(r)}}function w(e){return C(e,s)}function T(t){return n=>{let r={};for(let e of t)e in n&&(r[e]=n[e]);return e(r)?void 0:r}}function E({dependencies:e,devDependencies:t,peerDependencies:n},r){let i=T(r);return{dependencies:e&&i(e),devDependencies:t&&i(t),peerDependencies:n&&i(n)}}export{w as a,d as i,a as n,E as o,S as r,o as t};