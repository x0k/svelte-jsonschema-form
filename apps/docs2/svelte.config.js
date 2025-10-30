import { vitePreprocess } from "@astrojs/svelte";

const injectedCss = ["@jis3r/icons", "basic"];
const nonRunic = [
  "svelte-json-tree",
  "flowbite-svelte@0.47",
  "svelte-tel-input",
];

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      return {
        runes: !nonRunic.some((p) => filename.includes(p)),
        css: injectedCss.some((i) => filename.includes(i))
          ? "injected"
          : "external",
      };
    },
  },
};
