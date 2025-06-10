# @sjsf/zod-validator

The [zod](https://github.com/colinhacks/zod) based validator for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/zod/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/zod-validator zod zod-to-json-schema json-schema-to-zod
```

## Usage

```typescript
import { createForm, type Schema } from '@sjsf/form'
import { createFormValidator } from "@sjsf/zod-validator";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const schema = z.object({
  /* your schema */
});

const validator = createFormValidator(schema);

const form = createForm({
  schema: zodToJsonSchema(schema) as Schema,
  validator,
  ...
})
```

## License

MIT
