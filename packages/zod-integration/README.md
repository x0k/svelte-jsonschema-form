# @sjsf/zod-integration

The [zod](https://github.com/colinhacks/zod) based validator augmentation for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/integrations/zod/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/zod-integration zod zod-to-json-schema
```

## Usage

```typescript
import { useForm2, type Schema } from '@sjsf/form'
import { createValidator } from "@sjsf/validator-of-your-choice";
import { withZod } from "@sjsf/zod-integration";
import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "zod";

const schema = z.object({
  /* your schema */
});

const validator = withZod(createValidator(), {
  schema,
});

const form = useForm2({
  schema: zodToJsonSchema(schema) as Schema,
})
```

## License

MIT
