# @sjsf/moving-icons

The [jis3r/icons](https://github.com/jis3r/icons) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/guides/labels-and-icons/#moving-icons)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form @sjsf/moving-icons
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
