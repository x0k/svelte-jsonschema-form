import type { Config } from 'tailwindcss';
import twAnimate from 'tailwindcss-animate';

export const APP_CONTENT = './src/**/*.{html,js,svelte,ts}';
export const THEME_CONTENT = './node_modules/@sjsf/shadcn-theme/dist/**/*.{html,js,svelte,ts}';

export default {
	content: [APP_CONTENT, THEME_CONTENT],
	plugins: [twAnimate]
} satisfies Config;
