import type { FormOptions } from "@sjsf/form";
import { DEFAULT_ID_PREFIX, SJSF_ID_PREFIX } from "@sjsf/form";
import { afterEach, describe, expect, test } from "vitest";
import { render } from "vitest-browser-svelte";

import * as defaults from "../../../routes/form-defaults.js";
import ConnectProbe from "./__test__/connect-probe.svelte";

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

afterEach(() => {
  document.body.innerHTML = "";
});

describe("connect submission", () => {
  // The injected form carries the visible form's own parts — read with
  // `new FormData`, exactly what a native submission would send.
  async function renderFilled(
    actionId: string = FORM_ID,
    prefixValue?: string
  ) {
    const { connected, screen } = await renderConnected(actionId);
    const original = screen
      .getByTestId("original")
      .element() as HTMLFormElement;
    const field = (name: string) => `${name}/${FORM_ID}`;

    const text = document.createElement("input");
    text.name = field("root.firstName");
    text.value = "Jane";
    original.append(text);

    const checked = document.createElement("input");
    checked.type = "checkbox";
    checked.name = field("root.agree");
    checked.checked = true;
    original.append(checked);

    const unchecked = document.createElement("input");
    unchecked.type = "checkbox";
    unchecked.name = field("root.skipped");
    original.append(unchecked);

    const select = document.createElement("select");
    select.name = field("root.color");
    for (const color of ["red", "green"]) {
      const option = document.createElement("option");
      option.value = color;
      select.append(option);
    }
    select.value = "green";
    original.append(select);

    const multi = document.createElement("select");
    multi.multiple = true;
    multi.name = field("root.tags");
    for (const tag of ["a", "b"]) {
      const option = document.createElement("option");
      option.value = tag;
      option.selected = true;
      multi.append(option);
    }
    original.append(multi);

    const file = document.createElement("input");
    file.type = "file";
    file.name = field("root.avatar");
    const files = new DataTransfer();
    files.items.add(new File(["x"], "a.png", { type: "image/png" }));
    file.files = files.files;
    original.append(file);

    if (prefixValue !== undefined) {
      const prefix = document.createElement("input");
      prefix.type = "hidden";
      prefix.name = `${SJSF_ID_PREFIX}/${FORM_ID}`;
      prefix.value = prefixValue;
      original.append(prefix);
    }

    return { connected, screen };
  }

  test("copies the visible controls into the injected form", async () => {
    const { connected, screen } = await renderFilled(FORM_ID, "custom");

    const inputs = await submitWith(connected, screen, {});

    const byName = (name: string) =>
      inputs
        .filter((input) => input.name === `${name}/${FORM_ID}`)
        .map((input) =>
          input.type === "file" ? input.files![0]!.name : input.value
        );
    expect(byName("root.firstName")).toEqual(["Jane"]);
    expect(byName("root.agree")).toEqual(["on"]);
    expect(byName("root.skipped")).toEqual([]);
    expect(byName("root.color")).toEqual(["green"]);
    expect(byName("root.tags")).toEqual(["a", "b"]);
    expect(byName("root.avatar")).toEqual(["a.png"]);

    // The form's own id prefix input is sent as rendered instead of being
    // overridden with the configured value.
    const prefixes = inputs.filter(
      (input) => input.name === `${SJSF_ID_PREFIX}/${FORM_ID}`
    );
    expect(prefixes).toHaveLength(1);
    expect(prefixes[0]!.value).toBe("custom");
  });

  test("adds the configured id prefix when the form has none", async () => {
    const { connected, screen } = await renderFilled();

    const inputs = await submitWith(connected, screen, {});

    const prefixes = inputs.filter(
      (input) => input.name === `${SJSF_ID_PREFIX}/${FORM_ID}`
    );
    expect(prefixes).toHaveLength(1);
    expect(prefixes[0]!.value).toBe(DEFAULT_ID_PREFIX);
  });

  test("a keyed remote form copies names without the key", async () => {
    // Kit builds `action_id` as `id + "/" + JSON.stringify(key)`
    const { connected, screen } = await renderFilled(
      `${FORM_ID}/${JSON.stringify("my-key")}`
    );

    const inputs = await submitWith(connected, screen, {});

    expect(inputs.length).toBeGreaterThan(0);
    for (const input of inputs) {
      expect(input.name).not.toContain("my-key");
    }
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
