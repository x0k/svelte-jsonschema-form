---
"@sjsf/form": patch
---

Apply the new option's declared defaults when switching `oneOf`/`anyOf` options, instead of keeping values left by the previous option. This covers nested object defaults, option-level array defaults (including arrays of objects), and values cleared because the new option has a different type or a `readOnly` property. Values edited away from the previous option's defaults are still kept whenever the new option can hold them. A value equal to the previous option's defaults cannot be told apart from one those defaults wrote, so it is replaced even when it came from the caller.

Port <https://github.com/rjsf-team/react-jsonschema-form/pull/5335>
