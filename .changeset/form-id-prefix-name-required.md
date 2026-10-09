---
"@sjsf/form": major
---

`FormIdBuilder.idPrefixName` is now required (previously optional with `SJSF_ID_PREFIX` fallback).

Removed `resolveIdPrefixName` helper — call `builder.idPrefixName()` directly.
