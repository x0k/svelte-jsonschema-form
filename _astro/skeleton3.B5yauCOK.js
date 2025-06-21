import{o as e}from"./advanced-examples.PQ4MR1-h.js";import"./_commonjsHelpers.kZ6zyXPC.js";import"./render.CPvwW41j.js";import"./function.BgD17R24.js";import"./shared.B94wPLP6.js";import"./preload-helper.CndyEa7M.js";import"./buttons.DK-q0OXN.js";/* empty css                                                       *//* empty css                                                                 */const t="skeleton3-starter",s="0.0.1",n="module",o={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},i={"@skeletonlabs/skeleton":"^3.1.3","@skeletonlabs/skeleton-svelte":"^1.2.3","@sveltejs/adapter-auto":"^6.0.0","@sveltejs/kit":"^2.16.0","@sveltejs/vite-plugin-svelte":"^5.0.0","@tailwindcss/forms":"^0.5.10","@tailwindcss/vite":"^4.0.0",svelte:"^5.33.0","svelte-check":"^4.0.0",tailwindcss:"^4.0.0",typescript:"^5.0.0",vite:"^6.2.6"},l={"@sjsf/ajv8-validator":"^2.0.0","@sjsf/basic-theme":"^2.0.0","@sjsf/form":"^2.0.0","@sjsf/skeleton3-theme":"^2.0.0",ajv:"^8.17.1"},a={name:t,private:!0,version:s,type:n,scripts:o,devDependencies:i,dependencies:l},c=`@import "tailwindcss";

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
`,y={package:e(a),formDefaults:{theme:"skeleton3"},files:{"src/app.css":c,"src/app.html":r}};export{y as layer};
