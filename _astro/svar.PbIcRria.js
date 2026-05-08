import{a as e}from"./layer.B9jc2o7G.js";var t={package:e({name:`svar-starter`,private:!0,version:`0.0.16`,type:`module`,scripts:{dev:`vite dev`,preview:`vite preview`,prepare:`svelte-kit sync || echo ''`,check:`svelte-kit sync && svelte-check --tsconfig ./tsconfig.json`,"check:watch":`svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch`},devDependencies:{"@sveltejs/adapter-auto":`^6.1.0`,"@sveltejs/kit":`^2.49.5`,"@sveltejs/vite-plugin-svelte":`^6.1.2`,svelte:`^5.46.4`,"svelte-check":`^4.3.1`,typescript:`^5.9.2`,vite:`^7.1.2`},dependencies:{"@sjsf/ajv8-validator":`workspace:*`,"@sjsf/form":`workspace:*`,"@sjsf-lab/svar-theme":`workspace:*`,"@svar-ui/svelte-core":`^2.3.1`,ajv:`^8.17.1`}}),formDefaults:{theme:`svar`},files:{"src/routes/+layout.svelte":`<script lang="ts">
	import { Willow } from '@svar-ui/svelte-core'

	let { children } = $props();
<\/script>

<Willow>
	{@render children()}
</Willow>
`}};export{t as layer};