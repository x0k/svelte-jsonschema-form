import type { FormOptions } from "@sjsf/form";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";

import * as defaults from "../../../routes/form-defaults.js";
import { JSON_CHUNKS_KEY } from "../../model.js";
import ConnectProbe from "./__test__/connect-probe.svelte";
import type { ConnectReplacerOptions } from "./client.svelte.js";

/** Stands in for the symbol Kit puts on a `RemoteForm` */
const ATTACH = Symbol("attach");

const FORM_ID = "kd7yhg/createPost";

function createFakeRemoteForm(actionId: string = FORM_ID) {
  const detached: number[] = [];
  return {
    // `getRemoteFormFieldId` reads the id out of the `/remote` query param
    action: `/current?/remote=${encodeURIComponent(actionId)}`,
    fields: {
      value: () => ({}),
      allIssues: () => undefined,
    },
    // Kit's attachment returns the cleanup that removes the listeners it added
    // (see `form.svelte.js` in `@sveltejs/kit`), which `connect()` hands back to
    // `onMount`. Counting the calls is what proves the cleanup is not dropped.
    [ATTACH]: () => () => {
      detached.push(1);
    },
    detached,
  };
}

async function renderConnected(
  actionId: string = FORM_ID,
  options: Record<string, unknown> = {}
) {
  let connected: Partial<FormOptions<any>> | undefined;
  const remoteForm = createFakeRemoteForm(actionId);
  const screen = await render(ConnectProbe, {
    remoteForm,
    options: { ...defaults, ...options },
    connected: (value: Partial<FormOptions<any>>) => {
      connected = value;
    },
  });
  await expect.element(screen.getByTestId("original")).toBeInTheDocument();
  return { connected: connected!, screen, remoteForm };
}

/**
 * Runs `connect`'s submit handler and returns the inputs of the form it
 * injects, which is what Kit reads the submission from.
 *
 * Those inputs are cleared once the submission resolves, so they have to be
 * captured while Kit's submit event is still being dispatched.
 */
async function submitWith(
  connected: Partial<FormOptions<any>>,
  screen: Awaited<ReturnType<typeof render>>,
  value: unknown
) {
  const original = screen.getByTestId("original").element() as HTMLFormElement;
  const event = new Event("submit", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "target", { value: original });

  let captured: HTMLInputElement[] = [];
  const capture = (e: Event) => {
    if (
      e.target instanceof HTMLFormElement &&
      !e.target.hasAttribute("data-testid")
    ) {
      captured = Array.from(e.target.querySelectorAll("input"));
    }
  };
  document.addEventListener("submit", capture, true);
  try {
    await connected.onSubmit!(value, event as unknown as SubmitEvent);
  } finally {
    document.removeEventListener("submit", capture, true);
  }
  return captured;
}

function chunkValue(inputs: HTMLInputElement[]): any {
  const chunks = inputs
    .filter((input) => input.name.startsWith(JSON_CHUNKS_KEY))
    .map((input) => input.value);
  expect(chunks.length).toBeGreaterThan(0);
  return JSON.parse(chunks.join(""));
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("connect field names", () => {
  // Kit v3 runs `parse_form_key` over every submitted field name and throws
  // `form_field_unbound` unless it ends with `/{formId}`, which made a `File`
  // in the value fail the whole submission.
  test("the injected file input is suffixed with the form id", async () => {
    const { connected, screen } = await renderConnected();

    const inputs = await submitWith(connected, screen, {
      avatar: new File(["x"], "avatar.png"),
    });
    const fileInput = inputs.find((input) => input.type === "file");

    expect(fileInput).toBeDefined();
    expect(fileInput!.name.endsWith(`/${FORM_ID}`)).toBe(true);
  });

  test("every injected field name is suffixed with the form id", async () => {
    const { connected, screen } = await renderConnected();

    const inputs = await submitWith(connected, screen, {
      avatar: new File(["x"], "avatar.png"),
      name: "Jane",
    });

    expect(inputs.length).toBeGreaterThan(1);
    for (const input of inputs) {
      expect(input.name.endsWith(`/${FORM_ID}`)).toBe(true);
    }
  });

  test("the suffix stays out of the JSON payload", async () => {
    const { connected, screen } = await renderConnected();

    const inputs = await submitWith(connected, screen, {
      avatar: new File(["x"], "avatar.png"),
    });
    const chunk = chunkValue(inputs);
    expect(chunk.avatar).toBeTypeOf("string");
    expect(chunk.avatar.endsWith(`/${FORM_ID}`)).toBe(false);
  });

  test("a keyed remote form is suffixed with the id without its key", async () => {
    // Kit builds `action_id` as `id + "/" + JSON.stringify(key)`
    const { connected, screen } = await renderConnected(
      `${FORM_ID}/${JSON.stringify("my-key")}`
    );

    const inputs = await submitWith(connected, screen, {
      avatar: new File(["x"], "avatar.png"),
    });
    const fileInput = inputs.find((input) => input.type === "file");

    expect(fileInput!.name.endsWith(`/${FORM_ID}`)).toBe(true);
    expect(fileInput!.name).not.toContain("my-key");
  });

  // `createReplacer` takes its context as one options object, so a custom
  // replacer can apply the same `/{formId}` suffix the default one does
  test("a custom `createReplacer` receives the form element and field suffix", async () => {
    const received: ConnectReplacerOptions[] = [];
    const { connected, screen } = await renderConnected(FORM_ID, {
      createReplacer: (options: ConnectReplacerOptions) => {
        received.push(options);
        return (key: string, value: any) =>
          value instanceof File ? `custom/${key}` : value;
      },
    });

    await submitWith(connected, screen, { avatar: new File(["x"], "a.png") });

    expect(received).toHaveLength(1);
    expect(received[0].fieldSuffix).toBe(`/${FORM_ID}`);
    expect(received[0].formElement).toBeInstanceOf(HTMLFormElement);
  });

  test("a custom `createReplacer` replaces the default `File` handling", async () => {
    const { connected, screen } = await renderConnected(FORM_ID, {
      createReplacer: () => (key: string, value: any) =>
        value instanceof File ? `custom/${key}` : value,
    });

    const inputs = await submitWith(connected, screen, {
      avatar: new File(["x"], "a.png"),
    });

    // No file input was injected, since the custom replacer did not add one
    expect(inputs.find((input) => input.type === "file")).toBeUndefined();
    expect(chunkValue(inputs).avatar).toBe("custom/avatar");
  });
});

describe("connect teardown", () => {
  // Kit's attachment returns the cleanup that removes the listeners it added to
  // the form it is given. `connect()` only has `onMount` to return it from, so
  // dropping it would leave those listeners bound for the page's lifetime.
  test("hands Kit's attachment cleanup back to `onMount`", async () => {
    const { screen, remoteForm } = await renderConnected();

    expect(remoteForm.detached).toHaveLength(0);

    await screen.unmount();

    expect(remoteForm.detached).toHaveLength(1);
  });
});
