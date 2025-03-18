// @ts-check
import { fileURLToPath } from "node:url";
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
    locales: ["en"],
  },
  integrations: [
    svelte(),
    starlight({
      title: "svelte-jsonschema-form",
      social: {
        github: "https://github.com/x0k/svelte-jsonschema-form",
      },
      head: [
        {
          tag: "script",
          attrs: {
            "data-goatcounter": "https://sjsf.counter.x0k.online/count",
            async: true,
            src: "https://sjsf.counter.x0k.online/count.js",
          },
        },
      ],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Themes",
          autogenerate: { directory: "themes" },
        },
        {
          label: "Validators",
          autogenerate: { directory: "validators" },
        },
        {
          label: "Integrations",
          autogenerate: { directory: "integrations" },
        },
        {
          label: "Advanced scenarios",
          autogenerate: { directory: "advanced" },
        },
        {
          label: "Migration guides",
          autogenerate: { directory: "migration-guides" },
        },
        {
          label: "API Reference",
          autogenerate: { directory: "api-reference" },
        },
        {
          label: "Changelogs",
          autogenerate: { directory: "changelogs" },
        },
      ],
      components: {
        Head: "./src/components/custom-head.astro",
        Header: "./src/components/header-with-links.astro",
      },
    }),
  ],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("../../packages", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
    },
  },
});
