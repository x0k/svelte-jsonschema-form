// @ts-check
import { fileURLToPath } from "node:url";
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import svelte from "@astrojs/svelte";
import starlightLinksValidator from "starlight-links-validator";
import { visit } from "unist-util-visit";
import starlightLlmsTxt from "starlight-llms-txt";

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
      // favicon: "src/assets/logo.svg",
      plugins: [
        starlightLlmsTxt({
          rawContent: true,
          exclude: ["404", "changelogs/**", "examples/**"],
        }),
      ].concat(process.env.CHECK_LINKS ? [starlightLinksValidator()] : []),
      title: "svelte-jsonschema-form v3",
      // logo: {
      //   src: "./src/assets/logo.svg",
      // },
      social: [
        {
          icon: "discord",
          href: "https://discord.gg/hVxFWk7dRn",
          label: "Discord",
        },
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
          items: [{ autogenerate: { directory: "guides" } }],
        },
        {
          label: "Form",
          collapsed: true,
          items: [
            {
              autogenerate: { directory: "form" },
            },
          ],
        },
        {
          label: "Examples",
          items: [{ autogenerate: { directory: "examples" } }],
        },
        {
          label: "Themes",
          items: [{ autogenerate: { directory: "themes" } }],
        },
        {
          label: "Validators",
          items: [{ autogenerate: { directory: "validators" } }],
        },
        {
          label: "Integrations",
          items: [{ autogenerate: { directory: "integrations" } }],
        },
        {
          label: "Misc",
          items: [{ autogenerate: { directory: "misc" } }],
        },
        {
          label: "Changelogs",
          collapsed: true,
          items: [{ autogenerate: { directory: "changelogs" } }],
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
    // https://github.com/withastro/astro/issues/16636#issue-4397624688
    // NOTE: astro@@7.0.0-alpha.0 also has an issue with missing CSS
    // plugins: [
    //   {
    //     name: "fix-rolldown-esbuild-compat",
    //     enforce: "pre",
    //     configResolved(config) {
    //       if (config.optimizeDeps?.esbuildOptions?.plugins) {
    //         config.optimizeDeps.esbuildOptions.plugins = [];
    //       }
    //     },
    //   },
    // ],
    optimizeDeps: {
      exclude: ["@jis3r/icons"],
      include: ["bits-ui"],
    },
    resolve: {
      dedupe: ["bits-ui"],
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
        examples: fileURLToPath(new URL("../../examples", import.meta.url)),
        pkgs: fileURLToPath(new URL("../../packages", import.meta.url)),
        legacy: fileURLToPath(new URL("../../legacy", import.meta.url)),
        lab: fileURLToPath(new URL("../../lab", import.meta.url)),
        apps: fileURLToPath(new URL("..", import.meta.url)),
      },
      noExternal: [
        "@lucide/svelte",
        "bits-ui",
        "runed",
        "svelte-toolbelt",
        "@skeletonlabs/skeleton-svelte",
      ],
    },
  },
});
