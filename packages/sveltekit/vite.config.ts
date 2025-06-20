import { resolve } from 'node:path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  test: {
    projects: [
      {
        // Client-side tests (Svelte components)
        extends: './vite.config.ts',
        test: {
          name: 'client',
          environment: 'browser',
          include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
          exclude: ['src/lib/server/**'],
          setupFiles: ['vitest-browser-svelte'],
          browser: {
            enabled: true,
            provider: 'playwright',
            headless: true,
            instances: [{ browser: 'chromium' }]
          }
        }
      },
      {
        // SSR tests (Server-side rendering)
        extends: './vite.config.ts',
        test: {
          name: 'ssr',
          environment: 'node',
          include: ['src/**/*.ssr.{test,spec}.{js,ts}'],
          alias: {
            '$app/state': resolve('./mocks/app-state.ts')
          }
        }
      },
      {
        // Server-side tests (Node.js utilities)
        extends: './vite.config.ts',
        test: {
          name: 'server',
          environment: 'node',
          include: ['src/**/*.{test,spec}.{js,ts}'],
          exclude: ['src/**/*.svelte.{test,spec}.{js,ts}', 'src/**/*.ssr.{test,spec}.{js,ts}']
        }
      }
    ]
  }
});
