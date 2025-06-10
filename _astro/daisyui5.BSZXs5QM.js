import{o as e}from"./advanced-examples.IZNo0kIA.js";import"./_commonjsHelpers.CfDrMh7n.js";import"./render.BlF0Lqgg.js";import"./function.Dj0BPgxZ.js";import"./shared.DYApavcE.js";import"./preload-helper.CndyEa7M.js";import"./buttons.C_VaYm4G.js";/* empty css                                                       *//* empty css                                                                 */const s="daisyui5-starter",t="0.0.1",i="module",c={dev:"vite dev",build:"vite build",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},o={"@sveltejs/adapter-auto":"^6.0.0","@sveltejs/kit":"^2.16.0","@sveltejs/vite-plugin-svelte":"^5.0.0","@tailwindcss/vite":"^4.0.0",daisyui:"^5.0.43",svelte:"^5.0.0","svelte-check":"^4.0.0",tailwindcss:"^4.0.0",typescript:"^5.0.0",vite:"^6.2.6"},n={"@sjsf/ajv8-validator":"^2.0.0","@sjsf/basic-theme":"^2.0.0","@sjsf/daisyui5-theme":"^2.0.0","@sjsf/form":"^2.0.0",ajv:"^8.17.1"},a={name:s,private:!0,version:t,type:i,scripts:c,devDependencies:o,dependencies:n},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,y={package:e(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{y as layer};
