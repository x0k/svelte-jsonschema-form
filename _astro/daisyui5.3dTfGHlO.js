import{o as s}from"./advanced-examples.C2pVl4J8.js";import"./each.DA8Iz3oH.js";import"./render.DgIpg5f0.js";import"./definitions.B_Fnfyhh.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.ClxrbVWC.js";import"./shared.DBy_6Hme.js";import"./preload-helper.BUFao3bW.js";import"./buttons.By8qtqJP.js";/* empty css                                                       *//* empty css                                                                 */const e="daisyui5-starter",t="0.0.8",i="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",daisyui:"^5.3.0",svelte:"^5.34.8","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/daisyui5-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1"},a={name:e,private:!0,version:t,type:i,scripts:o,devDependencies:c,dependencies:n},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,w={package:s(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{w as layer};
