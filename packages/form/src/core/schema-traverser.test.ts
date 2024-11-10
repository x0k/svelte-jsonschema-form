import { describe, expect, it } from "vitest";
import { traverseSchemaDefinition } from "./schema-traverser.js";
import type { Schema } from "./schema.js";

describe("traverseSchemaDefinition", () => {
  it("Should traverse schema definitions in correct order", () => {
    const schema: Schema = {
      type: "object",
      properties: {
        animal: {
          enum: ["0", "1"],
        },
      },
      allOf: [
        {
          if: {
            properties: {
              animal: {
                const: "0",
              },
            },
          },
          then: {
            properties: {
              food: {
                type: "string",
                enum: ["meat", "grass", "fish"],
              },
            },
            required: ["food"],
          },
        },
        {
          if: {
            properties: {
              animal: {
                const: "1",
              },
            },
          },
          then: {
            properties: {
              food: {
                type: "string",
                enum: ["insect", "worms"],
              },
              water: {
                type: "string",
                enum: ["lake", "sea"],
              },
            },
            required: ["food", "water"],
          },
        },
        {
          required: ["animal"],
        },
      ],
    };
    expect(
      Array.from(
        traverseSchemaDefinition(schema, {
          *onEnter(_, ctx) {
            yield `enter::${ctx.path.join("/")}`;
          },
          *onLeave(_, ctx) {
            yield `leave::${ctx.path.join("/")}`;
          },
        })
      )
    ).toEqual([
      "enter::",
      "enter::properties/animal",
      "leave::properties/animal",
      "enter::allOf/0",
      "enter::allOf/0/if",
      "enter::allOf/0/if/properties/animal",
      "leave::allOf/0/if/properties/animal",
      "leave::allOf/0/if",
      "enter::allOf/0/then",
      "enter::allOf/0/then/properties/food",
      "leave::allOf/0/then/properties/food",
      "leave::allOf/0/then",
      "leave::allOf/0",
      "enter::allOf/1",
      "enter::allOf/1/if",
      "enter::allOf/1/if/properties/animal",
      "leave::allOf/1/if/properties/animal",
      "leave::allOf/1/if",
      "enter::allOf/1/then",
      "enter::allOf/1/then/properties/food",
      "leave::allOf/1/then/properties/food",
      "enter::allOf/1/then/properties/water",
      "leave::allOf/1/then/properties/water",
      "leave::allOf/1/then",
      "leave::allOf/1",
      "enter::allOf/2",
      "leave::allOf/2",
      "leave::",
    ]);
  });
});
