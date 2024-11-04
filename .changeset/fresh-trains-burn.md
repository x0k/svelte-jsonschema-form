---
"@sjsf/form": minor
---

ID generation algorithm has been updated:

- Add `idPropertySeparator` and `idIndexSeparator` options to the form options
- Add `pathToId2`, `makeArrayItemId` functions

This change may be BREAKING for you if you code implicitly depends on ID
generation algorithm.

In this case make this dependency explicit by using constants like `DEFAULT_ID_PREFIX`
and functions like `pathToId`.
