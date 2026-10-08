---
"@sjsf/ata-validator": patch
---

The `precompile` entry no longer builds its format predicates with `new Function` at import time, which threw where dynamic code is refused (a page under a Content-Security-Policy without `unsafe-eval`), the page a precompiled validator is for. The predicates are plain functions carrying their regular expressions, which `bundleStandalone` embeds as before; a test keeps them equal to the runtime `COLOR_FORMAT_REGEX` and `DATA_URL_FORMAT_REGEX`.
