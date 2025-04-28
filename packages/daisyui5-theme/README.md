# @sjsf/daisyui5-theme

The [daisyUI](https://github.com/saadeghi/daisyui) v5 based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/v2/themes/daisyui5/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form@next @sjsf/daisyui5-theme@next
```

## Usage

1. Install daisyUI v5

[Install daisyUI as a Tailwind plugin](https://daisyui.com/docs/install/)

2. Configuration

Register the theme source path by adding a line like this to the `app.css` file.

`@source "../node_modules/@sjsf/daisyui5-theme/dist";`

3. Apply theme

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
