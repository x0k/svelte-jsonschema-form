import { Ajv } from "ajv";
import { describe, it } from "vitest";

import { DEFAULT_AJV_CONFIG } from "./model.js";
import { Validator } from "./validator.js";

describe("Validator", () => {
  it("Should compile schemas with identical ids", () => {
    const validator = new Validator({ ajv: new Ajv(DEFAULT_AJV_CONFIG) });

    validator.isValid({ $id: "foo" }, {}, undefined);
    validator.isValid({ $id: "foo" }, {}, undefined);
  });
  it("Should compile schemas with subSchemas with identical ids", () => {
    const validator = new Validator({ ajv: new Ajv(DEFAULT_AJV_CONFIG) });

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
