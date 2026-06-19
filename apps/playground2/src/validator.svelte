<script lang="ts">
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import {
    isAsyncFormValueValidator,
    type FormValue,
    type Schema,
    type SchemaValue,
    type ValidationResult,
  } from "@sjsf/form";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import { createComparator, createMerger } from "@sjsf/form/lib/json-schema";
  import { isObject } from "@sjsf/form/lib/object";
  import {
    abortPrevious,
    createQuery,
    createTask,
    debounce,
    type FailedTask,
  } from "@sjsf/form/lib/task.svelte";
  import { createMerger as createSchemaMerger } from "@sjsf/form/mergers/modern";
  import { singleOption } from "@sjsf/form/options.svelte";
  import { createFormValidator as noop } from "@sjsf/form/validators/noop";
  import {
    normalizeValidatorState,
    playgroundValidator,
    type PlaygroundValidator2,
    type ValidatorState,
  } from "meta/playground";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import { fromRecord } from "svelte-tiler/shared/registry";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";

  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Editor from "$lib/editor2.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import Select from "$lib/select.svelte";
  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import {
    constraints,
    createApplySplit,
    createTilerContext,
    gapPx,
  } from "$lib/tiler.js";

  import Header from "./header.svelte";
  import { router } from "./router.js";
  import {
    createFormatTask,
    createParseQuery,
    createValidatorMapper,
  } from "./shared.svelte";

  const DEFAULT_PAGE_STATE: ValidatorState = {
    schema: {
      type: "object",
      title: "Basic form",
      properties: {
        hello: {
          title: "Hello",
          type: "string",
        },
      },
      required: ["hello"],
    },
    input: null,
    output: undefined,
    validator: "ajv8",
  };

  const data = $state(normalizeValidatorState(router.load(DEFAULT_PAGE_STATE)));

  debouncedEffect(() => {
    const snap = $state.snapshot(data);
    return () => router.store(snap);
  });

  const { compareSchemaDefinitions, compareSchemaValues } = createComparator();
  const jsonSchemaMerger = createMerger({
    intersectJson: createIntersector(compareSchemaValues),
    deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
  });
  const merger = createSchemaMerger({ jsonSchemaMerger });

  const validatorFactory = $derived(
    playgroundValidator(data.validator)({
      merger: () => merger,
    })
  );

  function createOnFailure(label: string) {
    return (err: FailedTask<unknown>) => {
      if (err.reason === "error") {
        console.error(label, err.error);
        data.output = `"${label}: ${err.error}"`;
      } else if (err.reason === "timeout") {
        data.output = `"${label}: Validation failed due timeout"`;
      }
    };
  }

  const schemaQuery = createParseQuery<object>({
    get input() {
      return data.schema;
    },
    defaultValue: {},
    guard: isObject,
  });

  const validatorQuery = createQuery<
    [typeof validatorFactory, Schema],
    Awaited<ReturnType<typeof validatorFactory>>
  >({
    deps: () => [validatorFactory, schemaQuery.value],
    execute: debounce((_, f, s) => f(s)),
    onFailure: createOnFailure("Validator creation"),
  });

  const { schema: jsonSchema, validator } = $derived(
    validatorQuery.result ?? {
      schema: {} satisfies Schema as Schema,
      validator: noop(),
    }
  );

  const validateTask = createTask<
    [typeof validator, Schema, FormValue],
    ValidationResult<unknown>
  >({
    combinator: abortPrevious,
    execute: debounce(async (signal, validator, schema, value) =>
      isAsyncFormValueValidator(validator)
        ? validator.validateFormValueAsync(signal, schema, value)
        : validator.validateFormValue(schema, value)
    ),
    onSuccess(result) {
      data.output = JSON.stringify(result.errors ?? [], null, 2);
    },
    onFailure: createOnFailure("Validation"),
  });

  const inputQuery = createParseQuery({
    get input() {
      return data.input;
    },
    guard: (_v): _v is FormValue => true,
    defaultValue: undefined,
  });

  $effect(() => {
    validateTask.run(validator, jsonSchema, inputQuery.value);
    return () => {
      validateTask.abort();
    };
  });

  const ctx = createTilerContext();
  setTilerContext(ctx);
  const LEAFS = {
    schema,
    input,
    output,
  };
  const createLeaf = Leaf.setup(fromRecord(LEAFS));
  const createTabs = Tabs.setup({
    headers: fromRecord({
      gripHeader,
    }),
    actions: fromRecord({
      editorActions,
    }),
    applySplit: createApplySplit(ctx),
  });
  const LAYOUT_KEY = "validator-layout";
  const saved = localStorage.getItem(LAYOUT_KEY);
  let layout = $state(
    saved
      ? JSON.parse(saved)
      : Split.create({
          gapPx,
          children: [
            {
              constraints,
              tile: createTabs({
                actions: "editorActions",
                tabHeader: "gripHeader",
                tabs: [["Schema", createLeaf("schema")]],
              }),
            },
            {
              constraints,
              tile: createTabs({
                actions: "editorActions",
                tabHeader: "gripHeader",
                tabs: [["Input", createLeaf("input")]],
              }),
            },
            {
              constraints,
              tile: createTabs({
                actions: "editorActions",
                tabHeader: "gripHeader",
                tabs: [["Output", createLeaf("output")]],
              }),
            },
          ],
        })
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(layout);
    return () => {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(snap));
    };
  });

  const { mapper, items, labels } = createValidatorMapper();
  const mappedValidator = singleOption({
    mapper: () => mapper,
    value: () => data.validator as unknown as SchemaValue,
    update: (v) => {
      if (v === undefined) {
        return;
      }
      data.validator = v as unknown as PlaygroundValidator2;
    },
  });

  const outputQuery = createParseQuery({
    get input() {
      return data.output;
    },
    guard: isObject,
    defaultValue: [],
  });

  function isLeafName(k: string): k is keyof typeof LEAFS {
    return k in LEAFS;
  }

  const format = createFormatTask();
</script>

{#snippet editorActions(tile: Tiles["tabs"])}
  <Button
    size="sm"
    variant="ghost"
    onclick={() => {
      const child = tile.children[tile.selectedTab];
      if (!child || child.type !== "leaf" || !isLeafName(child.name)) {
        return;
      }
      const n = child.name;
      format(data[n], (f) => {
        data[n] = f;
      });
    }}
  >
    <AlignLeft />
  </Button>
{/snippet}

{#snippet schema()}
  <Editor
    bind:value={data.schema}
    class="h-full"
    data-state={schemaQuery.state}
  />
{/snippet}

{#snippet input()}
  <Editor
    bind:value={data.input}
    class="h-full"
    data-state={inputQuery.state}
  />
{/snippet}

{#snippet output()}
  <Editor
    bind:value={data.output}
    class="h-full"
    data-state={outputQuery.state}
  />
{/snippet}

<Header
  transitions={{
    "": () => ({
      schema: data.schema,
      initialValue: data.input,
      validator: data.validator,
    }),
    v: () => data,
    m: () => ({
      schema: data.schema,
      deduplicateJsonSchemas: true,
      intersectJson: true,
    }),
  }}
>
  <ButtonGroup.Root>
    <Select
      label="Validator"
      bind:value={mappedValidator.current}
      {items}
      {labels}
    />
  </ButtonGroup.Root>
</Header>
<Panel bind:layout />
