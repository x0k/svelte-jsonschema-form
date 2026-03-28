<script lang="ts">
  import { createMerger as createSchemaMerger } from "@sjsf/form/mergers/modern";
  import { createComparator, createMerger } from "@sjsf/form/lib/json-schema";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import { fromRecord } from "svelte-tiler/shared/registry";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";
  import AlignLeft from "@lucide/svelte/icons/align-left";

  import Select from "$lib/select.svelte";
  import Editor from "$lib/editor.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import { Button } from "$lib/components/ui/button/index.js";
  import { debouncedEffect } from "$lib/svelte.svelte.js";

  import {
    REAL_VALIDATORS,
    VALIDATOR_TITLES,
    validators,
    type ValidatorPageState,
  } from "@/core/index.js";

  import Header from "./header.svelte";
  import { router } from "./router.js";
  import {
    constraints,
    createApplySplit,
    createTilerContext,
    gapPx,
  } from "./lib/tiler.js";

  const DEFAULT_PAGE_STATE: ValidatorPageState = {
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
    input: undefined,
    output: undefined,
    validator: "ajv8",
  };

  const data = $state(router.load(DEFAULT_PAGE_STATE));

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
  const validator = $derived(
    validators[data.validator]({
      merger: () => merger,
    }),
  );

  debouncedEffect(() => {
    data.schema;
    data.input;
    validator;
    return () => {
      try {
        data.output =
          validator.validateFormValue(data.schema, data.input).errors ?? [];
      } catch (err) {
        console.error(err);
        data.output = [{ path: [], message: String(err) }];
      }
    };
  });

  const ctx = createTilerContext();
  setTilerContext(ctx);
  const createLeaf = Leaf.setup(
    fromRecord({
      schema,
      input,
      output,
    }),
  );
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
        }),
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(layout);
    return () => {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(snap));
    };
  });

  const editors: Record<string, Editor<any>> = $state({});
</script>

{#snippet editorActions(tile: Tiles["tabs"])}
  <Button
    size="sm"
    variant="ghost"
    onclick={() => {
      const child = tile.children[tile.selectedTab];
      if (child && child.type === "leaf") {
        editors[child.name]?.format();
      }
    }}
  >
    <AlignLeft />
  </Button>
{/snippet}

{#snippet schema()}
  <Editor bind:this={editors["schema"]} bind:value={data.schema} />
{/snippet}

{#snippet input()}
  <Editor bind:this={editors["input"]} bind:value={data.input} />
{/snippet}

{#snippet output()}
  <Editor bind:this={editors["output"]} bind:value={data.output} />
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
  <Select
    label="Validator"
    bind:value={data.validator}
    items={REAL_VALIDATORS}
    labels={VALIDATOR_TITLES}
  />
</Header>
<Panel bind:layout />
