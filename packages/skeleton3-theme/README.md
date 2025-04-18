# @sjsf/skeleton3-theme

The [skeleton](https://github.com/skeletonlabs/skeleton) v3 (tailwind v4) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/themes/skeleton3/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/skeleton3-theme@next
```

## Usage

1. Install Skeleton v3

[Install and configure Skeleton for SvelteKit](https://www.skeleton.dev/docs/get-started/installation/sveltekit)

2. Configuration

Register the theme source path by adding a line like this to the `app.css` file.

`@source "../node_modules/@sjsf/skeleton3-theme/dist";`

3. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/skeleton3-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
