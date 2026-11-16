import { describe, expect, it } from "vitest";

import { schemaHash } from "./schema-hash.js";
import type { Schema } from "./schema.js";

function hash(value: unknown) {
  return schemaHash(value as Schema);
}

describe("schemaHash()", () => {
  it("sorts object keys", () => {
    expect(hash({ title: "a", type: "string" })).toBe(
      hash({ type: "string", title: "a" })
    );
  });

  it("ignores undefined and function properties", () => {
    expect(
      hash({
        type: "string",
        description: undefined,
        transform: () => {},
      })
    ).toBe(hash({ type: "string" }));
  });

  it("distinguishes undefined array items from null", () => {
    expect(hash({ enum: [undefined] })).not.toBe(hash({ enum: [null] }));
    expect(hash({ enum: [1, undefined, 2] })).not.toBe(
      hash({ enum: [1, null, 2] })
    );
  });
});
