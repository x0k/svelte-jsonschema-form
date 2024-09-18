import { describe, expect, it } from "vitest";
import * as utils from "@rjsf/utils";

import { defaultsSchema } from "./fixtures/schemas";

import { findSchemaDefinition } from "./definitions";

describe("findSchemaDefinition", () => {
  it("Should work", () => {
    const ref = "#/definitions/defaultsExample";
    expect(findSchemaDefinition(ref, defaultsSchema)).toEqual(
      utils.findSchemaDefinition(ref, defaultsSchema)
    );
  });
});
