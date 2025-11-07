import{o as s}from"./advanced-examples.Nx72fBox.js";import"./each.BC0dbH8N.js";import"./render.DxLQKmJN.js";import"./definitions.DJcsTpNp.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BL4UIDmo.js";import"./shared.DWFaaLFU.js";import"./preload-helper.BUFao3bW.js";import"./buttons.DaY576ra.js";/* empty css                                                       *//* empty css                                                                 */const e="daisyui5-starter",t="0.0.2",i="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",daisyui:"^5.3.0",svelte:"^5.30.0","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/daisyui5-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1"},a={name:e,private:!0,version:t,type:i,scripts:o,devDependencies:c,dependencies:n},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,w={package:s(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{w as layer};
