---
"@sjsf/form": major
---

Drop the `experimental_`/`Experimental_` prefix from the stabilized default form state options:

- `Experimental_DefaultFormStateBehavior` → `DefaultFormStateBehavior`
- `Experimental_ArrayMinItems` → `ArrayMinItems`
- the `experimental_defaultFormStateBehavior` parameter of `getDefaultFormState` and the `experimental_defaultFormStateBehavior` member of `ComputeDefaultsProps` → `defaultFormStateBehavior`

`FormMergerOptions` still extends the behavior type directly, so its options (`arrayMinItems`, `emptyObjectFields`, and the rest) are unchanged. Update any code that names the types or passes the option explicitly.
