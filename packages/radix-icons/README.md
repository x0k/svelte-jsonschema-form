# @sjsf/radix-icons

The [svelte-radix](https://github.com/shinokada/svelte-radix) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/guides/labels-and-icons/#radix-icons)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/radix-icons
```

## Usage

```svelte
<script lang="ts">
  import { createForm3 } from '@sjsf/form';
  import { icons } from '@sjsf/radix-icons';

  const form = createForm3({
    icons
  })
</script>
```

## License

MIT
