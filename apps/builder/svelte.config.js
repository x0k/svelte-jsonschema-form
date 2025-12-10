import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const injectedCss = ['@jis3r/icons', 'svar', 'svelte-sonner', 'beercss'];

export default {
	// Consult https://svelte.dev/docs#compile-time-svelte-preprocess
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	vitePlugin: {
		dynamicCompileOptions({ filename }) {
			return {
				runes: true,
				css: injectedCss.some((i) => filename.includes(i)) ? 'injected' : 'external'
			};
		}
	}
};
