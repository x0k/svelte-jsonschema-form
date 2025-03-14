# @sjsf/form

Svelte 5 library for creating forms based on JSON schema.
Unofficial port of [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

Install the library and `ajv` for validation.

```shell
npm install @sjsf/form @sjsf/ajv8-validator ajv@8
```

## Usage

```svelte
<script lang="ts">
  import { createForm3, RawForm, type Schema } from '@sjsf/form';
  import { translation } from '@sjsf/form/translations/en';
  import { theme } from '@sjsf/form/basic-theme';
  import { createValidator2 } from "@sjsf/ajv8-validator";

  const validator = createValidator2();

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

  const form = createForm3({
    ...theme,
    schema,
    validator,
    translation,
    onSubmit: console.log
  })
</script>

<RawForm {form} />
```

## License

This project includes modifications of code from [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form), which is licensed under the Apache License, Version 2.0.
The rest of the project is under the MIT license.

See [LICENSE-MIT](LICENSE) and [LICENSE-APACHE](LICENSE-APACHE) for details.

## See also

- [Other JSON Schema to Web UI tools](https://json-schema.org/tools?query=&sortBy=name&sortOrder=ascending&groupBy=toolingTypes&licenses=&languages=&drafts=&toolingTypes=schema-to-web-UI)
- [Converting JSON to table](https://github.com/x0k/json-to-table)
- Simple build automation tool [mk](https://github.com/x0k/mk)
