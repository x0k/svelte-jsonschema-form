import{o as e}from"./advanced-examples.C1bghBDT.js";import"./each.DVoDcEZv.js";import"./render.xW19JsgD.js";import"./definitions.Aq_eQFNs.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BQCjbj1G.js";import"./shared.BhbJHov2.js";import"./preload-helper.BUFao3bW.js";import"./buttons.skHEXVUo.js";/* empty css                                                       *//* empty css                                                                 */const t="skeleton4-starter",s="0.0.2",n="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},i={"@skeletonlabs/skeleton":"^4.1.5","@skeletonlabs/skeleton-svelte":"^4.1.5","@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/forms":"^0.5.10","@tailwindcss/vite":"^4.1.11",svelte:"^5.30.0","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},l={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/form":"workspace:*","@sjsf/skeleton4-theme":"workspace:*",ajv:"^8.17.1"},a={name:t,private:!0,version:s,type:n,scripts:o,devDependencies:i,dependencies:l},c=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/skeleton4-theme/styles.css";
/* @source "../node_modules/@sjsf/skeleton4-theme/dist"; */

@plugin '@tailwindcss/forms';

@import '@skeletonlabs/skeleton';
@import '@skeletonlabs/skeleton-svelte';
@import '@skeletonlabs/skeleton/themes/cerberus';

html {
  padding: 2rem;
}
`,r=`<!doctype html>
<html lang="en" data-theme="cerberus">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
`,g={package:e(a),formDefaults:{theme:"skeleton4"},files:{"src/app.css":c,"src/app.html":r}};export{g as layer};
