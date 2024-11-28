# @sjsf/zod-validator

The [zod](https://github.com/colinhacks/zod) based validator for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/integrations/zod/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/zod-validator zod zod-to-json-schema json-schema-to-zod
```

## Usage

```typescript
import { useForm2, type Schema } from '@sjsf/form'
import { createValidator } from "@sjsf/zod-validator";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const schema = z.object({
  /* your schema */
});

const rootSchema = zodToJsonSchema(schema) as Schema

const validator = createValidator({
  schema,
  rootSchema
});

const form = useForm2({
  schema: rootSchema,
  validator
})
```

## License

MIT