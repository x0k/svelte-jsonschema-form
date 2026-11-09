# Dynamic Schemas: Discriminators, Dependencies, and Conditionals

## 1. Discriminated Unions (`oneOf` with `discriminator`)

Recommended pattern for dynamic forms where a selector changes the fields:

```json
{
  "type": "object",
  "oneOf": [
    {
      "title": "Email Notification",
      "properties": {
        "channel": { "type": "string", "enum": ["email"], "default": "email" },
        "emailAddress": { "type": "string", "format": "email" }
      },
      "required": ["channel", "emailAddress"]
    },
    {
      "title": "SMS Notification",
      "properties": {
        "channel": { "type": "string", "enum": ["sms"], "default": "sms" },
        "phoneNumber": { "type": "string", "pattern": "^\\+[1-9]\\d{1,14}$" }
      },
      "required": ["channel", "phoneNumber"]
    }
  ],
  "discriminator": {
    "propertyName": "channel"
  }
}
```

> **CRITICAL RULE**: Properties defined inside `oneOf` options must not overlap with properties outside `oneOf` on the same level.

`oneOf` / `anyOf` also work without `discriminator` as a virtual selector:
the schema is auto-selected from `initialValue`. Use
`combinationFieldOptionSelector` UI options to customize the selector.

For a non-object field, value keywords beside `oneOf` / `anyOf` apply to the
selected option: an array's `items` and `uniqueItems`, or a string's `format`,
for example. An option's own value of a shared keyword wins, except that the
stricter bound is kept.

Switching options carries over values the new option can hold and applies its
defaults, including nested object and array defaults, so returning to an
option restores those defaults. A value edited away from the previous option's
defaults is kept as long as the new option can hold it.

---

## 2. Schema Dependencies

Use when the presence of a value in one field triggers additional required fields:

```json
{
  "type": "object",
  "properties": {
    "hasDiscount": { "type": "boolean", "title": "Apply Discount Code?" }
  },
  "dependencies": {
    "hasDiscount": {
      "oneOf": [
        {
          "properties": {
            "hasDiscount": { "enum": [false] }
          }
        },
        {
          "properties": {
            "hasDiscount": { "enum": [true] },
            "couponCode": { "type": "string", "title": "Coupon Code" }
          },
          "required": ["couponCode"]
        }
      ]
    }
  }
}
```

> **CAUTION**: Do not combine `additionalProperties: false` with schema `dependencies`, as it creates validation conflicts during intermediate edits.

---

## 3. If / Then / Else Conditionals

Supported for conditional field schemas in Draft-07:

```json
{
  "type": "object",
  "properties": {
    "country": {
      "type": "string",
      "enum": ["US", "CA", "OTHER"]
    }
  },
  "if": {
    "properties": { "country": { "const": "US" } }
  },
  "then": {
    "properties": {
      "state": {
        "type": "string",
        "title": "State (2-letter code)",
        "maxLength": 2
      }
    },
    "required": ["state"]
  },
  "else": {
    "properties": { "postalCode": { "type": "string", "title": "Postal Code" } }
  }
}
```

## 4. Branch Defaults

When a `dependencies` or `if`/`then`/`else` branch swap changes a property's
schema, SJSF replaces the value if it still equals the old branch's computed
default and both branches declare the key (`default` or `const` on the property
or in the level's `default` object; `null` counts). Computed defaults include
nested leaf defaults, `items` defaults repeated to `minItems`, and required
placeholders, but only an explicit declaration makes a branch speak for a key.

- Edited values are kept; a matching `initialValue` is replaced too.
- Matching is per key of the declaring level: a nested default can replace an
  untouched leaf while keeping an edited sibling, but a default declared a
  level above keeps the whole object once any leaf is edited. Writing a whole
  object counts as editing every value inside it.
- Array items and the conditionals inside them are not searched.
