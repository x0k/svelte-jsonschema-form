# @sjsf-lab/stdf-theme

The [STDF](https://github.com/PDFLeaves/stdf) v3 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/stdf/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf-lab/stdf-theme
```

## Usage

1. Install STDF v3 and Tailwind CSS v4

[Getting started | STDF](https://stdf.design/assets/guide/use/)

2. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf-lab/stdf-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
