# @sjsf/stdf-theme

The [STDF](https://github.com/any-tdf/stdf) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/stdf/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/stdf-theme
```

## Usage

```svelte
<script lang="ts">
  import { createForm3 } from '@sjsf/form';
  import { theme } from '@sjsf/stdf-theme';

  const form = createForm3({
    ...theme
  })
</script>
```

## License

MIT
