# @sjsf/ajv8-validator

The [Ajv8](https://github.com/ajv-validator/ajv) based validator implementation for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground/)

## Installation

```shell
npm install @sjsf/ajv8-validator ajv@8
```

## Usage

```typescript
import Ajv from 'ajv';
import {
  AjvValidator,
  addFormComponents,
  DEFAULT_AJV_CONFIG,
} from "@sjsf/ajv8-validator";

const validator = new AjvValidator(
  addFormComponents(new Ajv(DEFAULT_AJV_CONFIG))
);
```

## License

MIT
