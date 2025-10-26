# @sjsf/skeleton4-theme

The [skeleton](https://github.com/skeletonlabs/skeleton) v4 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/skeleton4/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form @sjsf/skeleton4-theme
```

## Usage

1. Install Skeleton v4

[Install and configure Skeleton for SvelteKit](https://www.skeleton.dev/docs/get-started/installation/sveltekit)

2. Configuration

Register the theme source path by adding the following line to the `app.css` file:.

```css
@source "../node_modules/@sjsf/skeleton4-theme/dist";
```

3. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/skeleton4-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
