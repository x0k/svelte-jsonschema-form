# @sjsf/lucide-icons

The [lucide](https://github.com/lucide-icons/lucide) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/guides/labels-and-icons/#lucide-icons)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/form @sjsf/lucide-icons
```

## Usage

```svelte
<script lang="ts">
  import { useForm } from '@sjsf/form';
  import { icons } from '@sjsf/lucide-icons';

  const form = useForm({
    icons
  })
</script>
```

## License

MIT
