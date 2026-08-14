import{I as e,L as t,S as n,a as r,c as i,d as a,f as o,h as s,i as c,l,m as u,n as d,o as ee,p as f,r as p,s as te,t as m,u as h,v as g}from"./codegen-Bs6pQ6Ja.js";function ne({name:e,dependencies:t,precompiled:n,language:r}){let i={},a={};for(let e of t)(e.dev?a:i)[e.name]=`^${e.version}`;let o={dev:`vite dev`};return n&&(o[`sjsf:compile`]=`node scripts/compile-validators.${r}`,o.prepare=`npm run sjsf:compile`),JSON.stringify({name:e,version:`0.0.1`,type:`module`,dependencies:i,devDependencies:a,scripts:o},null,2)}var _=JSON.stringify({extends:`./.svelte-kit/tsconfig.json`,compilerOptions:{allowJs:!0,checkJs:!0,esModuleInterop:!0,forceConsistentCasingInFileNames:!0,resolveJsonModule:!0,skipLibCheck:!0,sourceMap:!0,strict:!0,moduleResolution:`bundler`}},null,2),v=`<!DOCTYPE html>
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
`,b=`import adapter from '@sveltejs/adapter-auto';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      adapter: adapter(),
      compilerOptions: {
        runes: true,
        experimental: { async: true },
      },
      experimental: {
        remoteFunctions: true,
      },
    }),
  ],
});`;function x(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)}async function S(S){let{name:re,language:C,themeOrSubTheme:w,icons:T,validator:E,sveltekit:D,widgets:O,fields:k,extraFiles:A,extraDependencies:j,codeTransformers:M,modelName:N,fieldsValidationMode:P,schema:F,uiSchema:I,initialValue:L,disabled:R,merger:z,uiOptionsRegistry:ie,themeExtension:B,moduleAugmentation:V,omitExtraData:H,focusOnFirstError:U,html5Validation:W,resolver:G,css:K}=S,q=C===`ts`,J=g(q),Y=g(!q),X=s,Z=[e(`vite`),e(`svelteAdapterAuto`),e(`svelteVitePlugin`),e(`typescript`),...j,...t(n.dependencies,!1)];function ae(e){Z.push(e)}h({addDependency:ae,themeOrSubTheme:w,validator:E,icons:T,sveltekit:D,widgets:O});let oe=u({validator:E,isTs:q,lib:X,modelName:N}),se=f({validator:oe,disabled:R,isTs:q,modelName:N,sveltekit:D,omitExtraData:H}),Q={"package.json":ne({name:x(re),dependencies:new Map(Z.map(e=>[e.name,e])).values(),precompiled:E.precompiled,language:C}),"vite.config.js":m({themeOrSubTheme:w,icons:T,sveltekit:D})(b),"tsconfig.json":_,"src/app.html":d({themeOrSubTheme:w})(v),"src/lib/sjsf/defaults.ts":a({themeOrSubTheme:w,validator:E,icons:T,resolver:G,sveltekit:D,widgets:O,fields:k,isTs:q,ts:J,js:Y,merger:z,focusOnFirstError:U,themeExtension:B,moduleAugmentation:V,uiOptionsRegistry:ie})(``),"src/routes/+page.svelte":l({language:C,themeOrSubTheme:w,validator:E,lib:X,form:se,html5Validation:W})(``)};if(F&&!E.precompiled)Q[`src/lib/${N}.${C}`]=(await te({validator:E,isTs:q,ts:J,schema:F,uiSchema:I,initialValue:L,fieldsValidationMode:P}))(``);else if(F&&E.precompiled){let e=`src/lib/${N}/`;Q[`${e}schema.json`]=o(JSON.parse(F))(``),Q[`${e}ui-schema.json`]=o(I)(``),Q[`${e}initial-value.json`]=o(L)(``),Q[`scripts/compile-validators.${C}`]=ee({modelPaths:[e],validator:E,language:C,ts:J,fieldsValidationMode:P})(``)}function $(e,t){return t&&(Q[e]=t),t}let ce=$(`src/routes/layout.css`,c({nodeModulesPath:`../../node_modules`,themeOrSubTheme:w,icons:T,sandbox:!0})(K)),le=y(i.includes(w));Q[`src/routes/+layout.svelte`]=p({language:C,themeOrSubTheme:w,lib:X,isKit:!0,stylesheetPath:ce&&`./layout.css`})(le),$(`src/lib/sjsf/shadcn.${C}`,r({themeOrSubTheme:w,resolveImportPath:(e,t)=>t,widgets:O})(``)),Object.assign(Q,A);for(let e of M)for(let[t,n]of Object.entries(Q))Q[t]=e(t,n);return Q}export{x as n,S as t};