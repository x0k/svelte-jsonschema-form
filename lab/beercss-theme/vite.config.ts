import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig({
	plugins: [sveltekit()],
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
					setupFiles: ['vitest-browser-svelte'],
					// testTimeout: 1000,
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
