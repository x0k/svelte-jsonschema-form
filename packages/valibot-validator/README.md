# @sjsf/valibot-validator

The [Valibot](https://github.com/fabian-hiller/valibot) based validator for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/valibot/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf/valibot-validator @valibot/to-json-schema valibot
```

## Usage

```typescript
import { createForm, type Schema } from "@sjsf/form";
import { adapt } from "@sjsf/valibot-validator";
import * as v from "valibot";

const schema = v.object({
  /* your schema */
});

const form = createForm({
  ...adapt(schema),
  /* other options */
});
```

## License

MIT
