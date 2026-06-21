<script lang="ts">
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import {
    isAsyncFormValueValidator,
    type FormValidator,
    type FormValue,
    type Schema,
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
  import { createFormValidator as noop } from "@sjsf/form/validators/noop";
  import {
    isDraft2020,
    normalizeValidatorState,
    parseFormData,
    parseSchemaObject,
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
    createMergerTransition,
    createParseQuery,
    createValidatorMapper,
    validatorForSchemaDraft,
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

  const schemaQuery = createParseQuery({
    parse: parseSchemaObject,
    get input() {
      return data.schema;
    },
    defaultValue: {},
  });
  const schemaDraft2020 = $derived(isDraft2020(schemaQuery.value));

  const deps = (): [PlaygroundValidator2, object] => [
    data.validator,
    schemaQuery.value,
  ];
  const validatorOptions = {
    merger: () => merger,
  };
  const validatorQuery = createQuery<
    [PlaygroundValidator2, Schema],
    { schema: Schema; validator: FormValidator<unknown> }
  >({
    get deps() {
      return schemaQuery.state === "loading" ? undefined : deps;
    },
    execute: debounce((_, v, s) =>
      playgroundValidator(validatorForSchemaDraft(v, s))(validatorOptions)(s)
    ),
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
    parse: parseFormData,
    get input() {
      return data.input;
    },
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

  const { mapped, items, labels } = $derived(
    createValidatorMapper(data, schemaDraft2020)
  );

  const outputQuery = createParseQuery({
    parse: parseFormData,
    get input() {
      return data.output;
    },
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
    m: createMergerTransition(data),
  }}
>
  <ButtonGroup.Root>
    <Select label="Validator" bind:value={mapped.current} {items} {labels} />
  </ButtonGroup.Root>
</Header>
<Panel bind:layout />
