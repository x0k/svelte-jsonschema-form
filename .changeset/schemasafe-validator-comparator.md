---
"@sjsf/schemasafe-validator": major
---

Value comparison is now a required `Comparator` service. `createFormValidator`
and the precompile `createFormValidatorFactory` require `comparator` in their
options.
