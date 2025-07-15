# svelte-jsonschema-form

Svelte 5 library for creating forms based on JSON schema.
Unofficial port of [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/)
- [Form Builder](https://x0k.github.io/svelte-jsonschema-form/builder)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

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
  import { theme } from '@sjsf/basic-theme';
  import { createFormValidator } from "@sjsf/ajv8-validator";

  const validator = createFormValidator();

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
    validator,
    translation,
    onSubmit: console.log
  })
</script>

<BasicForm {form} />
```

## License

This project includes modifications of code from [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form), which is licensed under the Apache License, Version 2.0.
The rest of the project is under the MIT license.

See [LICENSE-MIT](LICENSE) and [LICENSE-APACHE](packages/form/LICENSE-APACHE) for details.

## See also

- [Other JSON Schema to Web UI tools](https://json-schema.org/tools?query=&sortBy=name&sortOrder=ascending&groupBy=toolingTypes&licenses=&languages=&drafts=&toolingTypes=schema-to-web-UI)
- [Converting JSON to table](https://github.com/x0k/json-to-table)
- [Simple build automation tool - mk](https://github.com/x0k/mk)
