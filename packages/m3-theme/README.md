# @sjsf/m3-theme

The [m3-svelte](https://github.com/KTibow/m3-svelte) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/m3/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation
  
```shell
npm install @sjsf/form @sjsf/m3-theme
```

## Usage

```svelte
<script lang="ts">
  import { useForm2 } from '@sjsf/form';
  import { theme } from '@sjsf/m3-theme';

  const form = useForm2({
    ...theme
  })
</script>
```

## License

MIT
