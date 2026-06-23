<script lang="ts">
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import Copy from "@lucide/svelte/icons/copy";
  import Download from "@lucide/svelte/icons/download";
  import ExternalLink from "@lucide/svelte/icons/external-link";
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
    getValueSnapshot,
    type FormMerger,
  } from "@sjsf/form";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import { createDeduplicator, createIntersector } from "@sjsf/form/lib/array";
  import { createComparator, createMerger } from "@sjsf/form/lib/json-schema";
  import { extendByRecord, fromRecord } from "@sjsf/form/lib/resolver";
  import {
    abortPrevious,
    createTask,
    debounce,
  } from "@sjsf/form/lib/task.svelte";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { StringEnumValueMapperBuilder } from "@sjsf/form/options.svelte";
  import { translation } from "@sjsf/form/translations/en";
  import { withOmitExtraData } from "@sjsf/form/validators/omit-extra-data";
  import { Willow, WillowDark } from "@svar-ui/svelte-core";
  import { BitsConfig } from "bits-ui";
  import { themeOrSubThemeTitle } from "meta";
  import { codegemIsJsonSchemaValidator } from "meta/codegen";
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
    PLAYGROUND_ICON_SETS,
    PLAYGROUND_ICON_SET_STYLES,
    PLAYGROUND_RESOLVERS,
    PLAYGROUND_SJSF_THEMES,
    PLAYGROUND_SJSF_THEME_STYLES,
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES,
    playgroundIconSetTitle,
    playgroundIconSets,
    playgroundResolvers,
    playgroundThemes,
    type FormState,
    normalizeFormState,
    parseFormData,
    parseUiSchema,
    type PresetEntry,
    type NormalizedFormPreset,
    schemaTypeFromValidator,
  } from "meta/playground";
  import {
    SANDBOX_PLATFORMS,
    sandboxPlatformLabel,
    sandboxPlatformIcon,
  } from "meta/sandbox";
  import "meta/playground/augmentations";
  import { toast } from "svelte-sonner";
  import { Panel, setTilerContext, type Tile, type Tiles } from "svelte-tiler";
  import { fromRecord as registryFromRecord } from "svelte-tiler/shared/registry";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";

  import Bits from "$lib/bits.svelte";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import * as Separator from "$lib/components/ui/separator/index.js";
  import { copyTextToClipboard } from "$lib/copy-to-clipboard";
  import Editor from "$lib/editor2.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import Noop from "$lib/noop.svelte";
  import Popup from "$lib/popup.svelte";
  import Select from "$lib/select.svelte";
  import { ShadowHost } from "$lib/shadow/index.js";
  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import {
    constraints,
    createApplySplit,
    createLayoutStore,
    createTilerContext,
    gapPx,
    transformLayout,
  } from "$lib/tiler.js";
  import Header from "@/header.svelte";
  import { router } from "@/router.js";
  import { setShadcnContext } from "@/shadcn-context.js";
  import {
    createFormatTask,
    createMergerTransition,
    createOnFailure,
    createParseQuery,
    createValidatorState,
    checkSignal,
    convertAndFormatTypedSchema,
    type Lang,
  } from "@/shared.svelte";
  import { themeManager } from "@/theme.svelte";

  import CopyFormData from "./copy-form-data.svelte";
  import * as customComponents from "./custom-form-components/index.js";
  import { getChangedMergerOptionsCount } from "./merger-options";
  import { openSandbox } from "./open-sandbox";
  import SamplePicker from "./sample-picker.svelte";

  const DEFAULT_PLAYGROUND_STATE: FormState = {
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
    initialValue: null,
    css: "",
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

  let originalInitialValue = $state.raw("");
  const data = $state(
    (() => {
      const data = normalizeFormState(router.load(DEFAULT_PLAYGROUND_STATE));
      originalInitialValue = data.initialValue;
      return data;
    })()
  );

  const theme = $derived(
    extendByRecord(PLAYGROUND_SJSF_THEMES[data.theme], customComponents)
  );
  const themeStyle = $derived(PLAYGROUND_SJSF_THEME_STYLES[data.theme]);
  const themeGlobalStyle = $derived(
    PLAYGROUND_SJSF_GLOBAL_THEME_STYLES[data.theme]
  );
  const iconsSet = $derived(data.icons && PLAYGROUND_ICON_SETS[data.icons]);
  const iconSetStyle = $derived(
    data.icons && PLAYGROUND_ICON_SET_STYLES[data.icons]
  );
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

  const changedMergerOptionsCount = $derived(
    getChangedMergerOptionsCount(data)
  );

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

  const validatorState = createValidatorState(data, {
    merger: () => merger,
  });

  const merger: FormMerger = $derived(
    createFormMerger({
      schema: validatorState.schema,
      validator: validatorState.validator,
      jsonSchemaMerger,
      allOf: data.allOf,
      arrayMinItems: {
        populate: data.arrayMinItemsPopulate,
        mergeExtraDefaults: data.arrayMinItemsMergeExtraDefaults,
      },
      constAsDefaults: data.constAsDefault,
      emptyObjectFields: data.emptyObjectFields,
      mergeDefaultsIntoFormData: data.mergeDefaultsIntoFormData,
    })
  );

  const initialValueQuery = createParseQuery({
    parse: parseFormData,
    get input() {
      return data.initialValue;
    },
    defaultValue: undefined,
  });

  const uiSchemaQuery = createParseQuery({
    parse: parseUiSchema,
    get input() {
      return data.uiSchema;
    },
    defaultValue: {},
  });

  const focusOnFirstError = createFocusOnFirstError();
  const formValidator = $derived(
    data.omitExtraData
      ? withOmitExtraData(validatorState.validator)
      : validatorState.validator
  );
  const form = createForm({
    translation,
    idBuilder: createFormIdBuilder,
    get resolver() {
      return PLAYGROUND_RESOLVERS[data.resolver];
    },
    get initialValue() {
      return initialValueQuery.value;
    },
    get theme() {
      return theme;
    },
    get schema() {
      return validatorState.schema;
    },
    get uiSchema() {
      return uiSchemaQuery.value;
    },
    get validator() {
      return formValidator;
    },
    get merger() {
      return merger;
    },
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
    uiOptionsRegistry: {
      stringEnumValueMapper: () => new StringEnumValueMapperBuilder(),
    },
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

  // TODO: Transform Files into constructors
  const valueSnapshotStr = $derived(
    JSON.stringify(getValueSnapshot(form), null, 2)
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(data);
    valueSnapshotStr;
    return () => router.store({ ...snap, initialValue: valueSnapshotStr });
  });

  setShadcnContext();

  const SvarProvider = $derived(
    data.theme === "svar" ? (themeManager.isDark ? WillowDark : Willow) : Noop
  );

  const ctx = createTilerContext();
  setTilerContext(ctx);
  const createLeaf = Leaf.setup(
    registryFromRecord({
      schema,
      uiSchema,
      formData,
      css,
      preview,
    })
  );
  const createTabs = Tabs.setup({
    headers: registryFromRecord({
      gripHeader,
    }),
    actions: registryFromRecord({
      smartActions,
    }),
    applySplit: createApplySplit(ctx),
  });

  const PREVIEW_TITLE = "Preview";
  const FORM_DATA_TITLE = "Form Data";
  const UI_SCHEMA_TITLE = "UI Schema";
  const CSS_TITLE = "CSS";

  const store = createLayoutStore({
    key: "layout",
    defaultLayout: () =>
      Split.create({
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
                          tabs: [[UI_SCHEMA_TITLE, createLeaf("uiSchema")]],
                        }),
                      },
                      {
                        constraints,
                        tile: createTabs({
                          actions: "smartActions",
                          tabHeader: "gripHeader",
                          tabs: [[FORM_DATA_TITLE, createLeaf("formData")]],
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
              tabs: [[PREVIEW_TITLE, createLeaf("preview")]],
            }),
          },
        ],
      }),
    migrations: [
      transformLayout((t) => {
        if (t.type === "tabs") {
          const idx = t.titles.indexOf(UI_SCHEMA_TITLE) + 1;
          if (idx > 0) {
            const selected = t.selectedTab;
            ctx.insertInto(t, idx, {
              titles: [CSS_TITLE],
              children: [createLeaf("css")],
            });
            t.selectedTab = selected >= idx ? selected + 1 : selected;
          }
        }
        return t;
      }),
    ],
  });

  let layout = $state(store.load());

  debouncedEffect(() => {
    const snap = $state.snapshot(layout);
    return () => {
      store.save(snap);
    };
  });

  type KeyName = "schema" | "uiSchema" | "initialValue" | "css";

  function toKeyName(k: string): KeyName | undefined {
    switch (k) {
      case "schema":
      case "uiSchema":
      case "css":
        return k;
      case "preview":
        return "initialValue";
    }
  }

  function langFromKeyName(keyName: KeyName): Lang {
    return keyName === "css" ? "css" : "javascript";
  }

  const format = createFormatTask();

  const loadPresetTask = createTask<[PresetEntry], NormalizedFormPreset>({
    combinator: abortPrevious,
    execute: debounce(async (s, { load, meta }) => {
      const preset = await load();
      checkSignal(s);
      const validator = preset.validator ?? data.validator;
      const validatorSchemaType = schemaTypeFromValidator(validator);
      const schema = await convertAndFormatTypedSchema(s, {
        source: {
          ...meta.schema,
          schema: preset.schema,
        },
        target:
          meta.schema.type === validatorSchemaType.type
            ? meta.schema
            : validatorSchemaType,
      });
      return {
        ...preset,
        css: "/* NOTE: this content will not be saved when switching between examples */\n",
        schema,
        validator:
          codegemIsJsonSchemaValidator(validator) &&
          validator.precompiled === false
            ? {
                ...validator,
                draft2020: false,
              }
            : validator,
      };
    }),
    onSuccess(preset) {
      originalInitialValue = preset.initialValue;
      Object.assign(data, preset);
    },
    onFailure: createOnFailure("Example loading"),
  });
</script>

<svelte:head>
  {@html `<style>${themeGlobalStyle}</style>`}
</svelte:head>

<Header
  transitions={{
    "": () => data,
    v: () => ({
      schema: data.schema,
      input: data.initialValue,
      validator: data.validator,
    }),
    m: createMergerTransition(data),
  }}
>
  <ButtonGroup.Root>
    <SamplePicker onSelect={loadPresetTask.run} />
  </ButtonGroup.Root>

  <ButtonGroup.Root>
    <Select
      label="Theme"
      bind:value={data.theme}
      items={playgroundThemes()}
      itemLabel={themeOrSubThemeTitle}
    />
    <Select
      label="Validator"
      bind:value={validatorState.selected}
      items={validatorState.items}
      labels={validatorState.labels}
    />
    <Select
      label="Icons"
      bind:value={data.icons}
      items={playgroundIconSets()}
      itemLabel={playgroundIconSetTitle}
    />
    <Select
      label="Resolver"
      bind:value={data.resolver}
      items={playgroundResolvers()}
    />
    <Popup>
      {#snippet label()}
        Settings ({+data.disabled +
          +data.html5Validation +
          +data.focusOnFirstError +
          +data.omitExtraData +
          fieldsValidationCount +
          changedMergerOptionsCount})
      {/snippet}
      <p class="text-sm font-medium">Form</p>
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
      <Separator.Root class="my-1" />
      <p class="text-sm font-medium">Fields validation</p>
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
      <Separator.Root class="my-1" />
      <p class="text-sm font-medium">Merger</p>
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
  </ButtonGroup.Root>

  <ButtonGroup.Root>
    <Button
      variant="outline"
      onclick={async () => {
        try {
          const str = router.share($state.snapshot(data)).toString();
          await copyTextToClipboard(str);
          toast.success("Link copied");
        } catch (err) {
          console.error(err);
          toast.error("An error has occurred");
        }
      }}
    >
      Share <Copy />
    </Button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        class={buttonVariants({
          variant: "outline",
          class: "px-1",
        })}
      >
        <ChevronDown class="size-4" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="center" class="w-44">
        {#each SANDBOX_PLATFORMS as platform (platform)}
          <DropdownMenu.Item
            onclick={() => openSandbox({ formState: data, platform })}
          >
            {sandboxPlatformLabel(platform)}
            {#if sandboxPlatformIcon(platform) === "external-link"}
              <ExternalLink />
            {:else}
              <Download />
            {/if}
          </DropdownMenu.Item>
        {/each}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </ButtonGroup.Root>
</Header>
<Panel bind:layout />

{#snippet smartActions(tile: Tiles["tabs"])}
  {#if tile.titles[tile.selectedTab] === PREVIEW_TITLE}
    <CopyFormData />
    <Button
      onclick={() => {
        form.reset();
      }}
      size="sm"
      variant="ghost"
    >
      Reset
    </Button>
  {:else}
    {#if tile.titles[tile.selectedTab] === FORM_DATA_TITLE}
      <Button
        onclick={() => {
          data.initialValue = originalInitialValue;
        }}
        size="sm"
        variant="ghost"
      >
        Restore
      </Button>
    {/if}
    <Button
      size="sm"
      variant="ghost"
      onclick={() => {
        const child = tile.children[tile.selectedTab];
        if (!child || child.type !== "leaf") {
          return;
        }
        const n = toKeyName(child.name);
        if (n) {
          format(langFromKeyName(n), data[n], (f) => {
            data[n] = f;
          });
        }
      }}
    >
      <AlignLeft />
    </Button>
  {/if}
{/snippet}

{#snippet schema()}
  <Editor
    bind:value={data.schema}
    class="h-full"
    data-state={validatorState.state}
  />
{/snippet}

{#snippet uiSchema()}
  <Editor
    bind:value={data.uiSchema}
    class="h-full"
    data-state={uiSchemaQuery.state}
  />
{/snippet}

{#snippet formData()}
  <Editor
    bind:value={
      () => valueSnapshotStr,
      (v) => {
        data.initialValue = v;
      }
    }
    class="h-full"
    data-state={initialValueQuery.state}
  />
{/snippet}

{#snippet css()}
  <Editor bind:value={data.css} lang="css" class="h-full" />
{/snippet}

{#snippet preview()}
  <ShadowHost
    id="shadow-host"
    class="flex min-h-full flex-col"
    style={`${themeStyle}\n${iconSetStyle}\n${data.css}`}
    data-theme={themeManager.darkOrLight}
  >
    <style>
      .wx-willow-theme,
      .wx-willow-dark-theme {
        flex-grow: 1;
      }
    </style>
    {#if portalEl}
      <BitsConfig defaultPortalTo={portalEl}>
        <SvarProvider>
          <svelte:boundary>
            <Form
              attributes={{
                id: "form",
                class: themeManager.darkOrLight,
                style:
                  "flex-grow: 1; display: flex; flex-direction: column; gap: 1rem; padding: 1.5rem;",
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
    {/if}
    <div bind:this={portalEl}></div>
  </ShadowHost>
{/snippet}
