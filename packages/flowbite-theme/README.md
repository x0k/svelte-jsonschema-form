# @sjsf/flowbite-theme

The [flowbite-svelte](https://github.com/themesberg/flowbite-svelte) (tailwind v3) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/flowbite/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form @sjsf/flowbite-theme
```

## Usage

### Setup styles

There is two ways to setup styles:

1. Use tailwindcss config

```typescript
import flowbite from 'flowbite/plugin';
import { THEME_CONTENT, FLOWBITE_CONTENT } from '@sjsf/flowbite-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT, FLOWBITE_CONTENT],
  plugins: [flowbite],
}
```

Or with a preset

```typescript
import themePreset from '@sjsf/flowbite-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [themePreset],
}
```

2. Inject prepared styles (not recommended)

```typescript
// Inject them as you like
import themeStyles from "@sjsf/flowbite-theme/styles.css?inline";
```

### Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/flowbite-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
