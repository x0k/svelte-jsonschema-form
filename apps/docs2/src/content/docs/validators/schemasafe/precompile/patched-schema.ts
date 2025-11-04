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
      "$id": "v1"
    },
    "email": {
      "type": "string",
      "format": "email",
      "$id": "v2"
    },
    "age": {
      "type": "integer",
      "minimum": 21,
      "maximum": 100,
      "$id": "v3"
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
        "$id": "v5"
      },
      "uniqueItems": true,
      "minItems": 1,
      "$id": "v4"
    }
  },
  "additionalProperties": false,
  "$id": "v0"
} as const satisfies Schema;