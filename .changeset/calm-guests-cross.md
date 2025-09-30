---
"@sjsf/form": major
---

- Added a new **required** `createForm` parameter: `createIdBuilder`
- Removed the `idSeparator` and `idPseudoSeparator` parameters
- Removed the following types:
  - `IdPrefixOption`
  - `IdSeparatorOption`
  - `IdPseudoSeparator`
  - `IdOptions`
  - `PathToIdOptions`
- `focus-on-first-error` module changes:
  - Updated signatures of `getErrorsList` and `getFocusAction`
  - Removed the `GetFocusActionOptions` type
