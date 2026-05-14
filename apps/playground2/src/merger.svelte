<script lang="ts">
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import {
    createComparator,
    createDeepAllOfMerge,
    createMerger,
    createShallowAllOfMerge,
  } from "@sjsf/form/lib/json-schema";
  import { fromRecord } from "svelte-tiler/shared/registry";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import type { MergerState } from 'meta/playground'

  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Editor from "$lib/editor.svelte";
  import Popup from "$lib/popup.svelte";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { gripHeader } from "$lib/grip-header.svelte";
  import {
    constraints,
    createApplySplit,
    createTilerContext,
    gapPx,
  } from "$lib/tiler.js";

  import Header from "./header.svelte";
  import { router } from "./router.js";

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

  const data = $state(router.load(DEFAULT_PAGE_STATE));

  debouncedEffect(() => {
    const snap = $state.snapshot(data);
    return () => router.store(snap);
  });

  debouncedEffect(() => {
    data.schema;
    data.deep;
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
    return () => {
      try {
        data.output = (data.deep ? deepMerge : shallowMerge)(data.schema);
      } catch (err) {
        data.output = String(err);
        console.error(err);
      }
    };
  });

  const ctx = createTilerContext();
  setTilerContext(ctx);
  const createLeaf = Leaf.setup(
    fromRecord({
      schema,
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

{#snippet output()}
  <Editor bind:this={editors["output"]} bind:value={data.output} />
{/snippet}

<Header
  transitions={{
    "": () => ({ schema: data.schema }),
    v: () => ({ schema: data.schema }),
    m: () => data,
  }}
>
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
</Header>
<Panel bind:layout />
