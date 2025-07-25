# @sjsf/zod4-validator

The [zod](https://github.com/colinhacks/zod) based validator for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/zod4/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground2/)

## Installation

```shell
npm install @sjsf/zod4-validator zod
```

## Usage

```typescript
import { createForm, type Schema } from '@sjsf/form'
import { setupFormValidator } from "@sjsf/zod4-validator/classic";
import { z } from "zod/v4";

const zodSchema = z.object({
  /* your schema */
});

const { schema, validator } = setupFormValidator(zodSchema);

const form = createForm({
  schema,
  validator,
  ...
})
```

## License

MIT
