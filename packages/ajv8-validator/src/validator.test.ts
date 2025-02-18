import { Ajv } from "ajv";
import { describe, it } from "vitest";

import { DEFAULT_AJV_CONFIG } from "./model.js";
import { createSyncFormValidator } from "./validator.js";

describe("Validator", () => {
  it("Should compile schemas with identical ids", () => {
    const validator = createSyncFormValidator();

    validator.isValid({ $id: "foo" }, {}, undefined);
    validator.isValid({ $id: "foo" }, {}, undefined);
  });
  it("Should compile schemas with subSchemas with identical ids", () => {
    const validator = createSyncFormValidator();

    validator.isValid(
      { $id: "foo", properties: { foo: { $id: "bar" } } },
      {},
      undefined
    );
    validator.isValid(
      { $id: "foo", properties: { foo: { $id: "bar" } } },
      {},
      undefined
    );
  });
});
