import { createFormValidator } from "@sjsf/ajv8-validator";
import type { Logger, Schema } from "@sjsf/form";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { defaultFormValueHandler } from "@sjsf/form/value-handlers/default";
import { describe, expect, it, vi } from "vitest";

const testLogger: Logger = {
  warn() {},
  error() {},
};

vi.mock("$app/server", () => ({
  getRequestEvent: () => {
    throw new Error("request_event_unavailable");
  },
}));

const { createServerValidator } = await import("./server.js");

const schema: Schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
  },
};

describe("createServerValidator without a request", () => {
  // `validate` reads the request event inside its `try`, so a missing request
  // surfaces as the generic error rather than throwing out.
  it("should return unexpected error when there is no active request", async () => {
    const v = createServerValidator({
      schema: schema as Schema,
      validator: createFormValidator,
      merger: createFormMerger,
      valueHandler: defaultFormValueHandler,
      logger: testLogger,
    });
    const result = await v.validate({ firstName: "John" });
    expect(result.issues).toBeDefined();
  });
});
