# @sjsf-lab/beercss-theme

The [Beer CSS](https://github.com/beercss/beercss) v3 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/beercss/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf-lab/beercss-theme
```

## Usage

1. Install Beer CSS v3
  
[Get started](https://github.com/beercss/beercss?tab=readme-ov-file#get-started)

2. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf-lab/beercss-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
