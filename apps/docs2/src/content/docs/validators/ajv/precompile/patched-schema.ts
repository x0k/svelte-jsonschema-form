import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 11
export const schema = {
  "definitions": {
    "test": {
      "type": "string",
      "$id": "v1"
    },
    "foo": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "$id": "v2"
        }
      },
      "$id": "v15"
    },
    "price": {
      "title": "Price per task ($)",
      "type": "number",
      "multipleOf": 0.03,
      "minimum": 1,
      "$id": "v3"
    },
    "passwords": {
      "type": "object",
      "properties": {
        "pass1": {
          "type": "string",
          "$id": "v4"
        },
        "pass2": {
          "type": "string",
          "$id": "v5"
        }
      },
      "required": [
        "pass1",
        "pass2"
      ]
    },
    "list": {
      "type": "array",
      "items": {
        "type": "string",
        "$id": "v7"
      },
      "$id": "v6"
    },
    "choice1": {
      "type": "object",
      "properties": {
        "choice": {
          "type": "string",
          "const": "one",
          "$id": "v8"
        },
        "other": {
          "type": "number",
          "$id": "v9"
        }
      },
      "$id": "v16"
    },
    "choice2": {
      "type": "object",
      "properties": {
        "choice": {
          "type": "string",
          "const": "two",
          "$id": "v10"
        },
        "more": {
          "type": "string",
          "$id": "v11"
        }
      },
      "$id": "v17"
    }
  },
  "type": "object",
  "properties": {
    "foo": {
      "type": "string",
      "$id": "v12"
    },
    "price": {
      "$ref": "#/definitions/price"
    },
    "passwords": {
      "$ref": "#/definitions/passwords"
    },
    "dataUrlWithName": {
      "type": "string",
      "format": "data-url",
      "$id": "v13"
    },
    "phone": {
      "type": "string",
      "format": "phone-us",
      "$id": "v14"
    },
    "multi": {
      "anyOf": [
        {
          "$ref": "#/definitions/foo"
        }
      ]
    },
    "list": {
      "$ref": "#/definitions/list"
    },
    "single": {
      "oneOf": [
        {
          "$ref": "#/definitions/choice1"
        },
        {
          "$ref": "#/definitions/choice2"
        }
      ]
    },
    "anything": {
      "type": "object",
      "additionalProperties": {
        "type": "string",
        "$id": "v18"
      }
    }
  },
  "anyOf": [
    {
      "title": "First method of identification",
      "properties": {
        "firstName": {
          "type": "string",
          "title": "First name",
          "$id": "v20"
        },
        "lastName": {
          "$ref": "#/definitions/test"
        }
      },
      "$id": "v19"
    },
    {
      "title": "Second method of identification",
      "properties": {
        "idCode": {
          "$ref": "#/definitions/test"
        }
      },
      "$id": "v21"
    }
  ],
  "$id": "v0"
} as const satisfies Schema;