---
"@sjsf/form": patch
---

Stop `getValueByPath()` reading inherited members. Each path segment was resolved with `in`, which walks the prototype chain, so reading `toString`, `constructor`, `valueOf` or `__proto__` off a plain object returned the inherited member rather than `defaultValue`. Segments are now matched as own properties. The validators build part of their error messages by walking a schema with this function (`@sjsf/ajv8-validator`, `@sjsf/ata-validator`, `@sjsf/schemasafe-validator`), so a schema path segment named after an inherited member now yields no title instead of one taken from `Object.prototype`.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5314>
