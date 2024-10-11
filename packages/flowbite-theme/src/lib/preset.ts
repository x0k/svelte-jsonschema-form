import type { Config } from 'tailwindcss';
import flowbite from 'flowbite/plugin';

export const APP_CONTENT = './src/**/*.{html,js,svelte,ts}';
export const FLOWBITE_CONTENT = './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}';
export const FLOWBITE_ICONS_CONTENT =
	'"./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}",';
export const THEME_CONTENT = './node_modules/@sjsf/flowbite-theme/dist/**/*.{html,js,svelte,ts}';

export default {
	content: [APP_CONTENT, FLOWBITE_CONTENT, FLOWBITE_ICONS_CONTENT, THEME_CONTENT],
	plugins: [flowbite]
} satisfies Config;
