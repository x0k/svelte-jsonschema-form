import{X as e,Y as t,p as n}from"./shadcn.XUsiemR3.js";import{a as r,c as i,d as a,f as o,h as s,i as c,l,m as u,n as d,o as ee,p as f,r as p,s as te,t as m,u as ne,v as h}from"./codegen.VfpmfJeQ.js";function g({name:e,dependencies:t,precompiled:n,language:r}){let i={},a={};for(let e of t)(e.dev?a:i)[e.name]=`^${e.version}`;let o={dev:`vite dev`};return n&&(o[`sjsf:compile`]=`node scripts/compile-validators.${r}`,o.prepare=`npm run sjsf:compile`),JSON.stringify({name:e,version:`0.0.1`,type:`module`,dependencies:i,devDependencies:a,scripts:o},null,2)}var _=JSON.stringify({extends:`./.svelte-kit/tsconfig.json`,compilerOptions:{allowJs:!0,checkJs:!0,esModuleInterop:!0,forceConsistentCasingInFileNames:!0,resolveJsonModule:!0,skipLibCheck:!0,sourceMap:!0,strict:!0,moduleResolution:`bundler`}},null,2),v=`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`,y=e=>`<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props()
<\/script>

${e?`<div style="padding: 2rem">{@render children()}</div>`:`{@render children()}`}
`,b=`import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    runes: true,
    experimental: {
      async: true,
    },
  },
};

export default config;
`,x=`import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [sveltekit()] });`;function S(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)}async function C(C){let{name:re,language:w,themeOrSubTheme:T,icons:E,validator:D,sveltekit:O,widgets:k,fields:A,extraFiles:j,extraDependencies:M,codeTransformers:N,modelName:P,fieldsValidationMode:F,schema:I,uiSchema:L,initialValue:R,disabled:z,merger:ie,uiOptionsRegistry:B,themeExtension:V,moduleAugmentation:H,omitExtraData:U,focusOnFirstError:W,html5Validation:G,resolver:K,css:q}=C,J=w===`ts`,Y=h(J),ae=h(!J),X=s,Z=[t(`vite`),t(`svelteAdapterAuto`),t(`svelteVitePlugin`),t(`typescript`),...M,...e(n.dependencies,!1)];function oe(e){Z.push(e)}ne({addDependency:oe,themeOrSubTheme:T,validator:D,icons:E,sveltekit:O,widgets:k});let se=f({validator:u({validator:D,isTs:J,lib:X,modelName:P}),disabled:z,isTs:J,modelName:P,sveltekit:O,omitExtraData:U}),Q={"package.json":g({name:S(re),dependencies:new Map(Z.map(e=>[e.name,e])).values(),precompiled:D.precompiled,language:w}),"vite.config.js":m({themeOrSubTheme:T,icons:E,sveltekit:O})(x),"svelte.config.js":b,"tsconfig.json":_,"src/app.html":d({themeOrSubTheme:T})(v),"src/lib/sjsf/defaults.ts":a({themeOrSubTheme:T,validator:D,icons:E,resolver:K,sveltekit:O,widgets:k,fields:A,isTs:J,ts:Y,js:ae,merger:ie,focusOnFirstError:W,themeExtension:V,moduleAugmentation:H,uiOptionsRegistry:B})(``),"src/routes/+page.svelte":l({language:w,themeOrSubTheme:T,validator:D,lib:X,form:se,html5Validation:G})(``)};if(I&&!D.precompiled)Q[`src/lib/${P}.${w}`]=(await te({validator:D,isTs:J,ts:Y,schema:I,uiSchema:L,initialValue:R,fieldsValidationMode:F}))(``);else if(I&&D.precompiled){let e=`src/lib/${P}/`;Q[`${e}schema.json`]=o(JSON.parse(I))(``),Q[`${e}ui-schema.json`]=o(L)(``),Q[`${e}initial-value.json`]=o(R)(``),Q[`scripts/compile-validators.${w}`]=ee({modelPaths:[e],validator:D,language:w,ts:Y,fieldsValidationMode:F})(``)}function $(e,t){return t&&(Q[e]=t),t}let ce=$(`src/routes/layout.css`,c({nodeModulesPath:`../../node_modules`,themeOrSubTheme:T,icons:E,sandbox:!0})(q)),le=y(i.includes(T));Q[`src/routes/+layout.svelte`]=p({language:w,themeOrSubTheme:T,lib:X,isKit:!0,stylesheetPath:ce&&`./layout.css`})(le),$(`src/lib/sjsf/shadcn.${w}`,r({themeOrSubTheme:T,resolveImportPath:(e,t)=>t,widgets:k})(``)),Object.assign(Q,j);for(let e of N)for(let[t,n]of Object.entries(Q))Q[t]=e(t,n);return Q}export{S as n,C as t};