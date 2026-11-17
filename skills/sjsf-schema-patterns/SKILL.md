---
name: sjsf-schema-patterns
description: Design JSON Schema and UI Schema for svelte-jsonschema-form forms. Use when creating dynamic forms (oneOf/anyOf discriminators, dependencies, if/then/else), configuring string formats (date-time, uri, data-url), handling file uploads (Data URL vs Native File), or configuring validation modes.
---

# SJSF Schema Patterns & Validation

This skill covers authoring JSON Schemas, UI Schemas, dynamic fields, and validation strategies for `svelte-jsonschema-form`.

## Step 1: Core JSON Schema Constraints

SJSF expects **JSON Schema Draft-07**. Keep schemas compliant with these engine rules:

1. **Definitions & `$ref`**:
   - Use local JSON pointers only: `"$ref": "#/definitions/User"`.
   - `#/$defs/` needs the `@sjsf/form/converters/draft-2020-12` converter.
   - External URLs or remote network schemas are not resolved at runtime.
2. **String Formats**:
   - `date-time`: maps to `datetime-local`; the raw input string is stored by default.
   - `iso-date-time`: maps to `datetime-local`.
   - `date`, `email`, `color`: map to same-named inputs.
   - `time`: maps to `time`; the raw input string is stored by default.
   - `iso-time`: maps to `time`.
   - `uri`: maps to `url` input.
   - `data-url`: file upload widget (requires `compat` resolver).
   - To store RFC 3339-compliant values, import
     `@sjsf/form/fields/extra/date-include` and the theme's
     `extra-widgets/date-input-include` (the theme package is
     `@sjsf/basic-theme`, `@sjsf-lab/beercss-theme`,
     `@sjsf/daisyui5-theme`, `@sjsf/flowbite3-theme`,
     `@sjsf/shadcn4-theme`, `@sjsf/skeleton5-theme`, or
     `@sjsf-lab/svar-theme`), then select `dateField`; it handles `date`,
     `date-time`, `iso-date-time`, `time`, and `iso-time`. Without the theme
     include the field renders `component-not-found`.
   - `nativeDateField` (via `unknown-native-date-include`) uses the same widget
     but stores `Date` objects, which are not JSON and skip format validation.
   - On Flowbite the time control is `Timepicker`, configured by
     `flowbite3TimeInput`. It only accepts `HH:mm` and cannot clear a time-only
     field, so editing drops seconds; a `date-time` pair can still be cleared
     from its date half.

---

## Step 2: UI Schema Directives

Customize UI appearance, widgets, and labels without altering validation rules via `uiSchema`:

```ts
import type { UiSchema } from "@sjsf/form";

const uiSchema: UiSchema = {
  // Field order for object (v3: inside ui:options)
  "ui:options": {
    order: ["username", "email", "password", "*"],
  },

  // Override title without touching validation
  password: {
    "ui:options": {
      title: "Password",
    },
  },

  // Theme-specific options require UiOptions augmentation
  bio: {
    "ui:components": {
      textWidget: "textareaWidget",
    },
  },
};
```

No per-field `disabled`/`ui:disabled` in v3. Whole form: `disabled` option. Per field: `readOnly: true` in schema, or `inert` attribute where readonly has no effect.

---

## Step 3: Dynamic Forms & Polymorphism

For dynamic forms, use `oneOf` with `discriminator.propertyName`:

```json
{
  "type": "object",
  "oneOf": [
    {
      "title": "Credit Card",
      "properties": {
        "paymentMethod": {
          "type": "string",
          "enum": ["card"],
          "default": "card"
        },
        "cardNumber": { "type": "string", "title": "Card Number" }
      },
      "required": ["paymentMethod", "cardNumber"]
    },
    {
      "title": "Bank Transfer",
      "properties": {
        "paymentMethod": {
          "type": "string",
          "enum": ["bank"],
          "default": "bank"
        },
        "iban": { "type": "string", "title": "IBAN" }
      },
      "required": ["paymentMethod", "iban"]
    }
  ],
  "discriminator": {
    "propertyName": "paymentMethod"
  }
}
```

See [Dynamic Schemas Guide](references/dynamic-schemas.md) for conditional `if/then/else` and `dependencies`.

---

## Step 4: Validation Configuration

Validation happens on two levels:

1. **Form-level submit validation**: executes `validator.validateFormValue(schema, value)`.
2. **Field-level live validation**: configured by `fieldsValidationMode`.

```ts
import { ON_CHANGE, ON_INPUT } from "@sjsf/form";

const form = createForm({
  ...defaults,
  schema,
  // Bitmask (default is 0 = no live validation)
  fieldsValidationMode: ON_INPUT | ON_CHANGE,
  fieldsValidationDebounceMs: 250, // Debounce input events (default: 300)
});
```

HTML5 validation runs by default; set `novalidate` on the form to disable it.

See [File Handling Reference](references/file-handling.md) for handling file uploads and custom keywords.

---

## Gotchas & Rules

1. **No Overlapping Properties in `oneOf` / `anyOf`**: Properties declared inside a `oneOf` branch must NOT overlap with properties declared outside the `oneOf` at the same level.
2. **`additionalProperties: false` Caution**: Avoid setting `additionalProperties: false` on objects that use `dependencies` or dynamic conditionals, as intermediate state can cause false validation failures.
3. **`exclusiveMinimum` / `exclusiveMaximum`**: Handled by JSON validator during checks, but not passed as HTML input attributes.
4. **Number Parsing**: Number inputs automatically coerce string input into numbers. An empty number field yields `undefined` unless defaults or nullable schemas are specified.
