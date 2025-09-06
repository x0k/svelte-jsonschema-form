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
            "data-goatcounter": "https://sjsf.counter.x0k.dev/count",
            async: true,
            src: "https://sjsf.counter.x0k.dev/count.js",
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
          collapsed: true,
        },
        {
          label: "Examples",
          autogenerate: { directory: "examples" },
        },
        // {
        //   label: "Examples",
        //   autogenerate: { directory: "examples" },
        //   collapsed: true
        // },
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
        { label: "Documentation v1", link: "/v1/" },
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
    optimizeDeps: {
      exclude: ["@jis3r/icons"],
    },
    ssr: {
      noExternal: ["lucide-svelte"],
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("../../packages", import.meta.url)),
        "%": fileURLToPath(new URL("../../examples", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
    },
  },
});
