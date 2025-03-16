import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

const nonRunic = ["lucide-svelte", "flowbite-theme", "flowbite-svelte"];

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
