import{o as e}from"./advanced-examples.BvpnrlTr.js";import"./each.DZUfzelB.js";import"./render.CJwKJGH6.js";import"./definitions.CPQ9QYPQ.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.CK4VtKGA.js";import"./shared.DJp6FAJC.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.ggeJJmCm.js";/* empty css                                                       *//* empty css                                                                 */const o="flowbite3-starter",r="0.0.1",t="module",s={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},n={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",flowbite:"^3.1.2","flowbite-svelte":"^1.18.0",svelte:"^5.41.0","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},c={"@sjsf/ajv8-validator":"^3.0.0-next.9","@sjsf/basic-theme":"^3.0.0-next.9","@sjsf/flowbite3-theme":"^3.0.0-next.9","@sjsf/form":"^3.0.0-next.9",ajv:"^8.17.1"},i={name:o,private:!0,version:r,type:t,scripts:s,devDependencies:n,dependencies:c},a=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/flowbite3-theme/styles.css";
/* @source "../node_modules/@sjsf/flowbite3-theme/dist"; */

@plugin 'flowbite/plugin';

@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-primary-50: #fff5f2;
  --color-primary-100: #fff1ee;
  --color-primary-200: #ffe4de;
  --color-primary-300: #ffd5cc;
  --color-primary-400: #ffbcad;
  --color-primary-500: #fe795d;
  --color-primary-600: #ef562f;
  --color-primary-700: #eb4f27;
  --color-primary-800: #cc4522;
  --color-primary-900: #a5371b;

  --color-secondary-50: #f0f9ff;
  --color-secondary-100: #e0f2fe;
  --color-secondary-200: #bae6fd;
  --color-secondary-300: #7dd3fc;
  --color-secondary-400: #38bdf8;
  --color-secondary-500: #0ea5e9;
  --color-secondary-600: #0284c7;
  --color-secondary-700: #0369a1;
  --color-secondary-800: #075985;
  --color-secondary-900: #0c4a6e;
}

@source "../node_modules/flowbite-svelte/dist";

html {
  padding: 2rem;
}
`,b={package:e(i),formDefaults:{theme:"flowbite3"},files:{"src/app.css":a}};export{b as layer};
