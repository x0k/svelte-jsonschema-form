# @sjsf/moving-icons

The [jis3r/icons](https://github.com/jis3r/icons) based icons set for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/guides/labels-and-icons/#usage)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/moving-icons@next
```

## Usage

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { icons } from '@sjsf/moving-icons';

  const form = createForm({
    icons,
    ...
  })
</script>
```

## License

MIT
