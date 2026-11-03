---
"@sjsf/form": major
---

Remove a `dependencies` or `if`/`then`/`else` branch's stale default when the selected branch swaps in a different one, then let the normal defaults pass write the new value.

A value equal to the old branch's declared `default` or `const` is removed even when it came from `initialValue` or the initial data of a controlled `value`; a value edited away from it is kept. Values are matched per key of the level that declares the default, and array items are not searched. See the dynamic forms guide for the full replacement rules.

A controlled form now observes writes made to its bound value outside the form. When the schema can swap conditional defaults, those writes are recorded like command writes, so an external editor no longer bypasses stale-default sanitization.

Add the required `FormMerger.dropStaleDefaults` hook. The built-in modern and legacy mergers implement it. Custom `FormMerger` implementations must delegate `dropStaleDefaults` to the new exported helper or implement the pass themselves.

Add the required `FormMerger.isValueShallowEqual` hook. The form uses it to detect whether an in-place command changed a container. The built-in mergers delegate to the exported `isSchemaValueShallowEqual` helper; custom mergers can override it for custom value types.

Add the `setValueAtPath` command for writing a value at a field path, the `updateValueAtPath` command for updating an object in place without replacing its parent container, and the `insertArrayItem`, `removeArrayItem`, `moveArrayItem`, and `swapArrayItems` commands for structural array changes that keep item keys in sync. All these commands record the replaced value so conditional-default sanitization can resolve the form data as it was before the change.

Remove the `keyedArraysMap` form option. Use the array commands instead of mutating a keyed array retrieved from the form.
