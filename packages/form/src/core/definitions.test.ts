// This file was copied and modified from https://github.com/rjsf-team/react-jsonschema-form/blob/f4229bf6e067d31b24de3ef9d3ca754ee52529ac/packages/utils/test/findSchemaDefinition.test.ts
// Licensed under the Apache License, Version 2.0.
// Modifications made by Roman Krasilnikov.

import { beforeEach, describe, expect, it } from "vitest";

import { findSchemaDefinition, resolveRef } from "./definitions.js";
import type { Merger } from "./merger.js";
import type { Schema } from "./schema.js";
import { createMerger } from "./test-merger.js";
// import { findSchemaDefinitionRecursive } from './definitions';

const schema: Schema = {
  type: "object",
  definitions: {
    stringRef: {
      type: "string",
    },
    nestedRef: {
      $ref: "#/definitions/stringRef",
    },
    extraNestedRef: {
      $ref: "#/definitions/stringRef",
      title: "foo",
    },
    // Reference accidentally pointing to itself.
    badCircularNestedRef: {
      $ref: "#/definitions/badCircularNestedRef",
    },
    // Reference accidentally pointing to a chain of references which ultimately
    // point back to the original reference.
    badCircularDeepNestedRef: {
      $ref: "#/definitions/badCircularDeeperNestedRef",
    },
    badCircularDeeperNestedRef: {
      $ref: "#/definitions/badCircularDeepestNestedRef",
    },
    badCircularDeepestNestedRef: {
      $ref: "#/definitions/badCircularDeepNestedRef",
    },
  },
};

const EXTRA_EXPECTED = { type: "string", title: "foo" };

let testMerger: Merger;

beforeEach(() => {
  testMerger = createMerger();
});

describe("findSchemaDefinition()", () => {
  it("throws error when ref is malformed", () => {
    expect(() =>
      findSchemaDefinition(testMerger, "definitions/missing", {})
    ).toThrow("Invalid reference: definitions/missing");
  });
  it("throws error when ref does not exist", () => {
    expect(() =>
      findSchemaDefinition(testMerger, "#/definitions/missing", schema)
    ).toThrow("Could not find a definition for #/definitions/missing");
  });
  it("returns the string ref from its definition", () => {
    expect(
      findSchemaDefinition(testMerger, "#/definitions/stringRef", schema)
    ).toBe(schema.definitions!.stringRef);
  });
  it("returns the string ref from its nested definition", () => {
    expect(
      findSchemaDefinition(testMerger, "#/definitions/nestedRef", schema)
    ).toBe(schema.definitions!.stringRef);
  });
  it("returns a combined schema made from its nested definition with the extra props", () => {
    testMerger = createMerger({
      merges: [
        {
          left: { title: "foo" },
          right: { type: "string" },
          result: { type: "string", title: "foo" },
        },
      ],
    });
    expect(
      findSchemaDefinition(testMerger, "#/definitions/extraNestedRef", schema)
    ).toEqual(EXTRA_EXPECTED);
  });
  it("throws error when ref is a circular reference", () => {
    expect(() =>
      findSchemaDefinition(
        testMerger,
        "#/definitions/badCircularNestedRef",
        schema
      )
    ).toThrow(
      "Definition for #/definitions/badCircularNestedRef is a circular reference"
    );
  });
  it("throws error when ref is a deep circular reference", () => {
    expect(() =>
      findSchemaDefinition(
        testMerger,
        "#/definitions/badCircularDeepNestedRef",
        schema
      )
    ).toThrow(
      "Definition for #/definitions/badCircularDeepNestedRef contains a circular reference through #/definitions/badCircularDeepNestedRef -> #/definitions/badCircularDeeperNestedRef -> #/definitions/badCircularDeepestNestedRef -> #/definitions/badCircularDeepNestedRef"
    );
  });

  describe("JSON pointer fragments (RFC 6901)", () => {
    // The RFC 6901 section 5 example document
    const rfc6901 = {
      foo: ["bar", "baz"],
      "": 0,
      "a/b": 1,
      "c%d": 2,
      "e^f": 3,
      "g|h": 4,
      "i\\j": 5,
      'k"l': 6,
      " ": 7,
      "m~n": 8,
      "~1": 9,
      "a/~b": 10,
      nested: { "": { "/": 11 }, list: [{ deep: 12 }] },
      // Two keys that differ only in which escape character they use, so
      // `~1` must be unescaped before `~0` or the two would swap
      slash: { kind: "a~1b" },
      tilde: { kind: "a~0b" },
      falsy: false,
    };

    const cases: [string, unknown][] = [
      ["#", rfc6901],
      ["#/foo", rfc6901.foo],
      ["#/foo/0", "bar"],
      ["#/foo/1", "baz"],
      ["#/", 0],
      ["#/a~1b", 1],
      // A raw `%` is not a legal fragment character (RFC 3986), so only its
      // percent-encoded form is a valid ref
      ["#/c%25d", 2],
      ["#/e^f", 3],
      ["#/e%5Ef", 3],
      ["#/g|h", 4],
      ["#/g%7Ch", 4],
      ["#/i\\j", 5],
      ["#/i%5Cj", 5],
      ['#/k"l', 6],
      ["#/k%22l", 6],
      ["#/ ", 7],
      ["#/%20", 7],
      ["#/m~0n", 8],
      ["#/~01", 9],
      ["#/a~1~0b", 10],
      ["#/nested//~1", 11],
      ["#/nested/list/0/deep", 12],
      ["#/slash", rfc6901.slash],
      ["#/tilde", rfc6901.tilde],
      // A boolean schema is a valid definition, and not the same as missing
      ["#/falsy", false],
    ];

    it.each(cases)("resolves %s", (ref, expected) => {
      expect(resolveRef(ref, rfc6901 as unknown as Schema)).toBe(expected);
    });

    it("unescapes `~1` before `~0`", () => {
      expect(
        resolveRef("#/slash", rfc6901 as unknown as Schema)
      ).toHaveProperty("kind", "a~1b");
      expect(
        resolveRef("#/tilde", rfc6901 as unknown as Schema)
      ).toHaveProperty("kind", "a~0b");
    });

    it.each([
      "#/foo/2",
      "#/foo/-",
      // A leading zero is not a canonical array index
      "#/foo/01",
      "#/foo/bar",
      "#/foo/0/0",
      "#/nested/missing",
      // `~2` is not an escape, so it is a literal key that does not exist
      "#/a~2b",
      "#/a~b",
      // Not a JSON pointer at all, it has no leading `/`
      "#foo",
      "#foo/0",
    ])("throws for %s, which points at nothing", (ref) => {
      expect(() => resolveRef(ref, rfc6901 as unknown as Schema)).toThrow(
        `Could not find a definition for ${ref}.`
      );
    });

    it.each([
      "#/__proto__",
      "#/constructor",
      "#/constructor/prototype",
      "#/toString",
      "#/valueOf",
      "#/nested/__proto__",
    ])(
      "throws for %s, which is an inherited member and not a schema key",
      (ref) => {
        expect(() => resolveRef(ref, rfc6901 as unknown as Schema)).toThrow(
          `Could not find a definition for ${ref}.`
        );
      }
    );

    it.each(["#/__proto__", "#/constructor", "#/toString", "#/valueOf"])(
      "rejects %s through findSchemaDefinition() too",
      (ref) => {
        expect(() => findSchemaDefinition(testMerger, ref, schema)).toThrow(
          `Could not find a definition for ${ref}.`
        );
      }
    );
  });
});

// describe('findSchemaDefinitionRecursive()', () => {
//   it('throws error when ref is missing', () => {
//     expect(() => findSchemaDefinitionRecursive()).toThrow('Could not find a definition for undefined');
//   });
//   it('throws error when ref is malformed', () => {
//     expect(() => findSchemaDefinitionRecursive('definitions/missing')).toThrow(
//       'Could not find a definition for definitions/missing'
//     );
//   });
//   it('throws error when ref does not exist', () => {
//     expect(() => findSchemaDefinitionRecursive('#/definitions/missing', schema)).toThrow(
//       'Could not find a definition for #/definitions/missing'
//     );
//   });
//   it('returns the string ref from its definition', () => {
//     expect(findSchemaDefinitionRecursive('#/definitions/stringRef', schema)).toBe(schema.definitions!.stringRef);
//   });
//   it('returns the string ref from its nested definition', () => {
//     expect(findSchemaDefinitionRecursive('#/definitions/nestedRef', schema)).toBe(schema.definitions!.stringRef);
//   });
//   it('returns a combined schema made from its nested definition with the extra props', () => {
//     expect(findSchemaDefinitionRecursive('#/definitions/extraNestedRef', schema)).toEqual(EXTRA_EXPECTED);
//   });
//   it('throws error when ref is a circular reference', () => {
//     expect(() => findSchemaDefinitionRecursive('#/definitions/badCircularNestedRef', schema)).toThrow(
//       'Definition for #/definitions/badCircularNestedRef is a circular reference'
//     );
//   });
//   it('throws error when ref is a deep circular reference', () => {
//     expect(() => findSchemaDefinitionRecursive('#/definitions/badCircularDeepNestedRef', schema)).toThrow(
//       'Definition for #/definitions/badCircularDeepNestedRef contains a circular reference through #/definitions/badCircularDeeperNestedRef -> #/definitions/badCircularDeepestNestedRef -> #/definitions/badCircularDeepNestedRef'
//     );
//   });
// });
