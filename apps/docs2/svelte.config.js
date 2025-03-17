import { vitePreprocess } from "@astrojs/svelte";

const nonRunic = [
  "lucide-svelte",
  "flowbite-svelte/",
  "svelte-json-tree",
];

export default {
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      return {
        runes: !nonRunic.some((p) => filename.includes(p)),
        css: filename.includes("moving-icons") ? "injected" : "external",
      };
    },
  },
};
