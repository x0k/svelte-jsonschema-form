# @sjsf/skeleton-theme

The [skeleton](https://github.com/skeletonlabs/skeleton) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/skeleton/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/skeleton-theme
```

## Usage

### Setup styles

There is two ways to setup styles:

1. Use tailwindcss config

```typescript
import { skeleton } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';
import forms from '@tailwindcss/forms'
import { THEME_CONTENT } from '@sjsf/skeleton-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT],
  plugins: [
    forms,
    skeleton({
      themes: [/* themes.something */],
    })
  ],
}
```

Or with a preset

```typescript
import themePreset from '@sjsf/skeleton-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [themePreset],
}
```

2. Inject prepared styles (not recommended)

```typescript
// Inject them as you like
import themeStyles from "@sjsf/skeleton-theme/styles.css?inline";
```

Bundled themes:

- `cerberus`
- `catppuccin`
- `pine`
- `rose`

### Apply theme

```svelte
<script lang="ts">
  import { createForm3 } from '@sjsf/form';
  import { theme } from '@sjsf/skeleton-theme';

  const form = createForm3({
    ...theme,
  })
</script>
```

## License

MIT
