# @sjsf/svar-theme

The [SVAR](https://github.com/svar-widgets/core) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/svar/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/svar-theme
```

## Usage

### Apply theme

```svelte
<script lang="ts">
  import { useForm2 } from '@sjsf/form';
  import { theme } from '@sjsf/svar-theme';

  const form = useForm2({
    ...theme
  })
</script>
```

## License

MIT
