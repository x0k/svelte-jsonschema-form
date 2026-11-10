---
"@sjsf/schemasafe-validator": patch
---

Discard errors that `@exodus/schemasafe` leaves behind from successful `oneOf`/`anyOf` branches. When another part of the form was invalid, those stale branch errors were reported too, producing phantom `const`/`enum` errors for values that matched a branch. This affects both runtime and precompiled validators.
