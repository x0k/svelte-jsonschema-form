/**
 * Generic browser performance cases for form rendering and updates.
 *
 * Run through `scripts/bench/perf.mjs`, which copies this directory into each
 * git worktree, starts a local result sink, and prints a ref-to-ref comparison.
 * The file is not part of the regular test projects.
 *
 * Updates are dispatched as DOM events so the same suite runs on refs with
 * different form value APIs.
 */

import { createFormValidator } from "@sjsf/ajv8-validator";
import {
  BasicForm,
  createForm,
  getValueSnapshot,
  type FieldPath,
  type FormOptions,
  type Schema,
} from "@sjsf/form";
import { DEFAULT_ID_PREFIX } from "@sjsf/form";
import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { resolver } from "@sjsf/form/resolvers/basic";
import "@sjsf/form/fields/extra/enum-include";
import "@sjsf/form/fields/extra/multi-enum-include";
import "@sjsf/form/templates/extra/optional-array-include";
import "@sjsf/form/templates/extra/optional-field-include";
import "@sjsf/form/templates/extra/optional-multi-field-include";
import "@sjsf/form/templates/extra/optional-object-include";
import { translation } from "@sjsf/form/translations/en";
import { tick } from "svelte";
import { afterEach, test } from "vitest";
import { render } from "vitest-browser-svelte";

import { theme } from "../../src/index.js";
import "../../src/specs.js";

const idBuilder = createFormIdBuilder({ idPrefix: DEFAULT_ID_PREFIX });

const defaults = {
  theme,
  translation,
  resolver,
  validator: createFormValidator,
  merger: createFormMerger,
  idBuilder,
};

const fields = (import.meta.env.VITE_SJSF_BENCH_FIELDS ?? "100,400,1000")
  .split(",")
  .map(Number);
const samples = Number(import.meta.env.VITE_SJSF_BENCH_SAMPLES ?? 15);
const warmup = Math.min(3, samples);

const sink = import.meta.env.VITE_SJSF_BENCH_URL as string | undefined;

async function report(result: {
  case: string;
  fields: number;
  samples: number[];
}) {
  if (sink === undefined) {
    console.log(`PERF ${JSON.stringify(result)}`);
    return;
  }
  await fetch(sink, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(result),
  });
}

function makePlainSchema(count: number): Schema {
  return {
    type: "object",
    properties: Object.fromEntries(
      Array.from({ length: count }, (_, index) => [
        `field${index}`,
        { type: "string" },
      ])
    ),
  };
}

function makeConditionalSchema(count: number): Schema {
  return {
    type: "object",
    properties: {
      ...Object.fromEntries(
        Array.from({ length: count }, (_, index) => [
          `field${index}`,
          { type: "string" },
        ])
      ),
      mode: { type: "string", enum: ["a", "b"], default: "a" },
    },
    dependencies: {
      mode: {
        oneOf: [
          {
            properties: {
              mode: { const: "a" },
              cfg: {
                type: "object",
                default: { name: "a" },
                properties: { name: { type: "string", default: "a" } },
              },
            },
          },
          {
            properties: {
              mode: { const: "b" },
              cfg: {
                type: "object",
                default: { name: "b" },
                properties: { name: { type: "string", default: "b" } },
              },
            },
          },
        ],
      },
    },
  } as Schema;
}

function makePlainValue(count: number) {
  return Object.fromEntries(
    Array.from({ length: count }, (_, index) => [
      `field${index}`,
      `value${index}`,
    ])
  );
}

function makeConditionalValue(count: number) {
  return { ...makePlainValue(count), mode: "a", cfg: { name: "a" } };
}

function makeForm(schema: Schema, value: unknown) {
  return createForm<any>({
    ...defaults,
    schema,
    initialValue: value,
  } as FormOptions<any>);
}

function inputByName(path: string[]) {
  const name = idBuilder.fromPath(path as unknown as FieldPath);
  const input = document.querySelector<HTMLInputElement>(
    `input[name="${name}"]`
  );
  if (input === null) {
    throw new Error(`Input "${name}" is not rendered`);
  }
  return input;
}

function setTextInputValue(input: HTMLInputElement, value: string) {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

async function withRenderedForm(
  schema: Schema,
  value: unknown,
  run: () => Promise<void>
) {
  const form = makeForm(schema, value);
  getValueSnapshot(form);
  const result = await render(BasicForm, { props: { form } });
  await tick();
  try {
    await run();
  } finally {
    result.unmount();
    document.body.innerHTML = "";
  }
}

async function measureUpdates(
  name: string,
  count: number,
  schema: Schema,
  value: unknown,
  update: (index: number) => void
) {
  await withRenderedForm(schema, value, async () => {
    for (let index = 0; index < warmup; index++) {
      update(index);
      await tick();
    }
    const times: number[] = [];
    for (let index = 0; index < samples; index++) {
      const start = performance.now();
      update(index);
      await tick();
      times.push(performance.now() - start);
    }
    await report({ case: name, fields: count, samples: times });
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

test("conditional schema: edit unrelated field", async () => {
  for (const count of fields) {
    await measureUpdates(
      "edit-conditional",
      count,
      makeConditionalSchema(count),
      makeConditionalValue(count),
      (index) => {
        setTextInputValue(
          inputByName([`field${count - 1}`]),
          `updated-${index}`
        );
      }
    );
  }
});

test("plain schema: edit unrelated field", async () => {
  for (const count of fields) {
    await measureUpdates(
      "edit",
      count,
      makePlainSchema(count),
      makePlainValue(count),
      (index) => {
        setTextInputValue(
          inputByName([`field${count - 1}`]),
          `updated-${index}`
        );
      }
    );
  }
});

test("conditional schema: edit nested field", async () => {
  for (const count of fields) {
    await measureUpdates(
      "edit-nested",
      count,
      makeConditionalSchema(count),
      makeConditionalValue(count),
      (index) => {
        setTextInputValue(inputByName(["cfg", "name"]), `updated-${index}`);
      }
    );
  }
});

test("conditional schema: swap branch", async () => {
  for (const count of fields) {
    let mode = "a";
    await measureUpdates(
      "branch-swap",
      count,
      makeConditionalSchema(count),
      makeConditionalValue(count),
      () => {
        mode = mode === "a" ? "b" : "a";
        setTextInputValue(inputByName(["mode"]), mode);
      }
    );
  }
});

test("conditional schema: create form", async () => {
  for (const count of fields) {
    const schema = makeConditionalSchema(count);
    const value = makeConditionalValue(count);
    for (let index = 0; index < warmup; index++) {
      getValueSnapshot(makeForm(schema, value));
    }
    const times: number[] = [];
    for (let index = 0; index < samples; index++) {
      const start = performance.now();
      getValueSnapshot(makeForm(schema, value));
      times.push(performance.now() - start);
    }
    await report({ case: "create", fields: count, samples: times });
  }
});
