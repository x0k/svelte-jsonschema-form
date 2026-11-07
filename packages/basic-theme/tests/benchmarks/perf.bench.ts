/**
 * Browser performance cases for the form value pipeline.
 *
 * Run through `scripts/bench/perf.mjs`, which starts a local sink and prints
 * the collected samples. The file is not part of the regular test projects.
 */

import { createFormValidator } from "@sjsf/ajv8-validator";
import {
  BasicForm,
  createForm,
  getValueSnapshot,
  setValueAtPath,
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

const defaults = {
  theme,
  translation,
  resolver,
  validator: createFormValidator,
  merger: createFormMerger,
  idBuilder: createFormIdBuilder({ idPrefix: DEFAULT_ID_PREFIX }),
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

function makeDependencySchema(count: number): Schema {
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

function makeDependencyValue(count: number) {
  return { ...makePlainValue(count), mode: "a", cfg: { name: "a" } };
}

function makeForm(schema: Schema, value: unknown) {
  return createForm<any>({
    ...defaults,
    schema,
    initialValue: value,
  } as FormOptions<any>);
}

async function withRenderedForm(
  schema: Schema,
  value: unknown,
  run: (form: ReturnType<typeof makeForm>) => Promise<void>
) {
  const form = makeForm(schema, value);
  getValueSnapshot(form);
  const result = await render(BasicForm, { props: { form } });
  await tick();
  try {
    await run(form);
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
  update: (form: ReturnType<typeof makeForm>, index: number) => void
) {
  await withRenderedForm(schema, value, async (form) => {
    for (let index = 0; index < warmup; index++) {
      update(form, index);
      await tick();
    }
    const times: number[] = [];
    for (let index = 0; index < samples; index++) {
      const start = performance.now();
      update(form, index);
      await tick();
      times.push(performance.now() - start);
    }
    await report({ case: name, fields: count, samples: times });
  });
}

afterEach(() => {
  document.body.innerHTML = "";
});

test("dependency schema: unrelated field update", async () => {
  for (const count of fields) {
    await measureUpdates(
      "dependency-unrelated",
      count,
      makeDependencySchema(count),
      makeDependencyValue(count),
      (form, index) => {
        setValueAtPath(form, [`field${count - 1}`], `updated-${index}`);
      }
    );
  }
});

test("plain schema: unrelated field update", async () => {
  for (const count of fields) {
    await measureUpdates(
      "plain-unrelated",
      count,
      makePlainSchema(count),
      makePlainValue(count),
      (form, index) => {
        setValueAtPath(form, [`field${count - 1}`], `updated-${index}`);
      }
    );
  }
});

test("dependency schema: nested field update", async () => {
  for (const count of fields) {
    await measureUpdates(
      "dependency-nested",
      count,
      makeDependencySchema(count),
      makeDependencyValue(count),
      (form, index) => {
        setValueAtPath(form, ["cfg", "name"], `updated-${index}`);
      }
    );
  }
});

test("dependency schema: branch swap", async () => {
  for (const count of fields) {
    let mode = "a";
    await measureUpdates(
      "branch-swap",
      count,
      makeDependencySchema(count),
      makeDependencyValue(count),
      (form) => {
        mode = mode === "a" ? "b" : "a";
        setValueAtPath(form, ["mode"], mode);
      }
    );
  }
});

test("dependency schema: create form", async () => {
  for (const count of fields) {
    const schema = makeDependencySchema(count);
    const value = makeDependencyValue(count);
    for (let index = 0; index < warmup; index++) {
      getValueSnapshot(makeForm(schema, value));
    }
    const times: number[] = [];
    for (let index = 0; index < samples; index++) {
      const start = performance.now();
      getValueSnapshot(makeForm(schema, value));
      times.push(performance.now() - start);
    }
    await report({ case: "dependency-create", fields: count, samples: times });
  }
});
