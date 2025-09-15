import{o as e}from"./advanced-examples.Bs48wYtA.js";import"./_commonjsHelpers.1dJQk7Uh.js";import"./render.BOyS7vMO.js";import"./array.6cJ3IzYY.js";import"./shared.FzfvnCJP.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.DM71PsmC.js";/* empty css                                                       *//* empty css                                                                 */const s="daisyui5-starter",t="0.0.1",i="module",n={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.28.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",daisyui:"^5.1.10",svelte:"^5.38.1","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},o={"@sjsf/ajv8-validator":"^3.0.0-next.0","@sjsf/basic-theme":"^3.0.0-next.0","@sjsf/daisyui5-theme":"^3.0.0-next.0","@sjsf/form":"^3.0.0-next.0",ajv:"^8.17.1"},a={name:s,private:!0,version:t,type:i,scripts:n,devDependencies:c,dependencies:o},r=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/daisyui5-theme/styles.css";
/* @source "../node_modules/@sjsf/daisyui5-theme/dist"; */

@plugin "daisyui";

html {
  padding: 2rem;
}
`,y={package:e(a),formDefaults:{theme:"daisyui5"},files:{"src/app.css":r}};export{y as layer};
