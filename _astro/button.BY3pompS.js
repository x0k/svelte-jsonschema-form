import{S as e,ct as t,lt as n}from"./index-client.DygggIMv.js";import{Z as r,an as i,at as a,g as o,kt as s,m as c,n as l,r as u,st as d}from"./client.B0k3dZbu.js";import{a as f,c as p,d as m,f as h,h as ee,i as g,l as _,m as v,n as y,o as b,p as x,r as S,s as C,t as w,u as T,v as E}from"./codegen.B8cMxfJr.js";function D({name:e,dependencies:t,precompiled:n,language:r}){let i={},a={};for(let e of t)(e.dev?a:i)[e.name]=`^${e.version}`;let o={dev:`vite dev`};return n&&(o[`sjsf:compile`]=`node scripts/compile-validators.${r}`,o.prepare=`npm run sjsf:compile`),JSON.stringify({name:e,version:`0.0.1`,type:`module`,dependencies:i,devDependencies:a,scripts:o},null,2)}var te=JSON.stringify({extends:`./.svelte-kit/tsconfig.json`,compilerOptions:{allowJs:!0,checkJs:!0,esModuleInterop:!0,forceConsistentCasingInFileNames:!0,resolveJsonModule:!0,skipLibCheck:!0,sourceMap:!0,strict:!0,moduleResolution:`bundler`}},null,2),ne=`<!DOCTYPE html>
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
</html>`,re=e=>`<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props()
<\/script>

${e?`<div style="padding: 2rem">{@render children()}</div>`:`{@render children()}`}
`,ie=`import adapter from "@sveltejs/adapter-auto";
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
`,ae=`import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [sveltekit()] });`;function O(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)}async function k(r){let{name:i,language:a,themeOrSubTheme:o,icons:s,validator:c,sveltekit:l,widgets:u,fields:d,extraFiles:k,extraDependencies:A,codeTransformers:j,modelName:M,fieldsValidationMode:N,schema:P,uiSchema:F,initialValue:I,disabled:L,merger:R,uiOptionsRegistry:z,themeExtension:B,moduleAugmentation:V,omitExtraData:H,focusOnFirstError:U,html5Validation:W,resolver:G,css:K}=r,q=a===`ts`,J=E(q),oe=E(!q),Y=ee,X=[t(`vite`),t(`svelteAdapterAuto`),t(`svelteVitePlugin`),t(`typescript`),...A,...n(e.dependencies,!1)];function Z(e){X.push(e)}T({addDependency:Z,themeOrSubTheme:o,validator:c,icons:s,sveltekit:l,widgets:u});let se=x({validator:v({validator:c,isTs:q,lib:Y,modelName:M}),disabled:L,isTs:q,modelName:M,sveltekit:l,omitExtraData:H}),Q={"package.json":D({name:O(i),dependencies:new Map(X.map(e=>[e.name,e])).values(),precompiled:c.precompiled,language:a}),"vite.config.js":w({themeOrSubTheme:o,icons:s,sveltekit:l})(ae),"svelte.config.js":ie,"tsconfig.json":te,"src/app.html":y({themeOrSubTheme:o})(ne),"src/lib/sjsf/defaults.ts":m({themeOrSubTheme:o,validator:c,icons:s,resolver:G,sveltekit:l,widgets:u,fields:d,isTs:q,ts:J,js:oe,merger:R,focusOnFirstError:U,themeExtension:B,moduleAugmentation:V,uiOptionsRegistry:z})(``),"src/routes/+page.svelte":_({language:a,themeOrSubTheme:o,validator:c,lib:Y,form:se,html5Validation:W})(``)};if(P&&!c.precompiled)Q[`src/lib/${M}.${a}`]=(await C({validator:c,isTs:q,ts:J,schema:P,uiSchema:F,initialValue:I,fieldsValidationMode:N}))(``);else if(P&&c.precompiled){let e=`src/lib/${M}/`;Q[`${e}schema.json`]=h(JSON.parse(P))(``),Q[`${e}ui-schema.json`]=h(F)(``),Q[`${e}initial-value.json`]=h(I)(``),Q[`scripts/compile-validators.${a}`]=b({modelPaths:[e],validator:c,language:a,ts:J,fieldsValidationMode:N})(``)}function $(e,t){return t&&(Q[e]=t),t}let ce=$(`src/routes/layout.css`,g({nodeModulesPath:`../../node_modules`,themeOrSubTheme:o,icons:s,sandbox:!0})(K)),le=re(p.includes(o));Q[`src/routes/+layout.svelte`]=S({language:a,themeOrSubTheme:o,lib:Y,isKit:!0,stylesheetPath:ce&&`./layout.css`})(le),$(`src/lib/sjsf/shadcn.${a}`,f({themeOrSubTheme:o,resolveImportPath:(e,t)=>t,widgets:u})(``)),Object.assign(Q,k);for(let e of j)for(let[t,n]of Object.entries(Q))Q[t]=e(t,n);return Q}var A=new Set([`$$slots`,`$$events`,`$$legacy`,`active`,`disabled`,`onclick`,`size`,`title`,`variant`,`children`]),j=d(`<button><!></button>`);function M(e,t){let n=l(t,`active`,3,!1),d=l(t,`disabled`,3,!1),f=l(t,`size`,3,`md`),p=l(t,`variant`,3,`ghost`),m=u(t,A);var h=j();o(h,()=>({...m,type:`button`,class:`btn ${p()??``} ${f()??``}`,disabled:d(),onclick:t.onclick,title:t.title,[c]:{active:n()}}),void 0,void 0,void 0,`svelte-1ca9ruk`),r(s(h),()=>t.children),i(h),a(e,h)}export{k as n,O as r,M as t};