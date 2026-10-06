import { beforeEach, describe, expect, test, vi } from "vitest";

import type { ActionResult } from "$app/forms";

import { applyAction } from "../../../mocks/app-forms.js";
import { goto, refreshAll } from "../../../mocks/app-navigation.js";
import { FORM_DATA_FILE_PREFIX, JSON_CHUNKS_KEY } from "../model.js";
import { createMeta } from "./meta.js";
import { createSvelteKitRequest } from "./request.svelte.js";

type Result = Record<string, unknown>;

/** The page the test browser is actually on */
const CURRENT = `${location.pathname}${location.search}`;

/** `deserialize` reads the action result straight off the wire */
function stubFetch(result: Result) {
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(JSON.stringify(result), {
          status: (result.status as number) ?? 200,
          headers: { "content-type": "application/json" },
        })
    )
  );
}

async function run(result: Result, options: Record<string, unknown> = {}) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = "/current";
  document.body.appendChild(form);

  stubFetch(result);

  const event = new Event("submit", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "currentTarget", { value: form });

  const meta = createMeta<{ default: any }, Record<string, never>>().default;
  const request = createSvelteKitRequest(meta as any, options as any);

  return request.runAsync({ name: "Jane" } as any, event as SubmitEvent);
}

beforeEach(() => {
  applyAction.mockClear();
  goto.mockClear();
  refreshAll.mockClear();
  document.body.innerHTML = "";
});

describe("createSvelteKitRequest result handling", () => {
  test("refreshes after a success by default", async () => {
    await run({ type: "success", status: 200, location: CURRENT });

    expect(refreshAll).toHaveBeenCalledOnce();
    expect(applyAction).toHaveBeenCalledOnce();
    expect(goto).not.toHaveBeenCalled();
  });

  test("does not refresh after a failure by default", async () => {
    await run({ type: "failure", status: 400, location: CURRENT });

    expect(refreshAll).not.toHaveBeenCalled();
    expect(applyAction).toHaveBeenCalledOnce();
  });

  test("`refreshAll: true` refreshes after a failure too", async () => {
    await run(
      { type: "failure", status: 400, location: CURRENT },
      { refreshAll: true }
    );

    expect(refreshAll).toHaveBeenCalledOnce();
  });

  test("`refreshAll: false` skips the refresh after a success", async () => {
    await run(
      { type: "success", status: 200, location: CURRENT },
      { refreshAll: false }
    );

    expect(refreshAll).not.toHaveBeenCalled();
    expect(applyAction).toHaveBeenCalledOnce();
  });

  // `ActionResult` declares `failure.status` as a required `number`
  test("carries `status` onto a failure result", async () => {
    const result = await run({
      type: "failure",
      status: 422,
      location: CURRENT,
    });

    expect((result as ActionResult).status).toBe(422);
  });

  test("follows a redirect without refreshing", async () => {
    await run({ type: "redirect", status: 303, location: "/elsewhere" });

    expect(goto).not.toHaveBeenCalled();
    expect(refreshAll).not.toHaveBeenCalled();
    expect(applyAction).toHaveBeenCalledOnce();
  });

  test("navigates when the result lands on another route", async () => {
    await run({ type: "success", status: 200, location: "/other" });

    expect(applyAction).not.toHaveBeenCalled();
    expect(goto).toHaveBeenCalledOnce();
    expect(String((goto.mock.calls[0] as unknown as [string])[0])).toContain(
      "/other"
    );
  });

  test("`navigate: false` applies the result to the current page instead", async () => {
    await run(
      { type: "success", status: 200, location: "/other" },
      { navigate: false }
    );

    expect(goto).not.toHaveBeenCalled();
    expect(applyAction).toHaveBeenCalledOnce();
  });

  // A differing query means the result belongs to a different URL, so Kit
  // navigates rather than updating in place
  test("navigates when only the query differs", async () => {
    const url = new URL(location.href);
    await run({
      type: "success",
      status: 200,
      location: `${url.pathname}?different=1`,
    });

    expect(applyAction).not.toHaveBeenCalled();
    expect(goto).toHaveBeenCalledOnce();
  });

  test("an error renders the error page instead of navigating", async () => {
    await run({ type: "error", error: { status: 500, message: "boom" } });

    expect(goto).not.toHaveBeenCalled();
    expect(applyAction).toHaveBeenCalledOnce();
    expect(refreshAll).not.toHaveBeenCalled();
  });

  test("a proxied HTML response becomes an error with the real status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("<html>login</html>", {
            status: 403,
            headers: { "content-type": "text/html" },
          })
      )
    );

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    document.body.appendChild(form);
    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(meta as any, {} as any);
    const result = await request.runAsync(
      { name: "Jane" } as any,
      event as SubmitEvent
    );

    expect(result.type).toBe("error");
    // Not a fabricated 500
    expect((result as { error: { status: number } }).error.status).toBe(403);
  });
});

describe("request payload", () => {
  // The request carries the form's own controls — read with `new FormData`,
  // exactly what a native submission would send.
  test("sends the form's controls", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    form.enctype = "multipart/form-data";

    const text = document.createElement("input");
    text.name = "root.firstName";
    text.value = "Jane";
    form.append(text);

    const checked = document.createElement("input");
    checked.type = "checkbox";
    checked.name = "root.agree";
    checked.checked = true;
    form.append(checked);

    const unchecked = document.createElement("input");
    unchecked.type = "checkbox";
    unchecked.name = "root.skipped";
    form.append(unchecked);

    const select = document.createElement("select");
    select.name = "root.color";
    for (const color of ["red", "green"]) {
      const option = document.createElement("option");
      option.value = color;
      select.append(option);
    }
    select.value = "green";
    form.append(select);

    const prefix = document.createElement("input");
    prefix.type = "hidden";
    prefix.name = "__sjsf_id_prefix";
    prefix.value = "custom";
    form.append(prefix);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(meta as any, {} as any);
    await request.runAsync({ name: "Jane" } as any, event as SubmitEvent);

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body as FormData;
    expect(body).toBeInstanceOf(FormData);
    expect(body.get("root.firstName")).toBe("Jane");
    expect(body.get("root.agree")).toBe("on");
    expect(body.has("root.skipped")).toBe(false);
    expect(body.get("root.color")).toBe("green");

    // The form's own id prefix input is required for the integration, so it
    // is sent as rendered instead of being overridden with the default.
    expect(body.getAll("__sjsf_id_prefix")).toEqual(["custom"]);
  });

  test("adds the configured id prefix when the form has none", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    form.enctype = "multipart/form-data";

    const text = document.createElement("input");
    text.name = "root.firstName";
    text.value = "Jane";
    form.append(text);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(meta as any, {} as any);
    await request.runAsync({ name: "Jane" } as any, event as SubmitEvent);

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body as FormData;
    expect(body.get("root.firstName")).toBe("Jane");
    expect(body.getAll("__sjsf_id_prefix")).toEqual(["root"]);
  });

  test("sends the value as JSON chunks with `useJsonChunks`", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    form.enctype = "multipart/form-data";
    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
        jsonChunkSize: 10,
      } as any
    );
    await request.runAsync(
      { firstName: "Jane", age: 33 } as any,
      event as SubmitEvent
    );

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body as FormData;
    const chunks = body.getAll(JSON_CHUNKS_KEY);
    // Tiny `jsonChunkSize` forces several chunks, proving they join back.
    expect(chunks.length).toBeGreaterThan(1);
    expect(JSON.parse(chunks.join(""))).toEqual({
      firstName: "Jane",
      age: 33,
    });
    expect(body.getAll("__sjsf_id_prefix")).toEqual(["root"]);
  });

  test("uploads as multipart when the payload holds Files on a non-multipart form", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    // Default enctype and no rendered file input: the File lives only in the
    // state. The guard has nothing rendered to check, so the multipart
    // switch below is what saves the upload.
    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync(
      { avatar: new File(["x"], "avatar.png") } as any,
      event as SubmitEvent
    );

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body;
    // `URLSearchParams` would stringify the File to "[object File]".
    expect(body).toBeInstanceOf(FormData);
    const file = (body as FormData).get(`${FORM_DATA_FILE_PREFIX}avatar`);
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe("avatar.png");
  });

  test("omits an empty nameless File from the chunks payload", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    // Only programmatic state can hold such a File: the widgets write
    // `undefined` for untouched and cleared inputs.
    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync(
      { avatar: new File([], "") } as any,
      event as SubmitEvent
    );

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body;
    // No real selection, so nothing trips multipart — and the key must stay
    // absent, like the parts path leaves it, rather than riding the params.
    expect(body).toBeInstanceOf(URLSearchParams);
    const params = body as URLSearchParams;
    expect(params.toString()).not.toContain("[object File]");
    expect(params.toString()).not.toContain(FORM_DATA_FILE_PREFIX);
    expect(JSON.parse(params.get(JSON_CHUNKS_KEY)!)).toEqual({});
  });

  test("still uploads a genuine zero-byte file that has a name", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync(
      { avatar: new File([], "empty.txt") } as any,
      event as SubmitEvent
    );

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body;
    expect(body).toBeInstanceOf(FormData);
    const file = (body as FormData).get(`${FORM_DATA_FILE_PREFIX}avatar`);
    expect(file).toBeInstanceOf(File);
    expect((file as File).name).toBe("empty.txt");
  });

  test("drops untouched file inputs from a non-multipart parts submission", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    // Parts mode: the payload is the rendered controls, and the untouched
    // input serializes as `File("")`.
    const file = document.createElement("input");
    file.type = "file";
    file.name = "avatar";
    form.append(file);

    const text = document.createElement("input");
    text.name = "root.firstName";
    text.value = "Jane";
    form.append(text);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(meta as any, {} as any);
    await request.runAsync({} as any, event as SubmitEvent);

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body;
    // Nothing selected, so nothing trips multipart — and the empty input
    // must stay out instead of riding the params as "[object File]".
    expect(body).toBeInstanceOf(URLSearchParams);
    const params = body as URLSearchParams;
    expect(params.toString()).not.toContain("[object File]");
    expect(params.has("avatar")).toBe(false);
    expect(params.get("root.firstName")).toBe("Jane");
  });

  test("does not throw for state-held Files with no rendered file input", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    // Default enctype and no rendered file input: the File lives only in the
    // state, which no native submission could send, so there is nothing to
    // warn about.
    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync(
      { avatar: new File(["x"], "avatar.png") } as any,
      event as SubmitEvent
    );

    expect(vi.mocked(fetch)).toHaveBeenCalledOnce();
  });

  test("throws in dev for a selected rendered file input on a non-multipart form", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";

    const file = document.createElement("input");
    file.type = "file";
    file.name = "avatar";
    const files = new DataTransfer();
    files.items.add(new File(["x"], "avatar.png"));
    file.files = files.files;
    form.append(file);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await expect(
      request.runAsync({} as any, event as SubmitEvent)
    ).rejects.toThrowError(/multipart\/form-data/);
  });

  test("trusts the rendered id prefix in JSON mode", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    form.enctype = "multipart/form-data";

    const prefix = document.createElement("input");
    prefix.type = "hidden";
    prefix.name = "__sjsf_id_prefix";
    prefix.value = "custom";
    form.append(prefix);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync({ name: "Jane" } as any, event as SubmitEvent);

    const body = vi.mocked(fetch).mock.calls[0]![1]!.body as FormData;
    expect(body.getAll("__sjsf_id_prefix")).toEqual(["custom"]);
  });

  test("ignores a disabled id prefix input", async () => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "/current";
    form.enctype = "multipart/form-data";

    const prefix = document.createElement("input");
    prefix.type = "hidden";
    prefix.name = "__sjsf_id_prefix";
    prefix.value = "custom";
    prefix.disabled = true;
    form.append(prefix);

    document.body.append(form);
    stubFetch({ type: "success", status: 200, location: CURRENT });

    const event = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "currentTarget", { value: form });

    const meta = createMeta<{ default: any }, Record<string, never>>().default;
    const request = createSvelteKitRequest(
      meta as any,
      {
        useJsonChunks: true,
      } as any
    );
    await request.runAsync({ name: "Jane" } as any, event as SubmitEvent);

    // A disabled input is invisible to `FormData`: trusting it would send a
    // prefix the server never receives alongside.
    const body = vi.mocked(fetch).mock.calls[0]![1]!.body as FormData;
    expect(body.getAll("__sjsf_id_prefix")).toEqual(["root"]);
  });
});
