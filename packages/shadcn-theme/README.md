# @sjsf/shadcn-theme

The [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/themes/shadcn/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/shadcn-theme@next
```

## Usage

### Setup styles

There is two ways to setup styles:

1. Use tailwindcss config

```typescript
import { THEME_CONTENT } from '@sjsf/shadcn-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT],
}
```

Or with a preset

```typescript
import themePreset from '@sjsf/shadcn-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [themePreset],
}
```

2. Inject prepared styles (not recommended)

```typescript
// Inject them as you like
import themeStyles from "@sjsf/shadcn-theme/styles.css?inline";
```

### Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme, setThemeContext } from '@sjsf/shadcn-theme';
  import { components } from '@sjsf/shadcn-theme/default'

  const form = createForm({
    theme,
    ...
  })

  setThemeContext({ components })
</script>
```

## License

MIT
