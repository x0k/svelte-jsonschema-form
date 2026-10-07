---
name: sjsf-schema-patterns
description: Design JSON Schema and UI Schema for svelte-jsonschema-form forms. Use when creating dynamic forms (oneOf/anyOf discriminators, dependencies, if/then/else), configuring string formats (date-time, uri, data-url), handling file uploads (Data URL vs Native File), or configuring validation modes.
---

# SJSF Schema Patterns & Validation

This skill covers authoring JSON Schemas, UI Schemas, dynamic fields, and validation strategies for `svelte-jsonschema-form`.

## Step 1: Core JSON Schema Constraints

SJSF expects **JSON Schema Draft-07**. Keep schemas compliant with these engine rules:

1. **Definitions & `$ref`**:
   - Use local JSON pointers only: `"$ref": "#/definitions/User"` or `"$ref": "#/$defs/User"`.
   - External URLs or remote network schemas are not resolved at runtime.
2. **String Formats**:
   - `date-time`: maps to `datetime-local` input.
   - `date`: maps to `date` input (or date picker with `@sjsf/form/fields/extra-widgets/date-picker`).
   - `email`: maps to `email` input.
   - `uri`: maps to `url` input.
   - `data-url`: activates the file upload widget.

---

## Step 2: UI Schema Directives

Customize UI appearance, widgets, and labels without altering validation rules via `uiSchema`:

```ts
import type { UiSchema } from "@sjsf/form";

const uiSchema: UiSchema = {
  // Field order for object
  "ui:order": ["username", "email", "password", "*"],

  // Custom widget
  password: {
    "ui:widget": "password",
    "ui:placeholder": "Enter strong password...",
    "ui:help": "Must contain at least 8 characters",
  },

  // Options passed to theme widget
  bio: {
    "ui:widget": "textarea",
    "ui:options": {
      rows: 5,
      placeholder: "Tell us about yourself"
    }
  },

  // Disabled / readonly state
  systemId: {
    "ui:disabled": true
  }
};
```

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
        "paymentMethod": { "type": "string", "enum": ["card"], "default": "card" },
        "cardNumber": { "type": "string", "title": "Card Number" }
      },
      "required": ["paymentMethod", "cardNumber"]
    },
    {
      "title": "Bank Transfer",
      "properties": {
        "paymentMethod": { "type": "string", "enum": ["bank"], "default": "bank" },
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
1. **Form-level submit validation**: executes `validator.validateFormData(value, schema)`.
2. **Field-level live validation**: configured by `fieldsValidationMode`.

```ts
import { FieldsValidationMode } from "@sjsf/form";

const form = createForm({
  ...defaults,
  schema,
  // Bitmask: validate on blur and change (default is input | change)
  fieldsValidationMode: FieldsValidationMode.Blur | FieldsValidationMode.Change,
  fieldsValidationDebounceMs: 250, // Debounce input events
});
```

See [File Handling Reference](references/file-handling.md) for handling file uploads and custom keywords.

---

## Gotchas & Rules

1. **No Overlapping Properties in `oneOf` / `anyOf`**: Properties declared inside a `oneOf` branch must NOT overlap with properties declared outside the `oneOf` at the same level.
2. **`additionalProperties: false` Caution**: Avoid setting `additionalProperties: false` on objects that use `dependencies` or dynamic conditionals, as intermediate state can cause false validation failures.
3. **`exclusiveMinimum` / `exclusiveMaximum`**: Handled by JSON validator during checks, but not passed as HTML input attributes.
4. **Number Parsing**: Number inputs automatically coerce string input into numbers. An empty number field yields `undefined` unless defaults or nullable schemas are specified.
