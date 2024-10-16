import type { Config } from 'tailwindcss';

export const APP_CONTENT = './src/**/*.{html,js,svelte,ts}';
export const FLOWBITE_ICONS_CONTENT =
	'./node_modules/flowbite-svelte-icons/**/*.{html,js,svelte,ts}';

export default {
	content: [APP_CONTENT, FLOWBITE_ICONS_CONTENT]
} satisfies Config;
