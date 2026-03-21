import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: [
			'flowbite-svelte/Button.svelte',
			'flowbite-svelte/Checkbox.svelte',
			'flowbite-svelte/Radio.svelte',
			'flowbite-svelte/Datepicker.svelte',
			'flowbite-svelte/Fileupload.svelte',
			'flowbite-svelte/Range.svelte',
			'flowbite-svelte/Textarea.svelte',
			'flowbite-svelte/Label.svelte',
			'flowbite-svelte/Input.svelte',
			'flowbite-svelte/ButtonGroup.svelte',
			'flowbite-svelte/Select.svelte',
			'flowbite-svelte/ButtonToggle.svelte',
			'flowbite-svelte/RadioButton.svelte',
			'flowbite-svelte/MultiSelect.svelte',
			'flowbite-svelte/Tags.svelte',
			'flowbite-svelte/Toggle.svelte',
			'flowbite-svelte/Helper.svelte'
		]
	},
	test: {
		projects: [
			{
				extends: './vite.config.ts',
				optimizeDeps: {
					exclude: ['theme-testing/demo']
				},
				test: {
					name: 'client',
					include: ['src/**/*.svelte.{test,spec}.{js,ts}', 'tests/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**'],
					// testTimeout: 1000,
					setupFiles: ['vitest-browser-svelte'],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [
							{
								browser: 'chromium'
							}
						]
					}
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
