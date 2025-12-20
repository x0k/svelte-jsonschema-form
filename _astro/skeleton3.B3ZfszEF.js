import{o as e}from"./advanced-examples.C2pVl4J8.js";import"./each.DA8Iz3oH.js";import"./render.DgIpg5f0.js";import"./definitions.B_Fnfyhh.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.ClxrbVWC.js";import"./shared.DBy_6Hme.js";import"./preload-helper.BUFao3bW.js";import"./buttons.By8qtqJP.js";/* empty css                                                       *//* empty css                                                                 */const t="skeleton3-starter",s="0.0.8",n="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},i={"@skeletonlabs/skeleton":"^3.2.0","@skeletonlabs/skeleton-svelte":"^1.5.1","@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2","@tailwindcss/forms":"^0.5.10","@tailwindcss/vite":"^4.1.11",svelte:"^5.34.8","svelte-check":"^4.3.1",tailwindcss:"^4.1.11",typescript:"^5.9.2",vite:"^7.1.2"},l={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/form":"workspace:*","@sjsf/skeleton3-theme":"workspace:*",ajv:"^8.17.1"},a={name:t,private:!0,version:s,type:n,scripts:o,devDependencies:i,dependencies:l},c=`@import "tailwindcss";

/* Workaround for StackBlitz, use @source in production */
@import "@sjsf/skeleton3-theme/styles.css";
/* @source "../node_modules/@sjsf/skeleton3-theme/dist"; */

@plugin '@tailwindcss/forms';

@import "@skeletonlabs/skeleton";
@import "@skeletonlabs/skeleton/optional/presets";
@import "@skeletonlabs/skeleton/themes/cerberus";

@source '../node_modules/@skeletonlabs/skeleton-svelte/dist';

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
`,b={package:e(a),formDefaults:{theme:"skeleton3"},files:{"src/app.css":c,"src/app.html":r}};export{b as layer};
