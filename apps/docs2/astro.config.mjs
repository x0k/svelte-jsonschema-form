// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import starlightLinksValidator from "starlight-links-validator";
import { visit } from "unist-util-visit";

const base = "/svelte-jsonschema-form/";

/**
 *
 * @param {string} base
 * @returns
 */
function remarkBasePath(base) {
  /**
   * @param {any} tree
   */
  return (tree) => {
    visit(tree, "link", (node) => {
      // Only modify internal links (starting with /)
      if (node.url && node.url.startsWith("/") && !node.url.startsWith(base)) {
        node.url = base + node.url.slice(1);
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  site: "https://x0k.github.io",
  base,
  trailingSlash: "always",
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  integrations: [
    svelte(),
    starlight({
      plugins: process.env.CHECK_LINKS ? [starlightLinksValidator()] : [],
      title: "svelte-jsonschema-form v3",
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
        { label: "Documentation v2", link: "/v2/" },
      ],
      components: {
        // Head: "./src/components/custom-head.astro",
        Header: "./src/components/header-with-links.astro",
        MarkdownContent: "./src/components/markdown-content.astro",
        PageTitle: "./src/components/page-title.astro",
      },
      customCss: ["./src/styles.css"],
    }),
  ],
  markdown: {
    remarkPlugins: [[remarkBasePath, base]],
  },
  vite: {
    optimizeDeps: {
      exclude: ["@jis3r/icons"],
      include: ["bits-ui"],
    },
    ssr: {
      noExternal: ["lucide-svelte", "zod"],
    },
    resolve: {
      dedupe: ["bits-ui"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        "#": fileURLToPath(new URL("../../packages", import.meta.url)),
        "%": fileURLToPath(new URL("../../examples", import.meta.url)),
        legacy: fileURLToPath(new URL("../../legacy", import.meta.url)),
        lab: fileURLToPath(new URL("../../lab", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
    },
  },
});
