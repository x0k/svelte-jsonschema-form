import{o as e}from"./advanced-examples.BJ8ezNPI.js";import"./_commonjsHelpers.B51_3taw.js";import"./render.CCL00nPe.js";import"./definitions.CiLYYhRm.js";import"./snippet.CJxwJsVK.js";import"./shared.BNuLfSkC.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CN5cvKx0.js";/* empty css                                                       *//* empty css                                                                 */const s="daisyui5-starter",t="0.0.1",i="module",n={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},o={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.28.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",daisyui:"^5.1.10",svelte:"^5.38.1","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},c={"@sjsf/ajv8-validator":"^3.0.0-next.1","@sjsf/basic-theme":"^3.0.0-next.1","@sjsf/daisyui5-theme":"^3.0.0-next.1","@sjsf/form":"^3.0.0-next.1",ajv:"^8.17.1"},a={name:s,private:!0,version:t,type:i,scripts:n,devDependencies:o,dependencies:c},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,j={package:e(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{j as layer};
