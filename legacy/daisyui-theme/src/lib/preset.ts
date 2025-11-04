import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

export const APP_CONTENT = './src/**/*.{html,js,svelte,ts}';
export const THEME_CONTENT = './node_modules/@sjsf/daisyui-theme/dist/**/*.{html,js,svelte,ts}';

export default {
	content: [
		APP_CONTENT,
		THEME_CONTENT,
	],
	// @ts-expect-error plugin
	plugins: [daisyui]
} satisfies Config;
