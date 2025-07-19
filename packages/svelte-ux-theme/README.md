# @sjsf/svelte-ux-theme

The [svelte-ux](https://github.com/techniq/svelte-ux) based theme for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/themes/svelte-ux/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/form @sjsf/svelte-ux-theme
```

## Usage

1. Install svelte-ux
  
    [Installation - svelte-ux](https://next.svelte-ux.techniq.dev/)

2. Configuration

    Register the theme source path by adding the following line to the `app.css` file:

    ```css
    @source "../node_modules/@sjsf/svelte-ux-theme/dist";
    ```

3. Apply theme

    ```svelte
    <script lang="ts">
      import { createForm } from '@sjsf/form';
      import { theme } from '@sjsf/svelte-ux-theme';

      const form = createForm({
        theme,
        ...
      })
    </script>
    ```

## License

MIT
