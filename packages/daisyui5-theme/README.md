# @sjsf/daisyui5-theme

The [daisyui](https://github.com/saadeghi/daisyui) v5 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/daisyui/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/daisyui5-theme
```

## Usage

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf/daisyui5-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
