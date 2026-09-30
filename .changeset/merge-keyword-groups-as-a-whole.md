---
"@sjsf/form": patch
---

Merge keyword groups as a whole, and fix merged patterns rejecting newlines.

`properties`/`patternProperties`/`additionalProperties`, `items`/`additionalItems` and `if`/`then`/`else` constrain each other, so when only the left side of a merge held a keyword of one of those groups, the right side's keywords of the same group were copied next to it without going through the group's assigner. `allOf: [{ properties: { a: {} } }, { additionalProperties: false }]` merged into a schema that allows `a`, which the original forbids; `allOf: [{ if: { minimum: 5 } }, { then: { maximum: 2 } }]` rejected everything from 5 up, where a `then` without an `if` is inert. When the left side holds any keyword of a group, the right side's keywords of that group now go to the group's assigner: left at the root, right in `allOf`. A right-side keyword the left side already has keeps merging as before.

`additionalItems` is no longer treated as if a missing `items` were `items: []`, so it is dropped next to a missing or schema-valued `items` instead of being applied to the other side's `items` or producing an invalid `items: []`.

`simplePatternsMerger()` no longer anchors the merged pattern with `^` and `.*$`. Since `.` does not match a newline, that made every merged `patternProperties` entry and merged `pattern` keyword reject values containing one: `allOf: [{ patternProperties: { "^x": { pattern: "a" } } }, { patternProperties: { "^x": { pattern: "b" } } }]` merged into a `^x` that rejected `"ab\ncd"`, though both original patterns are satisfied.

> [!NOTE]
> Custom `assigners` are now consulted per group, not per keyword: a keyword of your group that the left side lacks routes to your assigner instead of being copied to the root.

Port <https://github.com/x0k/json-schema-merge/pull/11>
