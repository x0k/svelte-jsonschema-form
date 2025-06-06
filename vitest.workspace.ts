import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/form/vite.config.ts",
  "./packages/ajv8-validator/vitest.config.ts",
  "./packages/schemasafe-validator/vitest.config.ts",
  "./packages/sveltekit/vite.config.ts",
  "./packages/shadcn4-theme/vite.config.ts",
  "./packages/skeleton3-theme/vite.config.ts",
  "./packages/flowbite-icons/vite.config.ts",
  "./packages/lucide-icons/vite.config.ts",
  "./packages/testing/vite.config.ts",
  "./packages/flowbite3-theme/vite.config.ts",
  "./packages/radix-icons/vite.config.ts",
  "./packages/basic-theme/vite.config.ts",
  "./packages/moving-icons/vite.config.ts"
])
