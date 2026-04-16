import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 11
export const schema = {
  "title": "User",
  "type": "object",
  "required": [
    "id",
    "email",
    "age",
    "roles"
  ],
  "properties": {
    "id": {
      "type": "integer",
      "minimum": 1,
      "$id": "https://example.com/v1"
    },
    "email": {
      "type": "string",
      "format": "email",
      "$id": "https://example.com/v2"
    },
    "age": {
      "type": "integer",
      "minimum": 21,
      "maximum": 100,
      "$id": "https://example.com/v3"
    },
    "roles": {
      "type": "array",
      "items": {
        "type": "string",
        "enum": [
          "admin",
          "editor",
          "viewer"
        ],
        "$id": "https://example.com/v5"
      },
      "uniqueItems": true,
      "minItems": 1,
      "$id": "https://example.com/v4"
    }
  },
  "additionalProperties": false,
  "$id": "https://example.com/v0"
} as const satisfies Schema;