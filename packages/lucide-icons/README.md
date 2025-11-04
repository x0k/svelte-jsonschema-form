# @sjsf/lucide-icons

The [lucide](https://github.com/lucide-icons/lucide) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/guides/labels-and-icons/#usage)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf/lucide-icons
```

## Usage

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { icons } from '@sjsf/lucide-icons';

  const form = createForm({
    icons,
    ...
  })
</script>
```

## License

MIT
