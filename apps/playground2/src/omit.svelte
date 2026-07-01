<script lang="ts">
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import { createFormValidator } from "@sjsf/ajv8-validator";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import { createComparator, createMerger } from "@sjsf/form/lib/json-schema";
  import { createMerger as createSchemaMerger } from "@sjsf/form/mergers/modern";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import {
    parseFormData,
    parseSchemaObject,
    type OmitState,
  } from "meta/playground";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import { fromRecord } from "svelte-tiler/shared/registry";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import Editor from "$lib/editor2.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import {
    constraints,
    createApplySplit,
    createTilerContext,
    gapPx,
  } from "$lib/tiler.js";

  import Header from "./header.svelte";
  import { router } from "./router.js";
  import { createFormatTask, createParseQuery } from "./shared.svelte";

  const DEFAULT_PAGE_STATE: OmitState = {
    schema: JSON.stringify(
      {
        type: "object",
        title: "Person",
        properties: {
          name: { type: "string" },
          age: { type: "number" },
        },
        required: ["name"],
      },
      null,
      2
    ),
    input: JSON.stringify(
      {
        name: "John",
        age: 30,
        extraField: "should be omitted",
        anotherExtra: 42,
      },
      null,
      2
    ),
    output: "",
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
  const validator = createFormValidator();

  const schemaQuery = createParseQuery({
    parse: parseSchemaObject,
    get input() {
      return data.schema;
    },
    defaultValue: {},
  });

  const inputQuery = createParseQuery({
    parse: parseFormData,
    get input() {
      return data.input;
    },
    defaultValue: undefined,
  });

  debouncedEffect(() => {
    const schema = schemaQuery.value;
    const value = inputQuery.value;
    return () => {
      try {
        const result = omitExtraData(validator, merger, schema, value);
        data.output = JSON.stringify(result, null, 2);
      } catch (err) {
        data.output = String(err);
      }
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

  const LAYOUT_KEY = "omit-layout";
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
      format("javascript", data[n], (f) => {
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
  <Editor bind:value={data.output} class="h-full" />
{/snippet}

<Header
  transitions={{
    "": () => ({ schema: data.schema, initialValue: data.input }),
    v: () => ({ schema: data.schema, input: data.input }),
    m: () => ({ schema: data.schema }),
    o: () => data,
  }}
></Header>
<Panel bind:layout />
