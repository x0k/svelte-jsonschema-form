// @ts-check
import { fileURLToPath } from 'node:url'
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://x0k.github.io",
  base: "/svelte-jsonschema-form/",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ru"],
  },
  integrations: [
    svelte(),
    starlight({
      title: "svelte-jsonschema-form",
      social: {
        github: "https://github.com/x0k/svelte-jsonschema-form",
      },
      sidebar: [
        {
          label: "Concepts",
          autogenerate: { directory: "concepts" },
        },
        {
          label: "Customization",
          autogenerate: { directory: "customization" },
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
      components: {
        Header: "./src/components/header-with-links.astro",
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
});
