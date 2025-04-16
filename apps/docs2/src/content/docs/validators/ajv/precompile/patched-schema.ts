import type { Schema } from "@sjsf/form";
export const fieldsValidationMode = 1
export const schema = {
  "definitions": {
    "test": {
      "type": "string",
      "$id": "sjsf__1"
    },
    "foo": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "$id": "sjsf__2"
        }
      },
      "$id": "sjsf__14"
    },
    "price": {
      "title": "Price per task ($)",
      "type": "number",
      "multipleOf": 0.03,
      "minimum": 1,
      "$id": "sjsf__3"
    },
    "passwords": {
      "type": "object",
      "properties": {
        "pass1": {
          "type": "string",
          "$id": "sjsf__4"
        },
        "pass2": {
          "type": "string",
          "$id": "sjsf__5"
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
        "$id": "sjsf__6"
      }
    },
    "choice1": {
      "type": "object",
      "properties": {
        "choice": {
          "type": "string",
          "const": "one",
          "$id": "sjsf__7"
        },
        "other": {
          "type": "number",
          "$id": "sjsf__8"
        }
      },
      "$id": "sjsf__15"
    },
    "choice2": {
      "type": "object",
      "properties": {
        "choice": {
          "type": "string",
          "const": "two",
          "$id": "sjsf__9"
        },
        "more": {
          "type": "string",
          "$id": "sjsf__10"
        }
      },
      "$id": "sjsf__16"
    }
  },
  "type": "object",
  "properties": {
    "foo": {
      "type": "string",
      "$id": "sjsf__11"
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
      "$id": "sjsf__12"
    },
    "phone": {
      "type": "string",
      "format": "phone-us",
      "$id": "sjsf__13"
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
        "$id": "sjsf__17"
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
          "$id": "sjsf__19"
        },
        "lastName": {
          "$ref": "#/definitions/test"
        }
      },
      "$id": "sjsf__18"
    },
    {
      "title": "Second method of identification",
      "properties": {
        "idCode": {
          "$ref": "#/definitions/test"
        }
      },
      "$id": "sjsf__20"
    }
  ],
  "$id": "sjsf__0"
} as const satisfies Schema;