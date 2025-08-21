// This file was copied and modified from https://github.com/mokkabonna/json-schema-merge-allof/blob/1cc2aa53a5d33c17d0e9c59b13eed77d86ad91c3/test/specs/items.spec.js
// MIT © Martin Hansen
// Modifications made by Roman Krasilnikov.

import { describe, expect, it } from "vitest";

import { createDeduplicator, createIntersector } from "@/lib/array.js";
import { createComparator } from "@/lib/json-schema/compare/index.js";
import { identity } from "@/lib/function.js";

import {
  createDeepAllOfMerge,
  createShallowAllOfMerge,
} from "./all-of-merge.js";
import { createMerger } from "./merge.js";

const testPatternsMerger = (a: string, b: string) =>
  a === b ? a : `(?=${a})(?=${b})`;

const { compareSchemaValues, compareSchemaDefinitions } = createComparator();

const { mergeArrayOfSchemaDefinitions } = createMerger({
  mergePatterns: testPatternsMerger,
  intersectJson: createIntersector(compareSchemaValues),
  deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
  assigners: [[["additionalItems"], identity]],
});

const shallowAllOfMerge = createShallowAllOfMerge(
  mergeArrayOfSchemaDefinitions
);
const deepAllOfMerge = createDeepAllOfMerge(shallowAllOfMerge);

describe("items", () => {
  it("merges additionalItems", () => {
    const result = shallowAllOfMerge({
      items: {
        type: "object",
      },
      allOf: [
        {
          items: [true],
          additionalItems: {
            properties: {
              name: {
                type: "string",
                pattern: "bar",
              },
            },
          },
        },
        {
          items: [true],
          additionalItems: {
            properties: {
              name: {
                type: "string",
                pattern: "foo",
              },
            },
          },
        },
      ],
    });

    expect(result).toEqual({
      items: [
        {
          type: "object",
        },
      ],
      additionalItems: {
        type: "object",
        properties: {
          name: {
            type: "string",
            pattern: testPatternsMerger("bar", "foo"),
          },
        },
      },
    });
  });

  describe("when single schema", () => {
    it("merges them", () => {
      const result = deepAllOfMerge({
        items: {
          type: "string",
          allOf: [
            {
              minLength: 5,
            },
          ],
        },
        allOf: [
          {
            items: {
              type: "string",
              pattern: "abc.*",
              allOf: [
                {
                  maxLength: 7,
                },
              ],
            },
          },
        ],
      });

      expect(result).toEqual({
        items: {
          type: "string",
          pattern: "abc.*",
          minLength: 5,
          maxLength: 7,
        },
      });
    });
  });

  describe("when array", () => {
    it("merges them in when additionalItems are all undefined", () => {
      const result = deepAllOfMerge({
        items: [
          {
            type: "string",
            allOf: [
              {
                minLength: 5,
              },
            ],
          },
        ],
        allOf: [
          {
            items: [
              {
                type: "string",
                allOf: [
                  {
                    minLength: 5,
                  },
                ],
              },
              {
                type: "integer",
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        items: [
          {
            type: "string",
            minLength: 5,
          },
          {
            type: "integer",
          },
        ],
      });
    });

    it("merges in additionalItems from one if present", () => {
      const result = deepAllOfMerge({
        allOf: [
          {
            items: [
              {
                type: "string",
                minLength: 10,
                allOf: [
                  {
                    minLength: 5,
                  },
                ],
              },
              {
                type: "integer",
              },
            ],
          },
          {
            additionalItems: false,
            items: [
              {
                type: "string",
                allOf: [
                  {
                    minLength: 7,
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        additionalItems: false,
        items: [
          {
            type: "string",
            minLength: 10,
          },
        ],
      });
    });

    it("merges in additionalItems from one if present", () => {
      const result = deepAllOfMerge({
        allOf: [
          {
            items: [
              {
                type: "string",
                minLength: 10,
                allOf: [
                  {
                    minLength: 5,
                  },
                ],
              },
              {
                type: "integer",
              },
            ],
            additionalItems: false,
          },
          {
            additionalItems: false,
            items: [
              {
                type: "string",
                allOf: [
                  {
                    minLength: 7,
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        additionalItems: false,
        items: [
          {
            type: "string",
            minLength: 10,
          },
        ],
      });
    });

    it("merges in additionalItems schema", () => {
      const result = deepAllOfMerge({
        allOf: [
          {
            items: [
              {
                type: "string",
                minLength: 10,
                allOf: [
                  {
                    minLength: 5,
                  },
                ],
              },
              {
                type: "integer",
              },
            ],
            additionalItems: {
              type: "integer",
              minimum: 15,
            },
          },
          {
            additionalItems: {
              type: "integer",
              minimum: 10,
            },
            items: [
              {
                type: "string",
                allOf: [
                  {
                    minLength: 7,
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        additionalItems: {
          type: "integer",
          minimum: 15,
        },
        items: [
          {
            type: "string",
            minLength: 10,
          },
          {
            type: "integer",
            minimum: 10,
          },
        ],
      });
    });
  });

  describe("when mixed array and object", () => {
    it("merges in additionalItems schema", () => {
      const result = deepAllOfMerge({
        // This should be ignored according to spec when items absent
        additionalItems: {
          type: "integer",
          minimum: 50,
        },
        allOf: [
          {
            items: {
              type: "integer",
              minimum: 5,
              maximum: 30,
              allOf: [
                {
                  minimum: 9,
                },
              ],
            },
            // This should be ignored according to spec when items is object
            additionalItems: {
              type: "integer",
              minimum: 15,
            },
          },
          {
            // this will be merged with first allOf items schema
            additionalItems: {
              type: "integer",
              minimum: 10,
            },
            // this will be merged with first allOf items schema
            items: [
              {
                type: "integer",
                allOf: [
                  {
                    minimum: 7,
                    maximum: 20,
                  },
                ],
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        additionalItems: {
          type: "integer",
          minimum: 10,
          maximum: 30,
        },
        items: [
          {
            type: "integer",
            minimum: 9,
            maximum: 20,
          },
        ],
      });
    });
  });
});
