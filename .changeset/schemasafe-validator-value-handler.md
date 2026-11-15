---
"@sjsf/schemasafe-validator": major
---

Value comparison is now a required `ValueHandler` service. `createFormValidator`
and the precompile `createFormValidatorFactory` require `valueHandler` in their
options.
