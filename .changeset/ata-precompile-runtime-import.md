---
"@sjsf/ata-validator": patch
---

Keep the precompile entry free of runtime `ata-validator` imports. `DEFAULT_VALIDATOR_OPTIONS` and the format regular expressions now live in a shared module that the precompiled validator imports, so an app that imports only `@sjsf/ata-validator/precompile` does not bundle the runtime validator.

Ports https://github.com/rjsf-team/react-jsonschema-form/pull/5559.
