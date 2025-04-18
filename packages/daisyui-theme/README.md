# @sjsf/daisyui-theme

The [daisyui](https://github.com/saadeghi/daisyui) v4 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/themes/daisyui/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/daisyui-theme@next
```

## Usage

### Setup styles

There is two ways to setup styles:

1. Use tailwindcss config

```typescript
import daisyui from 'daisyui';
import { THEME_CONTENT } from '@sjsf/daisyui-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT],
  plugins: [daisyui],
}
```

Or with a preset

```typescript
import themePreset from '@sjsf/daisyui-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [themePreset],
}
```

2. Inject prepared styles (not recommended)

```typescript
// Inject them as you like
import themeStyles from "@sjsf/daisyui-theme/styles.css?inline";
```

### Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/daisyui-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
