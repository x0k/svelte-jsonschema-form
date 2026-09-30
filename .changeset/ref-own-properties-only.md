---
"@sjsf/form": patch
---

Stop `$ref` resolution reading inherited members. `findSchemaDefinition()` resolved a `$ref` fragment with `jsonpointer`, which walks the prototype chain, so `#/__proto__` resolved to `Object.prototype` and `#/toString` to `Function.prototype.toString` — a `$ref` in an untrusted schema could read prototype internals instead of a schema. The fragment is now walked with an own-property-only JSON pointer resolver, so an inherited member finds nothing and a `$ref` naming one throws `Could not find a definition` as any other unresolvable ref does. A fragment with no leading `/` is no longer a `jsonpointer` error either; it now reports the same unresolvable-ref message as the rest.

The `jsonpointer` dependency is gone. `@sjsf/form` now has one runtime dependency instead of two, and the `flowbite3` and legacy `flowbite` themes drop the `devDependency` and Vite pre-bundling entry they held only for it.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5314>
