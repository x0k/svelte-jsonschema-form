import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const injectedCss = ["moving-icons", "basic"];

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      return {
        // runes: !nonRunic.some((p) => filename.includes(p)),
        css: injectedCss.some((i) => filename.includes(i))
          ? "injected"
          : "external",
      };
    },
  },
};

