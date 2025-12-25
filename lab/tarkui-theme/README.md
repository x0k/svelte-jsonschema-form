# @sjsf-lab/tarkui-theme

The [Tark UI](https://github.com/anubra266/tarkui) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/tarkui/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf-lab/tarkui-theme
```

## Usage

1. Install Tark UI

2. Configuration

Register the theme source path by adding the following line to the `app.css` file:.

```css
@source "../node_modules/@sjsf-lab/tarkui-theme/dist";
```

3. Apply theme

```svelte
<script lang="ts">
  import { createForm } from '@sjsf/form';
  import { theme } from '@sjsf-lab/tarkui-theme';

  const form = createForm({
    theme,
    ...
  })
</script>
```

## License

MIT
