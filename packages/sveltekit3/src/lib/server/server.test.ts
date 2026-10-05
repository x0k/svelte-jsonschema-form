import { createFormValidator } from "@sjsf/ajv8-validator";
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX } from "@sjsf/form";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { beforeEach, describe, expect, it } from "vitest";

import { createFormHandler } from "./server.js";

describe("makeFormDataParser", () => {
  let fd: FormData;

  beforeEach(() => {
    fd = new FormData();
    fd.append(SJSF_ID_PREFIX, DEFAULT_ID_PREFIX);
  });

  it("Should handle File objects", async () => {
    fd.append("root", new File(["hello"], "test.txt", { type: "text/plain" }));
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: {
        type: "string",
        format: "data-url",
      },
    });
    const c = new AbortController();
    const [, data] = await parse(c.signal, fd);
    expect(data).toBe("data:text/plain;name=test.txt;base64,aGVsbG8=");
  });
  it("Should omit empty nameless file", async () => {
    fd.append("root", new File([], "", { type: "" }));
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: {
        type: "string",
        format: "data-url",
      },
    });
    const c = new AbortController();
    const [, data] = await parse(c.signal, fd);
    expect(data).toBe(undefined);
  });
  // An undecodable value comes back as a field issue instead of failing the
  // request, so the form renders with the error on it.
  it("Should report an undecodable value against its own field", async () => {
    fd.append("root", "text");
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: {},
      sendData: true,
    });
    const c = new AbortController();
    const [form] = await parse(c.signal, fd);
    expect(form.isValid).toBe(false);
    expect(form.errors).toHaveLength(1);
    expect(form.errors[0]!.path).toEqual([]);
    // With no parsed data there is nothing trustworthy to push back: pushing
    // the `{}` initializer would wipe what the user typed.
    expect(form.updateData).toBe(false);
  });
});
