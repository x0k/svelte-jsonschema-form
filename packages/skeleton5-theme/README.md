# @sjsf/skeleton5-theme

The [skeleton](https://github.com/skeletonlabs/skeleton) v5 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/skeleton5/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf/skeleton5-theme
```

## Usage

1. Install Skeleton v5

[Install and configure Skeleton for Svelte](https://www.skeleton.dev/docs/svelte/get-started/installation)

2. Configuration

Register the theme source path by adding the following line to the `app.css` file:.

```css
@source "../node_modules/@sjsf/skeleton5-theme/dist";
```

3. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/skeleton5-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
