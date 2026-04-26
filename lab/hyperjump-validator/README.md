# @sjsf-lab/hyperjump-validator

The [@hyperjump/json-schema](https://github.com/hyperjump-io/json-schema) based validator implementation for [svelte-jsonschema-form](https://github.com/x0k/svelte-jsonschema-form).

- [Documentation](https://x0k.github.io/svelte-jsonschema-form/validators/hyperjump/)
- [Playground](https://x0k.github.io/svelte-jsonschema-form/playground3/)

## Installation

```shell
npm install @sjsf-lab/hyperjump-validator @hyperjump/json-schema
```

## Usage

```typescript
import { createFormValidatorFactory } from "@sjsf-lab/hyperjump-validator";
import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";

import { ast } from "./ast";

const factory = createFormValidatorFactory({ ast, localization });
```

## License

MIT
