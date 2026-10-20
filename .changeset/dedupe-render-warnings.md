---
"@sjsf/form": minor
---

Log repeated render-time warnings only once

Deduplication is process-global: a warning is suppressed across every form
until the cache rotates or `resetLogOnce()` from
`@sjsf/form/lib/log-once` is called. Test suites that assert on repeated
warnings must reset the cache between cases.

The dependencies `oneOf` warning now includes the dependency key, and the
Ajv 8 validator and its precompile variant route their `"Failed to validate"`
warning through the same cache.

Port https://github.com/rjsf-team/react-jsonschema-form/pull/5344
