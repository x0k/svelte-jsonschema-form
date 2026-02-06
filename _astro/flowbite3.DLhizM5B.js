import{o as e}from"./advanced-examples.MJ9BEUSu.js";import"./each.BUIN7b2g.js";import"./render.B1sJ9xBI.js";import"./definitions.CSxasTmI.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.ByESBxjV.js";import"./shared.YksZCh-P.js";import"./preload-helper.BUFao3bW.js";import"./buttons.DQx2fdbW.js";/* empty css                                                       *//* empty css                                                                 */const o="flowbite3-starter",r="0.0.9",s="module",c={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},t={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.49.5","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/vite":"^4.1.11",flowbite:"^3.1.2","flowbite-svelte":"^1.18.0",svelte:"^5.46.4","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},n={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/flowbite3-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1"},i={name:o,private:!0,version:r,type:s,scripts:c,devDependencies:t,dependencies:n},a=`@import "tailwindcss";

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
