# @sjsf-lab/svar-theme

The [SVAR](https://github.com/svar-widgets/core/) v2 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/svar/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf-lab/svar-theme
```

## Usage

1. Install SVAR v2

[Getting started | Svelte Code Documentation](https://docs.svar.dev/svelte/core/getting_started)

2. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf-lab/svar-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
