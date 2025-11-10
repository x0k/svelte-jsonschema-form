import{o as e}from"./advanced-examples.BhxVcp9S.js";import"./each.DT3TJ4y6.js";import"./render.C6bdgTYX.js";import"./definitions.DS7POIPg.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.B6yIEHbF.js";import"./shared.0qjUl5wn.js";import"./preload-helper.BUFao3bW.js";import"./buttons.B3VYvRBE.js";/* empty css                                                       *//* empty css                                                                 */const t="svar-starter",s="0.0.2",o="module",r={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},c={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",svelte:"^5.30.0","svelte-check":"^4.3.1",typescript:"^5.9.2",vite:"^7.1.2"},i={"@sjsf/ajv8-validator":"workspace:*","@sjsf/form":"workspace:*","@sjsf-lab/svar-theme":"workspace:*","@svar-ui/svelte-core":"^2.3.1",ajv:"^8.17.1"},n={name:t,private:!0,version:s,type:o,scripts:r,devDependencies:c,dependencies:i},a=`<script lang="ts">
	import { Willow } from '@svar-ui/svelte-core'

	let { children } = $props();
<\/script>

<Willow>
	{@render children()}
</Willow>
`,g={package:e(n),formDefaults:{theme:"svar"},files:{"src/routes/+layout.svelte":a}};export{g as layer};
