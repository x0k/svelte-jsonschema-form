# @sjsf/hyperjump-validator

The [@hyperjump/json-schema](https://github.com/hyperjump-io/json-schema) based validator implementation for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/hyperjump/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/hyperjump-validator @hyperjump/json-schema
```

## Usage

Compile the schemas once at build time with `validate`, serialize them, and
restore the validators at runtime:

```typescript
// compile-validators.ts
import { registerSchema, validate } from "@hyperjump/json-schema/draft-07";

for (const schema of schemas) {
  registerSchema(schema);
}

const serialized: Record<string, string> = {};
for (const schema of schemas) {
  const validator = await validate(schema.$id!);
  serialized[schema.$id!] = validator.serialize();
}
```

```typescript
// validators.generated.ts
import { restoreValidator } from "@hyperjump/json-schema/draft-07";

export const validators = {
  "https://example.com/v0": restoreValidator("..."),
};
```

```typescript
// form.ts
import { createFormValidatorFactory } from "@sjsf/hyperjump-validator/precompile";
import { fromValidators } from "@sjsf/form/validators/precompile";

import { validators } from "./validators.generated";

const validator = createFormValidatorFactory({
  validatorRetriever: fromValidators(validators),
});
```

The dialect module (`@hyperjump/json-schema/draft-07` here), plus
`@hyperjump/json-schema/formats-lite` when a schema uses `format`, must be
imported in the browser bundle as well: a restored validator is evaluated
against the keywords those modules register, and `format` silently passes
without a handler.

Neither compiling nor restoring a validator generates code, so no `unsafe-eval`
directive is needed and schemas may also be compiled at runtime instead of
serialized at build time.

## License

MIT
