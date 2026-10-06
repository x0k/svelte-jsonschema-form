import{at as e,it as t,s as n,x as r,y as i}from"./index-client.Bkw0bN1l.js";import{Z as a,g as o,jt as s,ln as c,lt as l,m as u,n as d,r as f,st as p}from"./client.qk2OQxZe.js";import{a as m,c as h,d as g,f as _,g as v,h as ee,i as y,l as b,n as te,o as x,r as S,s as ne,t as re,u as C}from"./codegen.b7eGmvOO.js";function w(e){return r.json(({data:t})=>{n(t)&&Object.assign(t,e)})}function T({themeOrSubTheme:e}){return r.html(({ast:t,html:n})=>{if(e!==`skeleton5`)return;let r=t.nodes.find(e=>e.type===`RegularElement`&&e.name===`html`);if(!r)return console.warn(`Could not find <html> node in app.html. You'll need to add the language placeholder manually`),!1;n.addAttribute(r,`data-theme`,`cerberus`)})}function E({name:e,dependencies:t,precompiled:r,language:i,libImports:a}){let o={},s={};for(let e of t)(e.dev?s:o)[e.name]=`^${e.version}`;let c={dev:`vite dev`};return r&&(c[`sjsf:compile`]=`node scripts/compile-validators.${i}`,c.prepare=`npm run sjsf:compile`),JSON.stringify({name:e,version:`0.0.1`,type:`module`,...!n(a)&&{imports:a},dependencies:o,devDependencies:s,scripts:c},null,2)}function D(e){return JSON.stringify({extends:e,compilerOptions:{allowJs:!0,checkJs:!0,esModuleInterop:!0,forceConsistentCasingInFileNames:!0,resolveJsonModule:!0,skipLibCheck:!0,sourceMap:!0,strict:!0,moduleResolution:`bundler`}},null,2)}var ie=`<!DOCTYPE html>
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
</html>`,ae=e=>`<script lang="ts">
  import type { Snippet } from 'svelte';

  const { children }: { children: Snippet } = $props()
<\/script>

${e?`<div style="padding: 2rem">{@render children()}</div>`:`{@render children()}`}
`,oe=`import adapter from '@sveltejs/adapter-auto';
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
});`;function O(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-|-$/g,``)}function k(e,t,n){n&&(e[t]=n)}function A(n){let{name:r,language:a,themeOrSubTheme:o,icons:s,validator:c,sveltekit:l,kitRange:u,widgets:d,fields:f,extraFiles:p,extraDependencies:A,codeTransformers:j,modelName:M,fieldsValidationMode:N,schema:P,uiSchema:F,initialValue:I,disabled:L,merger:R,uiOptionsRegistry:z,themeExtension:B,moduleAugmentation:V,omitExtraData:H,focusOnFirstError:U,html5Validation:W,resolver:G,css:K}=n,q=a===`ts`,J=v(q),se=v(!q),Y=i(u),X=ee(Y.libPrefix),Z=[t(`vite`),t(`svelteAdapterAuto`),t(`svelteVitePlugin`),t(`typescript`),...A,...e(Y.pkg.dependencies,!1)];function ce(e){Z.push(e)}b({addDependency:ce,themeOrSubTheme:o,validator:c,icons:s,sveltekit:l,sveltekitPackage:Y.pkg,widgets:d});let le=_({validator:c,isTs:q,lib:X,modelName:M}),ue=g({validator:le,disabled:L,isTs:q,modelName:M,sveltekit:l,sveltekitPackage:Y.pkg,omitExtraData:H}),Q={"package.json":E({name:O(r),dependencies:new Map(Z.map(e=>[e.name,e])).values(),precompiled:c.precompiled,language:a,libImports:Y.libImports}),"tsconfig.json":D(Y.tsconfigExtends)};if(k(Q,`vite.config.js`,re({themeOrSubTheme:o,icons:s,sveltekit:l,sveltekitPackage:Y.pkg})(oe)),k(Q,`src/app.html`,T({themeOrSubTheme:o})(ie)),k(Q,`src/lib/sjsf/defaults.ts`,C({themeOrSubTheme:o,validator:c,icons:s,resolver:G,sveltekit:l,sveltekitPackage:Y.pkg,widgets:d,fields:f,isTs:q,ts:J,js:se,merger:R,focusOnFirstError:U,themeExtension:B,moduleAugmentation:V,uiOptionsRegistry:z})(``)),k(Q,`src/routes/+page.svelte`,h({language:a,themeOrSubTheme:o,validator:c,lib:X,form:ue,html5Validation:W})(``)),P&&!c.precompiled){let e=x({validator:c,isTs:q,ts:J,schema:P,uiSchema:F,initialValue:I,fieldsValidationMode:N});k(Q,`src/lib/${M}.${a}`,e(``))}else if(P&&c.precompiled){let e=`src/lib/${M}/`;k(Q,`${e}schema.json`,w(JSON.parse(P))(``)),k(Q,`${e}ui-schema.json`,w(F)(``)),k(Q,`${e}initial-value.json`,w(I)(``)),k(Q,`scripts/compile-validators.${a}`,m({modelPaths:[e],validator:c,language:a,ts:J,fieldsValidationMode:N})(``))}let $=S({nodeModulesPath:`../../node_modules`,themeOrSubTheme:o,icons:s,sandbox:!0})(K);k(Q,`src/routes/layout.css`,$);let de=ae(ne.includes(o));k(Q,`src/routes/+layout.svelte`,te({language:a,themeOrSubTheme:o,lib:X,isKit:!0,stylesheetPath:$?`./layout.css`:``})(de)),k(Q,`src/lib/sjsf/shadcn.${a}`,y({themeOrSubTheme:o,resolveImportPath:(e,t)=>t,widgets:d})(``)),Object.assign(Q,p);for(let e of j)for(let[t,n]of Object.entries(Q))Q[t]=e(t,n);return Q}var j=new Set([`$$slots`,`$$events`,`$$legacy`,`active`,`disabled`,`onclick`,`size`,`title`,`variant`,`children`]),M=l(`<button><!></button>`);function N(e,t){let n=d(t,`active`,3,!1),r=d(t,`disabled`,3,!1),i=d(t,`size`,3,`md`),l=d(t,`variant`,3,`ghost`),m=f(t,j);var h=M();o(h,()=>({...m,type:`button`,class:`btn ${l()??``} ${i()??``}`,disabled:r(),onclick:t.onclick,title:t.title,[u]:{active:n()}}),void 0,void 0,void 0,`svelte-1ca9ruk`);var g=s(h);a(g,()=>t.children),c(h),p(e,h)}export{A as n,O as r,N as t};