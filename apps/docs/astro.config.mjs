// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
	site: 'https://x0k.github.io',
	base: "/svelte-jsonschema-form/",
	trailingSlash: 'always',
	integrations: [
		svelte(),
		starlight({
			title: 'svelte-jsonschema-form',
			social: {
				github: 'https://github.com/x0k/svelte-jsonschema-form',
			},
			sidebar: [
				{
					label: "Concepts",
					autogenerate: { directory: "concepts" },
				}
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				// {
				// 	label: 'Reference',
				// 	autogenerate: { directory: 'reference' },
				// },
			],
		}),
	],
});
