# @sjsf-lab/shadcn-extras-theme

The [shadcn-svelte-extras](https://github.com/ieedan/shadcn-svelte-extras) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/lab/shadcn-extras/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/form @sjsf/shadcn4-theme @sjsf-lab/shadcn-extras-theme
```

## Usage

1. Install shadcn-svelte

   [Installation - shadcn-svelte](https://shadcn-svelte.com/docs/installation)

2. Configuration

   Register the theme source path by adding the following line to the `app.css` file:

   ```css
   @source "../node_modules/@sjsf/shadcn4-theme/dist";
   @source "../node_modules/@sjsf-lab/shadcn-extras-theme/dist";
   ```

3. Apply theme

   ```svelte
   <script lang="ts">
     import { createForm } from '@sjsf/form';
     import { setThemeContext } from '@sjsf/shadcn4-theme';
     import { theme } from '@sjsf-lab/shadcn-extras-theme';
     import * as components from '@sjsf/shadcn4-theme/new-york';
     import * as extraComponents from '@sjsf-lab/shadcn-extras-theme/ui';

     const form = createForm({
       theme,
       ...
     })

     setThemeContext({ components: { ...components, ...extraComponents } })
   </script>
   ```

## License

MIT
