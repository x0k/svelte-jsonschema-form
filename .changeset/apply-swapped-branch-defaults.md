---
"@sjsf/form": minor
---

Remove a `dependencies` or `if`/`then`/`else` branch's stale default when the selected branch swaps in a different one, then let the normal defaults pass write the new value.

A value equal to the old branch's declared `default` or `const` is removed even when it came from `initialValue` or a controlled `value`; a value edited away from it is kept. Values are matched per key of the level that declares the default, and array items are not searched. See the dynamic forms guide for the full replacement rules.

Add the optional `FormMerger.dropStaleDefaults` hook. The built-in modern and legacy mergers implement it; a custom merger that omits it skips the stale-default pass.

Add the `setValueAtPath` command for writing a value at a field path and the `updateValueAtPath` command for updating the value in place without replacing its parent container. Both commands record the replaced value so conditional-default sanitization can resolve the form data as it was before the change.
