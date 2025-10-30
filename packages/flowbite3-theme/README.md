# @sjsf/flowbite3-theme

The [flowbite-svelte](https://github.com/themesberg/flowbite-svelte) (tailwind v4) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/flowbite3/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf/flowbite3-theme
```

## Usage

1. Install Flowbite Svelte
  
[Flowbite Svelte - UI Component Library](https://next.flowbite-svelte.com/docs/pages/introduction)

2. Configuration

Register the theme source path by adding the following line to the `app.css` file:.

```css
@source "../node_modules/@sjsf/flowbite3-theme/dist";
```

3. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/flowbite3-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
