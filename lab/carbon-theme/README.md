# @sjsf-lab/carbon-theme

The [Carbon Components Svelte](https://github.com/carbon-design-system/carbon-components-svelte) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/carbon-components/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf-lab/carbon-theme
```

## Usage

1. Install Carbon Components Svelte

[Carbon Components Svelte](https://svelte.carbondesignsystem.com/)

2. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf-lab/carbon-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
