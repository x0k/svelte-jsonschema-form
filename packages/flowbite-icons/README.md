# @sjsf/flowbite-icons

The [flowbite-svelte-icons](https://github.com/themesberg/flowbite-svelte-icons) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/guides/labels-and-icons/#usage)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/flowbite-icons@next
```

## Usage

### Setup styles

There is two ways to setup styles:

1. Use tailwindcss config

```typescript
import { FLOWBITE_ICONS_CONTENT } from '@sjsf/flowbite-icons/preset'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}', FLOWBITE_ICONS_CONTENT],
}
```

Or with a preset

```typescript
import iconsPreset from '@sjsf/flowbite-icons/preset'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [iconsPreset],
}
```

2. Inject prepared styles (not recommended)

```typescript
// Inject them as you like
import flowbiteIconsStyles from "@sjsf/flowbite-icons/styles.css?inline";
```

### Apply icons

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { icons } from '@sjsf/flowbite-icons';

  const form = createForm3({
    icons,
    ...
  })
</script>
```

## License

MIT
