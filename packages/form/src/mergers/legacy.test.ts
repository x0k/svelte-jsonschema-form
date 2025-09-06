import { describe, expect, it } from "vitest";

import type { Schema } from "@/core/index.js";

import { mergeSchemas } from "./legacy.js";

describe("mergeSchemas()", () => {
  it("shouldn`t mutate the provided objects", () => {
    const obj1 = { const: 1 };
    mergeSchemas(obj1, { const: 2 });
    expect(obj1).toEqual({ const: 1 });
  });

  it("should merge two one-level deep objects", () => {
    expect(mergeSchemas({ const: 1 }, { examples: 2 })).toEqual({
      const: 1,
      examples: 2,
    });
  });

  it("should override the first object with the values from the second", () => {
    expect(mergeSchemas({ const: 1 }, { const: 2 })).toEqual({ const: 2 });
  });

  // it('should override non-existing values of the first object with the values from the second', () => {
  //   expect(mergeSchemas({ properties: { b: undefined } }, { a: { b: { c: 1 } } })).toEqual({ a: { b: { c: 1 } } });
  // });

  // it('should recursively merge deeply nested objects', () => {
  //   const obj1 = {
  //     a: 1,
  //     b: {
  //       c: 3,
  //       d: [1, 2, 3],
  //       e: { f: { g: 1 } },
  //     },
  //     c: 2,
  //   };
  //   const obj2 = {
  //     a: 1,
  //     b: {
  //       d: [3, 2, 1],
  //       e: { f: { h: 2 } },
  //       g: 1,
  //     },
  //     c: 3,
  //   };
  //   const expected = {
  //     a: 1,
  //     b: {
  //       c: 3,
  //       d: [3, 2, 1],
  //       e: { f: { g: 1, h: 2 } },
  //       g: 1,
  //     },
  //     c: 3,
  //   };
  //   expect(mergeSchemas(obj1, obj2)).toEqual(expected);
  // });

  // it('should recursively merge File objects', () => {
  //   const file = new File(['test'], 'test.txt');
  //   const obj1 = {
  //     a: {},
  //   };
  //   const obj2 = {
  //     a: file,
  //   };
  //   expect(mergeSchemas(obj1, obj2).a).toBeInstanceOf(File);
  // });

  describe("arrays", () => {
    it("should not concat arrays", () => {
      const obj1 = { enum: [1] };
      const obj2 = { enum: [2] };

      expect(mergeSchemas(obj1, obj2)).toEqual({ enum: [2] });
    });

    it("should concat arrays under `required` keyword", () => {
      const obj1: Schema = { type: "object", required: ["1"] };
      const obj2: Schema = { type: "object", required: ["2"] };

      expect(mergeSchemas(obj1, obj2)).toEqual({
        type: "object",
        required: ["1", "2"],
      });
    });

    it("should concat arrays under `required` keyword when one of the schemas is an object type", () => {
      const obj1: Schema = { type: "object", required: ["1"] };
      const obj2: Schema = { required: ["2"] };

      expect(mergeSchemas(obj1, obj2)).toEqual({
        type: "object",
        required: ["1", "2"],
      });
    });

    it("should concat nested arrays under `required` keyword", () => {
      const obj1: Schema = { items: { type: "object", required: ["1"] } };
      const obj2: Schema = { items: { type: "object", required: ["2"] } };

      expect(mergeSchemas(obj1, obj2)).toEqual({
        items: { type: "object", required: ["1", "2"] },
      });
    });

    it("should not include duplicate values when concatting arrays under `required` keyword", () => {
      const obj1: Schema = { type: "object", required: ["1"] };
      const obj2: Schema = { type: "object", required: ["1"] };

      expect(mergeSchemas(obj1, obj2)).toEqual({
        type: "object",
        required: ["1"],
      });
    });

    it("should not concat arrays under `required` keyword that are not under an object type", () => {
      const obj1: Schema = { dependencies: { required: ["1"] } };
      const obj2: Schema = { dependencies: { required: ["2"] } };

      expect(mergeSchemas(obj1, obj2)).toEqual({
        dependencies: { required: ["2"] },
      });
    });
  });
});
