import { createFormValidator } from "@sjsf/ajv8-validator";
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX, type Schema } from "@sjsf/form";
import { fromRecord } from "@sjsf/form/lib/resolver";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { describe, expect, it, vi } from "vitest";

const mockRequest = new Request("http://localhost");
vi.mock("$app/server", () => ({
  getRequestEvent: () => ({ request: mockRequest }),
}));

const { createServerValidator } = await import("./server.js");

const schema: Schema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
  },
  required: ["firstName"],
};

function opts(overrides?: Record<string, unknown>) {
  return {
    schema: schema as Schema,
    validator: createFormValidator,
    merger: createFormMerger,
    ...overrides,
  };
}

function formData(data: Record<string, unknown>) {
  return {
    [SJSF_ID_PREFIX]: DEFAULT_ID_PREFIX,
    [DEFAULT_ID_PREFIX]: data,
  };
}

describe("createServerValidator", () => {
  it("should return ~standard and validate method", () => {
    const v = createServerValidator(opts());
    expect(v["~standard"]).toBeDefined();
    expect(typeof v.validate).toBe("function");
    expect(v["~standard"].version).toBe(1);
    expect(v["~standard"].vendor).toBe("svelte-jsonschema-form");
  });

  it("should fail when input is not a record", async () => {
    const v = createServerValidator(opts());
    const result = await v.validate("not a record");
    expect(result.issues).toBeDefined();
    expect(result.issues![0].message).toContain("Expected record");
  });

  it("should fail when idPrefix is missing", async () => {
    const v = createServerValidator(opts());
    const result = await v.validate({});
    expect(result.issues).toBeDefined();
    expect(result.issues![0].message).toContain("Missing or invalid id prefix");
  });

  it("should fail when idPrefix is not a string", async () => {
    const v = createServerValidator(opts());
    const result = await v.validate({ [SJSF_ID_PREFIX]: 123 });
    expect(result.issues).toBeDefined();
    expect(result.issues![0].message).toContain("Missing or invalid id prefix");
  });

  it("should validate valid form data", async () => {
    const v = createServerValidator(opts());
    const data = { firstName: "John", lastName: "Doe" };
    const result = await v.validate(formData(data));
    expect(result).toEqual({
      value: {
        data,
        idPrefix: DEFAULT_ID_PREFIX,
      },
    });
  });

  it("should return validation errors for invalid data", async () => {
    const v = createServerValidator(opts());
    const data = { lastName: "Doe" };
    const result = await v.validate(formData(data));
    expect(result.issues).toBeDefined();
  });

  it("should use custom idPrefix", async () => {
    const v = createServerValidator(opts());
    const data = { firstName: "Jane" };
    const result = await v.validate({
      [SJSF_ID_PREFIX]: "myform",
      myform: data,
    });
    expect(result).toEqual({
      value: {
        data,
        idPrefix: "myform",
      },
    });
  });

  it("should use custom translation for missing idPrefix error", async () => {
    const v = createServerValidator(
      opts({
        serverTranslation: fromRecord({
          "missing-or-invalid-id-prefix-key": "CUSTOM ERROR",
        }),
      })
    );
    const result = await v.validate({});
    expect(result.issues![0].message).toBe("CUSTOM ERROR");
  });

  it("should use custom translation for non-record error", async () => {
    const v = createServerValidator(
      opts({
        serverTranslation: fromRecord({
          "expected-record": ({ input }: { input: unknown }) =>
            `Got ${typeof input}`,
        }),
      })
    );
    const result = await v.validate(42);
    expect(result.issues![0].message).toBe("Got number");
  });

  it("should report an undecodable value against its own field", async () => {
    const v = createServerValidator(
      opts({
        schema: {
          type: "object",
          properties: { color: { type: "string", enum: ["red"] } },
        } as Schema,
      })
    );
    const result = await v.validate(formData({ color: "nope" }));
    expect(result.issues).toHaveLength(1);
    expect(result.issues![0]!.path).toEqual(["color"]);
  });
});
