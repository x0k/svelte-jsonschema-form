---
"@sjsf/hyperjump-validator": minor
---

Promote the validator out of `lab/` and rename it from `@sjsf-lab/hyperjump-validator` to `@sjsf/hyperjump-validator`. It is no longer experimental and now ships from the stable release train. Update the dependency name to `@sjsf/hyperjump-validator`; the `@precompile` entry point is unchanged.

The validator is also built on the stable `@hyperjump/json-schema` API. `@hyperjump/json-schema-errors` is now a published `1.0.0` dependency instead of a pinned commit, and the peer range moves to `^1.18.0`. Two further breaking changes:

- [BREAKING] Removed `fromAst` and the deprecated `ast` option. The compiled unit is now a serialized validator: compile with `await validate(schemaUri)`, call `validator.serialize()` at build time, and pass the restored validators to `fromValidators` from `@sjsf/form/validators/precompile`, the same retriever the other precompiled validators use. `fromAst`, the `ast` option, and the shared-`AST` codegen they required are gone.
- [BREAKING] Removed the `@hyperjump/json-schema/experimental` dependency. Nothing in the package imports an experimental entry point anymore, and `validatorRetriever` now expects the `Validator` produced by `validate(url)` or `restoreValidator(json)` instead of the experimental `AST`. The dialect module must still be imported in the browser bundle, because a restored validator is evaluated against the keywords it registers. If a schema uses `format`, `@hyperjump/json-schema/formats-lite` must be imported as well, since `format` validation silently passes when no format handler is registered. Neither step generates code, so no `unsafe-eval` directive is needed and schemas may still be compiled at runtime.

`createFormValidatorFactory` keeps its signature and the `locale` option still localizes messages, so migrating is a change to the package name and to how validators are produced, rather than to how the form is wired up.
