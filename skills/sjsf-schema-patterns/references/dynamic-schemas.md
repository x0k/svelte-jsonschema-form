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
    "properties": { "state": { "type": "string", "title": "State (2-letter code)", "maxLength": 2 } },
    "required": ["state"]
  },
  "else": {
    "properties": { "postalCode": { "type": "string", "title": "Postal Code" } }
  }
}
```
