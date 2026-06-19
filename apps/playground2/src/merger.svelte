<script lang="ts">
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import {
    createComparator,
    createDeepAllOfMerge,
    createMerger,
    createShallowAllOfMerge,
  } from "@sjsf/form/lib/json-schema";
  import { isObject, isRecord } from "@sjsf/form/lib/object";
  import { normalizeMergerState, type MergerState } from "meta/playground";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import { fromRecord } from "svelte-tiler/shared/registry";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";

  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import Editor from "$lib/editor2.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import Popup from "$lib/popup.svelte";
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

  const DEFAULT_PAGE_STATE: MergerState = {
    schema: {
      allOf: [
        {
          type: "object",
          properties: {
            foo: { type: "string" },
          },
        },
        { required: ["foo"] },
      ],
    },
    output: {},
    deep: false,
    intersectJson: false,
    deduplicateJsonSchemas: false,
  };

  const data = $state(normalizeMergerState(router.load(DEFAULT_PAGE_STATE)));

  debouncedEffect(() => {
    const snap = $state.snapshot(data);
    return () => router.store(snap);
  });

  const schemaQuery = createParseQuery({
    get input() {
      return data.schema;
    },
    defaultValue: {},
    guard: isRecord,
  });

  const merge = $derived.by(() => {
    const { compareSchemaDefinitions, compareSchemaValues } =
      createComparator();
    const { mergeArrayOfSchemaDefinitions } = createMerger({
      intersectJson: data.intersectJson
        ? createIntersector(compareSchemaValues)
        : undefined,
      deduplicateJsonSchemaDef: data.deduplicateJsonSchemas
        ? createDeduplicator(compareSchemaDefinitions)
        : undefined,
    });
    const shallowMerge = createShallowAllOfMerge(mergeArrayOfSchemaDefinitions);
    const deepMerge = createDeepAllOfMerge(shallowMerge);
    return data.deep ? deepMerge : shallowMerge;
  });

  debouncedEffect(() => {
    merge;
    const schema = schemaQuery.value;
    return () => {
      try {
        data.output = JSON.stringify(merge(schema), null, 2);
      } catch (err) {
        data.output = String(err);
        console.error(err);
      }
    };
  });

  const ctx = createTilerContext();
  setTilerContext(ctx);
  const LEAFS = {
    schema,
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

  const LAYOUT_KEY = "merger-layout";
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

{#snippet output()}
  <Editor
    bind:value={data.output}
    class="h-full"
    data-state={outputQuery.state}
  />
{/snippet}

<Header
  transitions={{
    "": () => ({ schema: data.schema }),
    v: () => ({ schema: data.schema }),
    m: () => data,
  }}
>
  <ButtonGroup.Root>
    <Popup>
      {#snippet label()}
        Options ({+data.deep +
          +data.intersectJson +
          +data.deduplicateJsonSchemas})
      {/snippet}
      <Label>
        <Checkbox bind:checked={data.intersectJson} />
        Intersect JSON values (enum keyword)
      </Label>
      <Label>
        <Checkbox bind:checked={data.deduplicateJsonSchemas} />
        Deduplicate JSON Schemas (combinator keywords)
      </Label>
      <Label>
        <Checkbox bind:checked={data.deep} />
        Merge nested `allOf`
      </Label>
    </Popup>
  </ButtonGroup.Root>
</Header>
<Panel bind:layout />
