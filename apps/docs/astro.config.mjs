// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte'

// https://astro.build/config
export default defineConfig({
	site: 'https://x0k.github.io',
	base: "/svelte-jsonschema-form/",
	integrations: [
		svelte(),
		starlight({
			title: 'SJSF Docs',
			social: {
				github: 'https://github.com/x0k/svelte-jsonschema-form',
			},
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
