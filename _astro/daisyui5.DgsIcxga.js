import{o as s}from"./advanced-examples.Dt1wZFXc.js";import"./_commonjsHelpers.B6s2aKwq.js";import"./render.C2f5VKUu.js";import"./function.bEX8S1gg.js";import"./shared.C6Sl3ZLL.js";import"./preload-helper.BUFao3bW.js";import"./buttons.Dq8Tj-Dm.js";/* empty css                                                       *//* empty css                                                                 */const e="daisyui5-starter",t="0.0.1",i="module",c={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},o={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.28.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",daisyui:"^5.0.50",svelte:"^5.38.1","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"^2.2.1","@sjsf/basic-theme":"^2.2.1","@sjsf/daisyui5-theme":"^2.2.1","@sjsf/form":"^2.2.1",ajv:"^8.17.1"},a={name:e,private:!0,version:t,type:i,scripts:c,devDependencies:o,dependencies:n},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,y={package:s(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{y as layer};
