import type { Config } from 'tailwindcss';
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import forms from '@tailwindcss/forms';

export const APP_CONTENT = './src/**/*.{html,js,svelte,ts}';
export const THEME_CONTENT = './node_modules/@sjsf/skeleton-theme/dist/**/*.{html,js,svelte,ts}';

export default {
	content: [APP_CONTENT, THEME_CONTENT],
	plugins: [
		forms,
		skeleton({
			themes: Object.values(themes)
		})
	]
} satisfies Config;
