# @sjsf/valibot-validator

The [Valibot](https://github.com/fabian-hiller/valibot) based validator for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/valibot/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/valibot-validator @valibot/to-json-schema valibot
```

## Usage

```typescript
import { createForm, type Schema } from '@sjsf/form'
import { setupFormValidator } from "@sjsf/valibot-validator";
import * as v from 'valibot';

const vSchema = v.object({
  /* your schema */
});

const { schema, validator } = setupFormValidator(vSchema);

const form = createForm({
  schema,
  validator,
  ...
})
```

## License

MIT
