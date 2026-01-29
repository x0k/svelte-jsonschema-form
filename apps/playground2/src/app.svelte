<script lang="ts">
  import { BitsConfig } from "bits-ui";
  import { Willow, WillowDark } from "@svar-ui/svelte-core";
  import { extendByRecord, fromRecord } from "@sjsf/form/lib/resolver";
  import { createComparator, createMerger } from "@sjsf/form/lib/json-schema";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import {
    ON_BLUR,
    ON_CHANGE,
    ON_INPUT,
    AFTER_CHANGED,
    AFTER_SUBMITTED,
    AFTER_TOUCHED,
    createForm,
    ON_ARRAY_CHANGE,
    ON_OBJECT_CHANGE,
    setFormContext,
    Form,
    Content,
    SubmitButton,
    type FormValue,
    getValueSnapshot,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
  } from "lz-string";
  import { DndContext, ClonedGhost } from "svelte-tiler/shared/dnd.svelte";
  import { fromRecord as registryFromRecord } from "svelte-tiler/shared/registry";
  import type { Constraint } from "svelte-tiler/shared/constraints";
  import { Tiler, type Tiles } from "svelte-tiler";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";
  import AlignLeft from "@lucide/svelte/icons/align-left";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import { THEME_TITLES, THEMES } from "./shared/theme.js";
  import {
    ALL_OF_STATE_BEHAVIOR,
    ALL_OF_STATE_BEHAVIOR_TITLES,
    ARRAY_MIN_ITEMS_POPULATE,
    ARRAY_MIN_ITEMS_POPULATE_TITLES,
    CONST_AS_DEFAULT_STATE_BEHAVIOR,
    CONST_AS_DEFAULT_STATE_BEHAVIOR_TITLES,
    EMPTY_OBJECT_FIELDS_BEHAVIOR,
    EMPTY_OBJECT_FIELDS_BEHAVIOR_TITLES,
    MERGE_DEFAULTS_INTO_FORM,
    MERGE_DEFAULTS_INTO_FORM_TITLES,
    icons,
    iconsStyles,
    resolvers,
    themes,
    themeStyles,
    validators,
    VALIDATOR_TITLES,
    type PlaygroundState,
    REAL_VALIDATORS,
  } from "./core/index.js";
  import { ShadowHost } from "./shadow/index.js";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import Editor from "./editor.svelte";
  import Popup from "./popup.svelte";
  import Bits from "./bits.svelte";
  import Select from "./select.svelte";
  import Noop from "./noop.svelte";

  import * as customComponents from "./custom-form-components/index.js";
  import { themeManager } from "./theme.svelte";
  import SamplePicker from "./sample-picker.svelte";
  import { setShadcnContext } from "./shadcn-context.js";
  import CopyFormData from "./copy-form-data.svelte";
  import Grip from "./grip.svelte";

  const DEFAULT_PLAYGROUND_STATE: PlaygroundState = {
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
    uiSchema: {},
    initialValue: undefined,
    disabled: false,
    html5Validation: false,
    focusOnFirstError: true,
    omitExtraData: false,
    fieldsValidationMode: 0,
    validator: "ajv8",
    theme: "basic",
    icons: "none",
    resolver: "compat",
    // Merger options
    arrayMinItemsPopulate: "all",
    arrayMinItemsMergeExtraDefaults: false,
    allOf: "skipDefaults",
    constAsDefault: "always",
    emptyObjectFields: "populateAllDefaults",
    mergeDefaultsIntoFormData: "useFormDataIfPresent",
  };

  function init(): PlaygroundState {
    if (location.hash) {
      try {
        return Object.assign(
          {},
          DEFAULT_PLAYGROUND_STATE,
          JSON.parse(
            decompressFromEncodedURIComponent(location.hash.substring(1)),
          ),
        );
      } catch {
        console.error("Failed to decode initial state");
      }
    }
    return DEFAULT_PLAYGROUND_STATE;
  }

  const data: PlaygroundState = $state(init());

  debouncedEffect(() => {
    $state.snapshot(data);
    return () => {
      const url = new URL(location.href);
      url.hash = compressToEncodedURIComponent(JSON.stringify(data));
      history.replaceState(null, "", url);
    };
  });

  const theme = $derived(extendByRecord(themes[data.theme], customComponents));
  const themeStyle = $derived(themeStyles[data.theme]);
  const iconsSet = $derived(data.icons && icons[data.icons]);
  const iconSetStyle = $derived(data.icons && iconsStyles[data.icons]);
  const fieldsValidationCount = $derived.by(() => {
    let count = 0;
    let snap = data.fieldsValidationMode;
    while (snap) {
      if (snap & 1) {
        count++;
      }
      snap = snap >> 1;
    }
    return count;
  });

  const { compareSchemaDefinitions, compareSchemaValues } = createComparator();
  const jsonSchemaMerger = createMerger({
    intersectJson: createIntersector(compareSchemaValues),
    deduplicateJsonSchemaDef: createDeduplicator(compareSchemaDefinitions),
  });

  let portalEl = $state.raw() as HTMLDivElement;
  const rootNode = $derived(portalEl?.getRootNode());

  const options = {
    getRootNode() {
      return rootNode;
    },
  };
  const portalOptions = {
    get target() {
      return portalEl;
    },
  };

  const focusOnFirstError = createFocusOnFirstError();
  const form = createForm({
    idBuilder: createFormIdBuilder,
    get resolver() {
      return resolvers[data.resolver];
    },
    value: [
      () => data.initialValue,
      (v) => {
        data.initialValue = v;
      },
    ],
    translation,
    get theme() {
      return theme;
    },
    get schema() {
      return data.schema;
    },
    get uiSchema() {
      return data.uiSchema;
    },
    validator: (options) => {
      const v = validators[data.validator]<FormValue>(options);
      return {
        ...v,
        validateFormValue(rootSchema, formValue) {
          return v.validateFormValue(
            rootSchema,
            data.omitExtraData
              ? omitExtraData(v, options.merger(), options.schema, formValue)
              : formValue,
          );
        },
      };
    },
    merger: (options) =>
      createFormMerger({
        ...options,
        jsonSchemaMerger,
        allOf: data.allOf,
        arrayMinItems: {
          populate: data.arrayMinItemsPopulate,
          mergeExtraDefaults: data.arrayMinItemsMergeExtraDefaults,
        },
        constAsDefaults: data.constAsDefault,
        emptyObjectFields: data.emptyObjectFields,
        mergeDefaultsIntoFormData: data.mergeDefaultsIntoFormData,
      }),
    get disabled() {
      return data.disabled;
    },
    get fieldsValidationMode() {
      return data.fieldsValidationMode;
    },
    get icons() {
      return iconsSet;
    },
    extraUiOptions: fromRecord({
      skeleton4Slider: options,
      skeleton4FileUpload: options,
      skeleton4RangeSlider: options,
      skeleton4Rating: options,
      skeleton4Segment: options,
      skeleton4Switch: options,
      skeleton4Tags: options,
      skeleton4DatePicker: options,
      skeleton4DatePickerPortal: portalOptions,
      skeleton4Combobox: options,
      skeleton4ComboboxPortal: portalOptions,
      skeleton4DateRangePicker: options,
      skeleton4DateRangePickerPortal: portalOptions,
    }),
    onSubmit(value) {
      console.log("submit", value);
    },
    onSubmitError(errors, e) {
      if (data.focusOnFirstError) {
        focusOnFirstError(errors, e, form);
      }
      console.log("errors", errors);
    },
  });
  setFormContext(form);

  setShadcnContext();

  const clearLink = new URL(location.href);
  clearLink.hash = "";

  const SvarProvider = $derived(
    data.theme === "svar" ? (themeManager.isDark ? WillowDark : Willow) : Noop,
  );

  const dnd = new DndContext({
    feedback: (e, el) => new ClonedGhost(el, e).attach(document.body),
  });
  const createLeaf = Leaf.setup(
    registryFromRecord({
      schema,
      uiSchema,
      formData,
      preview,
    }),
  );
  const createTabs = Tabs.setup({
    headers: registryFromRecord({
      gripHeader,
    }),
    actions: registryFromRecord({
      smartActions,
    }),
    createSplit({ parent, type, pivot, adjacent, offset }) {
      if (
        parent?.type === "split" &&
        parent.direction === type &&
        parent.id !== layout.id
      ) {
        const index =
          parent.children.findIndex((c) => c.id === pivot.id) + offset;
        Split.insertTile(parent, index, {
          tile: adjacent,
          constraints,
        });
        return parent;
      }
      const tiles = new Array<Split.SplitTileOptions>(2);
      tiles[1 - offset] = { tile: pivot, constraints };
      tiles[offset] = { tile: adjacent, constraints };
      const next = Split.create({
        gapPx,
        direction: type,
        children: tiles,
      });
      if (parent && parent.children.length > 1) {
        const index = parent.children.findIndex((c) => c.id === pivot.id);
        parent.children[index] = next;
        return parent;
      }
      return next;
    },
  });
  const gapPx = 8;
  const constraints: Constraint[] = [
    { type: "minSize", unit: "px", value: 70 },
  ];
  const saved = localStorage.getItem("layout");
  let layout = $state(
    saved
      ? JSON.parse(saved)
      : Split.create({
          gapPx,
          children: [
            {
              weight: 4,
              constraints,
              tile: Split.create({
                gapPx,
                direction: "column",
                children: [
                  {
                    constraints,
                    tile: createTabs({
                      actions: "smartActions",
                      tabHeader: "gripHeader",
                      tabs: [["Schema", createLeaf("schema")]],
                    }),
                  },
                  {
                    constraints,
                    tile: Split.create({
                      gapPx,
                      children: [
                        {
                          constraints,
                          tile: createTabs({
                            actions: "smartActions",
                            tabHeader: "gripHeader",
                            tabs: [["UI Schema", createLeaf("uiSchema")]],
                          }),
                        },
                        {
                          constraints,
                          tile: createTabs({
                            actions: "smartActions",
                            tabHeader: "gripHeader",
                            tabs: [["Form Data", createLeaf("formData")]],
                          }),
                        },
                      ],
                    }),
                  },
                ],
              }),
            },
            {
              weight: 3,
              constraints,
              tile: createTabs({
                actions: "smartActions",
                tabHeader: "gripHeader",
                tabs: [["Preview", createLeaf("preview")]],
              }),
            },
          ],
        }),
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(layout);
    return () => {
      localStorage.setItem("layout", JSON.stringify(snap));
    };
  });

  const editors: Record<string, Editor<any>> = $state({});
</script>

<div
  class="py-4 px-8 gap-4 h-screen grid grid-rows-[auto_1fr] grid-cols-1 dark:scheme-dark"
>
  <div class="flex flex-wrap items-center gap-2">
    <a href={clearLink.toString()} class="text-3xl font-bold mr-auto"
      >Playground</a
    >
    <SamplePicker
      onSelect={(sample) => {
        Object.assign(data, sample);
      }}
    />
    <Popup>
      {#snippet label()}
        Form options ({+data.disabled +
          +data.html5Validation +
          +data.focusOnFirstError +
          +data.omitExtraData})
      {/snippet}
      <Label>
        <Checkbox bind:checked={data.disabled} />
        Disabled
      </Label>
      <Label>
        <Checkbox bind:checked={data.html5Validation} />
        HTML5 validation
      </Label>
      <Label>
        <Checkbox bind:checked={data.focusOnFirstError} />
        Focus on first error
      </Label>
      <Label>
        <Checkbox bind:checked={data.omitExtraData} />
        Omit extra data
      </Label>
    </Popup>
    <Popup>
      {#snippet label()}
        Fields validation ({fieldsValidationCount})
      {/snippet}
      <Bits
        title="Triggers"
        bind:value={data.fieldsValidationMode}
        flags={[
          [ON_INPUT, "On Input"],
          [ON_CHANGE, "On Change"],
          [ON_BLUR, "On Blur"],
          [ON_ARRAY_CHANGE, "Array Changed"],
          [ON_OBJECT_CHANGE, "Object Changed"],
        ]}
      />
      <Bits
        title="Modifiers"
        bind:value={data.fieldsValidationMode}
        flags={[
          [AFTER_CHANGED, "After Changed"],
          [AFTER_TOUCHED, "After Touched"],
          [AFTER_SUBMITTED, "After Submitted"],
        ]}
      />
    </Popup>
    <Popup>
      {#snippet label()}
        Merger options
      {/snippet}
      <Select
        label="Populate minItems in arrays"
        bind:value={data.arrayMinItemsPopulate}
        items={ARRAY_MIN_ITEMS_POPULATE}
        labels={ARRAY_MIN_ITEMS_POPULATE_TITLES}
      />
      <Label>
        <Checkbox bind:checked={data.arrayMinItemsMergeExtraDefaults} />
        Merge array defaults with formData
      </Label>
      <Select
        label="allOf defaults behavior"
        bind:value={data.allOf}
        items={ALL_OF_STATE_BEHAVIOR}
        labels={ALL_OF_STATE_BEHAVIOR_TITLES}
      />
      <Select
        label="const as default behavior"
        bind:value={data.constAsDefault}
        items={CONST_AS_DEFAULT_STATE_BEHAVIOR}
        labels={CONST_AS_DEFAULT_STATE_BEHAVIOR_TITLES}
      />
      <Select
        label="Object fields default behavior"
        bind:value={data.emptyObjectFields}
        items={EMPTY_OBJECT_FIELDS_BEHAVIOR}
        labels={EMPTY_OBJECT_FIELDS_BEHAVIOR_TITLES}
      />
      <Select
        label="Merge defaults into formData"
        bind:value={data.mergeDefaultsIntoFormData}
        items={MERGE_DEFAULTS_INTO_FORM}
        labels={MERGE_DEFAULTS_INTO_FORM_TITLES}
      />
    </Popup>
    <Select
      label="Resolver"
      bind:value={data.resolver}
      items={Object.keys(resolvers)}
    />
    <Select
      label="Validator"
      bind:value={data.validator}
      items={REAL_VALIDATORS}
      labels={VALIDATOR_TITLES}
    />
    <Select label="Theme" bind:value={data.theme} items={Object.keys(themes)} />
    <Select label="Icons" bind:value={data.icons} items={Object.keys(icons)} />
    <Select
      label="App theme"
      bind:value={themeManager.theme}
      items={THEMES}
      labels={THEME_TITLES}
    />
    <Button
      variant="ghost"
      size="icon"
      href="https://x0k.github.io/svelte-jsonschema-form/"
    >
      <OpenBook class="size-6" />
    </Button>
    <Button
      target="_blank"
      href="https://github.com/x0k/svelte-jsonschema-form/"
      size="icon"
      variant="ghost"
    >
      <Github class="size-6" />
    </Button>
  </div>
  <Tiler
    bind:layout
    {dnd}
    definitions={{ leaf: Leaf, split: Split, tabs: Tabs }}
  />
</div>

{#snippet gripHeader(tile: Tiles["tabs"], index: number)}
  <Grip />
  {tile.titles[index]}
{/snippet}

{#snippet smartActions(tile: Tiles["tabs"])}
  {#if tile.titles[tile.selectedTab] === "Preview"}
    <CopyFormData />
  {:else}
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
  {/if}
{/snippet}

{#snippet schema()}
  <Editor bind:this={editors["schema"]} bind:value={data.schema} />
{/snippet}

{#snippet uiSchema()}
  <Editor bind:this={editors["uiSchema"]} bind:value={data.uiSchema} />
{/snippet}

{#snippet formData()}
  <Editor
    bind:this={editors["formData"]}
    bind:value={
      () => getValueSnapshot(form),
      (v) => {
        data.initialValue = v;
      }
    }
  />
{/snippet}

{#snippet preview()}
  <ShadowHost id="shadow-host" style={`${themeStyle}\n${iconSetStyle}`}>
    <style>
      .wx-willow-theme,
      .wx-willow-dark-theme {
        height: auto !important;
        min-height: 100%;
      }
    </style>
    <BitsConfig defaultPortalTo={portalEl}>
      <SvarProvider>
        <svelte:boundary>
          <Form
            attributes={{
              id: "form",
              class: themeManager.darkOrLight,
              style:
                "min-height: 100%; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;",
              novalidate: !data.html5Validation || undefined,
              ["data-theme"]: data.theme.startsWith("skeleton")
                ? "cerberus"
                : themeManager.darkOrLight,
            }}
          >
            <Content />
            <SubmitButton />
          </Form>
          {#snippet failed(error, reset)}
            {@const _ = setTimeout(reset, 1000)}
            <p style="color: red; padding: 1rem;">{error}</p>
          {/snippet}
        </svelte:boundary>
      </SvarProvider>
    </BitsConfig>
    <div bind:this={portalEl}></div>
  </ShadowHost>
{/snippet}

<style>
  @reference './app.css';
  :global {
    [data-split] {
      --resizer-len: var(--gap);
      --resizer-offset: calc(-50% - var(--gap) / 2);

      width: 100%;
      height: 100%;
    }
    [data-split-item] {
      position: relative;
    }
    [data-split-resizer] {
      position: absolute;
      inset: 0;
    }
    [data-dir="row"] > [data-split-item] > [data-split-resizer] {
      cursor: col-resize;
      width: var(--resizer-len);
      transform: translateX(var(--resizer-offset));
    }
    [data-dir="column"] > [data-split-item] > [data-split-resizer] {
      cursor: row-resize;
      height: var(--resizer-len);
      transform: translateY(var(--resizer-offset));
    }
    [data-tabs] {
      @apply flex flex-col rounded-md border h-full bg-background;
    }
    [data-tabs-bar] {
      @apply flex border-b p-2 gap-1;
    }
    [data-tabs-list] {
      @apply flex gap-1 overflow-x-auto;
      scrollbar-width: thin;
    }
    [data-tabs-header] {
      @apply flex gap-1 items-center py-1 pl-2 pr-3 rounded-sm;
      &[aria-selected="true"] {
        @apply bg-muted-foreground/20 text-accent-foreground;
      }
      &:hover {
        @apply bg-muted-foreground/30;
      }
      &[data-over="true"] {
        @apply bg-chart-2/70;
      }
    }
    [data-tabs-spacer] {
      @apply grow h-full rounded-sm;
      &[data-over="true"] {
        @apply bg-chart-2/70;
      }
    }
    [data-tabs-content] {
      @apply grow overflow-auto relative;
      &::after {
        @apply bg-chart-2/70 rounded-md;
        content: "";
        position: absolute;
        pointer-events: none;
        transition: inset 160ms ease;
      }
      &[data-over="true"] {
        &::after {
          opacity: 0.4;
        }
        &[data-hpart="center"][data-vpart="center"]::after {
          inset: 0;
        }

        &[data-hpart="start"]::after {
          inset: 0 50% 0 0;
        }

        &[data-hpart="end"]::after {
          inset: 0 0 0 50%;
        }

        &[data-hpart="center"][data-vpart="start"]::after {
          inset: 0 0 50% 0;
        }

        &[data-hpart="center"][data-vpart="end"]::after {
          inset: 50% 0 0 0;
        }
      }
    }
  }
</style>
