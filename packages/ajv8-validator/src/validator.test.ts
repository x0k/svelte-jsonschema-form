import { describe, it } from "vitest";

import { createFormValidator } from "./validator.js";

describe("Validator", () => {
  it("Should compile schemas with identical ids", () => {
    const validator = createFormValidator();

    validator.isValid({ $id: "foo" }, {}, undefined);
    validator.isValid({ $id: "foo" }, {}, undefined);
  });
  it("Should compile schemas with subSchemas with identical ids", () => {
    const validator = createFormValidator();

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
