// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://x0k.github.io",
  base: "/svelte-jsonschema-form/v2/",
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  integrations: [
    svelte(),
    starlight({
      title: "svelte-jsonschema-form",
      social: [
        {
          icon: "github",
          href: "https://github.com/x0k/svelte-jsonschema-form",
          label: "GitHub",
        },
      ],
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
          label: "Form",
          autogenerate: { directory: "form" },
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
          label: "Misc",
          autogenerate: { directory: "misc" },
        },
        {
          label: "Changelogs",
          autogenerate: { directory: "changelogs" },
          collapsed: true,
        },
      ],
      components: {
        // Head: "./src/components/custom-head.astro",
        Header: "./src/components/header-with-links.astro",
        MarkdownContent: "./src/components/markdown-content.astro",
      },
      customCss: ["./src/styles.css"],
    }),
  ],
  vite: {
    // optimizeDeps: {
    //   exclude: ['flowbite-svelte-icons']
    // },
    ssr: {
      noExternal: ["lucide-svelte"],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("../../packages", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
    },
  },
});
