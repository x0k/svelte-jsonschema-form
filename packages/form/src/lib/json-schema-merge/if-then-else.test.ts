// This file was copied and modified from https://github.com/mokkabonna/json-schema-merge-allof/blob/1cc2aa53a5d33c17d0e9c59b13eed77d86ad91c3/test/specs/if-then-else.spec.js
// MIT © Martin Hansen
// Modifications made by Roman Krasilnikov.

import { describe, it, expect } from "vitest";

import { createMerger } from "./json-schema-merge.js";
import { createMergeAllOf } from "./all-of-merge.js";

const { mergeSchemas } = createMerger();
const mergeAllOf = createMergeAllOf(mergeSchemas);

describe("if then else", function () {
  it("moves the if then else to the base schema if none there", () => {
    const result = mergeAllOf({
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      if: {
        required: ["prop1"],
      },
      then: {},
      else: {},
    });
  });

  it("does NOT move the if then else to the base schema if something already there", () => {
    const result = mergeAllOf({
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });
  });

  it("moves the unaffected keywords to the base schema", () => {
    const result = mergeAllOf({
      properties: {
        name: {
          type: "string",
          minLength: 3,
        },
      },
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          properties: {
            name: {
              type: "string",
              minLength: 5,
            },
          },
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });

    expect(result).toEqual({
      properties: {
        name: {
          type: "string",
          minLength: 5,
        },
      },
      if: {
        minimum: 5,
      },
      then: {
        maximum: 2,
      },
      else: {
        maximum: 10,
      },
      allOf: [
        {
          if: {
            required: ["prop1"],
          },
          then: {},
          else: {},
        },
      ],
    });
  });

  // NOTE: Behavior for invalid schemas is undefined
  // it('should not move to base schema if only some keywords are not present', () => {
  //   const result = mergeAllOf({
  //     else: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })

  //   expect(result).toEqual({
  //     else: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })

  //   const result2 = mergeAllOf({
  //     then: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })

  //   expect(result2).toEqual({
  //     then: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })

  //   const result3 = mergeAllOf({
  //     if: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })

  //   expect(result3).toEqual({
  //     if: false,
  //     allOf: [{
  //       if: {
  //         required: ['prop1']
  //       },
  //       then: {},
  //       else: {}
  //     }]
  //   })
  // })

  it('works with undefined value, it is as if not there. NOT the same as empty schema', () => {
    const result = mergeAllOf({
      if: undefined,
      then: undefined,
      else: undefined,
      allOf: [{
        if: {
          required: ['prop1']
        },
        then: {},
        else: {}
      }]
    })

    expect(result).toEqual({
      if: {
        required: ['prop1']
      },
      then: {},
      else: {}
    })
  })

  it('removes empty allOf', () => {
    const result = mergeAllOf({
      if: {
        required: ['prop1']
      },
      then: {},
      else: {},
      allOf: [{
        properties: {
          name: {
            type: 'string'
          }
        }
      }]
    })

    expect(result).toEqual({
      properties: {
        name: {
          type: 'string'
        }
      },
      if: {
        required: ['prop1']
      },
      then: {},
      else: {}
    })
  })
});
