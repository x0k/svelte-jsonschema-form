# @sjsf/shadcn4-theme

The [shadcn-svelte](https://github.com/huntabyte/shadcn-svelte) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/shadcn4/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form @sjsf/shadcn4-theme
```

## Usage

1. Install shadcn-svelte
  
    [Installation - shadcn-svelte](https://shadcn-svelte.com/docs/installation)

2. Configuration

    Register the theme source path by adding the following line to the `app.css` file:

    ```css
    @source "../node_modules/@sjsf/shadcn4-theme/dist";
    ```

3. Apply theme

    ```svelte
    <script lang="ts">
      import { createForm } from '@sjsf/form';
      import { theme, setThemeContext } from '@sjsf/shadcn4-theme';
      import * as components from '@sjsf/shadcn4-theme/new-york'

      const form = createForm({
        theme,
        ...
      })

      setThemeContext({ components })
    </script>
    ```

## License

MIT
