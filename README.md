# svelte-jsonschema-form

Svelte 5 library for creating forms based on JSON schema.
Unofficial port of [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/)
- [Form Builder](https://x0k.github.io/svelte-jsonschema-form/builder)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

Install the library, basic theme and `ajv` for validation.

```shell
npm i @sjsf/form @sjsf/basic-theme @sjsf/ajv8-validator ajv@8
```

## Usage

```svelte
<script lang="ts">
  import { createForm, BasicForm, type Schema } from '@sjsf/form';
  import { resolver } from '@sjsf/form/resolvers/basic';
  import { translation } from '@sjsf/form/translations/en';
  import { createFormMerger } from '@sjsf/form/mergers/modern';
  import { createFormIdBuilder } from '@sjsf/form/id-builders/modern';
  import { createFormValidator } from '@sjsf/ajv8-validator';
  import { theme } from '@sjsf/basic-theme';
  import '@sjsf/basic-theme/css/basic.css';

  const schema: Schema = {
    title: 'Tasks',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: 'Name',
        },
        description: {
          type: 'string',
          title: 'Description',
        },
      },
      required: ["name"]
    },
  }

  const form = createForm({
    theme,
    schema,
    resolver,
    translation,
    merger: createFormMerger,
    validator: createFormValidator,
    idBuilder: createFormIdBuilder,
    onSubmit: console.log
  })
</script>

<BasicForm {form} />
```

## Supported Themes

- [Basic](https://x0k.dev/svelte-jsonschema-form/themes/basic/)
  - [Pico CSS](https://x0k.dev/svelte-jsonschema-form/themes/basic/#pico-css)
- [daisyUI v5](https://x0k.dev/svelte-jsonschema-form/themes/daisyui5/)
- [Flowbite Svelte](https://x0k.dev/svelte-jsonschema-form/themes/flowbite3/)
- [Skeleton v4](https://x0k.dev/svelte-jsonschema-form/themes/skeleton4/)
- [shadcn-svelte](https://x0k.dev/svelte-jsonschema-form/themes/shadcn4/)

## Supported Validators

- [Ajv v8](https://x0k.dev/svelte-jsonschema-form/validators/ajv/)
- [Zod v4](https://x0k.dev/svelte-jsonschema-form/validators/zod4/)
- [Valibot](https://x0k.dev/svelte-jsonschema-form/validators/valibot/)
- [@cfworker/json-schema](https://x0k.dev/svelte-jsonschema-form/validators/cfworker/)
- [@exodus/schemasafe](https://x0k.dev/svelte-jsonschema-form/validators/schemasafe/)
- [Standard Schema](https://x0k.dev/svelte-jsonschema-form/validators/standard-schema/)

## License

This project includes modifications of code from [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form), which is licensed under the Apache License, Version 2.0.
The rest of the project is under the MIT license.

See [LICENSE-MIT](LICENSE) and [LICENSE-APACHE](packages/form/LICENSE-APACHE) for details.

## See also

- [Other JSON Schema to Web UI tools](https://json-schema.org/tools?query=&sortBy=name&sortOrder=ascending&groupBy=toolingTypes&licenses=&languages=&drafts=&toolingTypes=schema-to-web-UI)
- [Converting JSON to table](https://github.com/x0k/json-to-table)
- [Simple build automation tool - mk](https://github.com/x0k/mk)
