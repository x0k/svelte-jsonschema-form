import { createFormValidator } from "@sjsf/ajv8-validator";
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX } from "@sjsf/form";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { beforeEach, describe, expect, it } from "vitest";

import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from "../model.js";
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
  it("Should parse JSON chunks when present", async () => {
    fd.append(JSON_CHUNKS_KEY, '{"firstName":"Ja');
    fd.append(JSON_CHUNKS_KEY, 'ne"}');
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: {
        type: "object",
        properties: { firstName: { type: "string" } },
        required: ["firstName"],
      },
    });
    const c = new AbortController();
    const [form, data] = await parse(c.signal, fd);
    expect(form.isValid).toBe(true);
    expect(data).toEqual({ firstName: "Jane" });
  });
  it("Should report malformed JSON chunks at the root instead of throwing", async () => {
    fd.append(JSON_CHUNKS_KEY, "{bad");
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: {
        type: "object",
        properties: { firstName: { type: "string" } },
      },
    });
    const c = new AbortController();
    const [form] = await parse(c.signal, fd);
    expect(form.isValid).toBe(false);
    expect(form.errors).toHaveLength(1);
    expect(form.errors[0]!.path).toEqual([]);
    expect(form.updateData).toBe(false);
  });
  it("Should resolve file markers, including deduplicated keys", async () => {
    // Two files under the same key: the replacer disambiguates the second
    // part with an `__1` suffix, and the reviver looks each marker up.
    const marker = (key: string) => `${FORM_DATA_FILE_PREFIX}${key}`;
    fd.append(
      JSON_CHUNKS_KEY,
      JSON.stringify({ a: { x: marker("x") }, b: { x: marker("x__1") } })
    );
    const fileA = new File(["a"], "a.txt");
    const fileB = new File(["b"], "b.txt");
    fd.append(marker("x"), fileA);
    fd.append(marker("x__1"), fileB);
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      // No `convertUnknownEntry`: the chunks branch never runs entry
      // conversion, so this also proves the JSON path skips it.
      schema: { type: "object" },
    });
    const c = new AbortController();
    const [form, data] = await parse(c.signal, fd);
    expect(form.isValid).toBe(true);
    expect(data).toEqual({ a: { x: fileA }, b: { x: fileB } });
  });
  it("Should parse a file under the chunks key as parts, not JSON", async () => {
    // A parts-mode field could theoretically carry the chunks key: only
    // string parts decode as chunks, so a file entry takes the parts path.
    fd.append(JSON_CHUNKS_KEY, new File([], ""));
    const parse = createFormHandler({
      validator: createFormValidator,
      merger: createFormMerger,
      schema: { type: "object" },
    });
    const c = new AbortController();
    const [form, data] = await parse(c.signal, fd);
    expect(form.isValid).toBe(true);
    expect(data).toEqual({});
  });
});
