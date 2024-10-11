# @sjsf/daisyui-theme

The daisyui based theme for @sjsf/form

## Installation

```shell
npm install @sjsf/form @sjsf/daisyui-theme
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
import daisyStyles from "@sjsf/daisyui-theme/styles.css?inline";
```

### Apply theme

```svelte
<script lang="ts">
  import { Form } from '@sjsf/form';
  import { theme } from '@sjsf/daisyui-theme';
</script>

<Form {...theme} />
```

## License

MIT
