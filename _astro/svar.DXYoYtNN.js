import{o as e}from"./advanced-examples.CbZWAo8m.js";import"./each.CM-BqqBf.js";import"./render.DykPNJzl.js";import"./definitions.GIk6hNxb.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.D6WKkRst.js";import"./shared.CfWxv_8V.js";import"./preload-helper.BUFao3bW.js";import"./buttons.CYAabvSD.js";/* empty css                                                       *//* empty css                                                                 */const t="svar-starter",s="0.0.8",o="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.34.8","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},i={"@sjsf/ajv8-validator":"workspace:*","@sjsf/form":"workspace:*","@sjsf-lab/svar-theme":"workspace:*","@svar-ui/svelte-core":"^2.3.1",ajv:"^8.17.1"},n={name:t,private:!0,version:s,type:o,scripts:r,devDependencies:c,dependencies:i},a=`<script lang="ts">
	import { Willow } from '@svar-ui/svelte-core'

	let { children } = $props();
<\/script>

<Willow>
	{@render children()}
</Willow>
`,g={package:e(n),formDefaults:{theme:"svar"},files:{"src/routes/+layout.svelte":a}};export{g as layer};
