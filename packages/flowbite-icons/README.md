# @sjsf/flowbite-icons

The [flowbite-svelte-icons](https://github.com/themesberg/flowbite-svelte-icons) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/guides/labels-and-icons/#usage)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/flowbite-icons@next
```

## Usage

1. Install Flowbite Svelte Icons

[Flowbite Svelte Icons - Flowbite](https://flowbite-svelte.com/icons/quickstart)

2. Configuration

Register the theme source path by adding the following line to the `app.css` file:.

```css
@source "../node_modules/@sjsf/flowbite-icons/dist";
```

3. Apply icons

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { icons } from '@sjsf/flowbite-icons';

  const form = createForm({
    icons,
    ...
  })
</script>
```

## License

MIT
