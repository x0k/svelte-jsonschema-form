<script lang="ts" module>
  import {
    StringEnumValueMapperBuilder,
    type EnumValueMapperBuilder,
  } from "@sjsf/form/options.svelte";

  declare module "@sjsf/form" {
    interface UiOptionsRegistry {
      stringEnumValueMapper: () => EnumValueMapperBuilder;
    }
  }
</script>

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
    setValue,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { createFormMerger } from "@sjsf/form/mergers/modern";
  import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
  import { convert } from "@sjsf/form/converters/draft-2020-12";
  import { fromRecord as registryFromRecord } from "svelte-tiler/shared/registry";
  import { Panel, setTilerContext, type Tiles } from "svelte-tiler";
  import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
  import * as Split from "svelte-tiler/tiles/split.svelte";
  import * as Tabs from "svelte-tiler/tiles/tabs.svelte";
  import AlignLeft from "@lucide/svelte/icons/align-left";
  import { themeOrSubThemeTitle } from "meta";
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
    PLAYGROUND_VALIDATORS,
    playgroundIconSetTitle,
    playgroundIconSets,
    playgroundResolvers,
    playgroundThemes,
    playgroundValidatorTitle,
    playgroundValidators,
    type FormState,
  } from "meta/playground";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
  import { debouncedEffect } from "$lib/svelte.svelte.js";
  import { ShadowHost } from "$lib/shadow/index.js";
  import Editor from "$lib/editor.svelte";
  import Popup from "$lib/popup.svelte";
  import Bits from "$lib/bits.svelte";
  import Select from "$lib/select.svelte";
  import Noop from "$lib/noop.svelte";
  import { gripHeader } from "$lib/grip-header.svelte";
  import {
    constraints,
    createApplySplit,
    createTilerContext,
    gapPx,
  } from "$lib/tiler.js";

  // import {
  //   ALL_OF_STATE_BEHAVIOR,
  //   ALL_OF_STATE_BEHAVIOR_TITLES,
  //   ARRAY_MIN_ITEMS_POPULATE,
  //   ARRAY_MIN_ITEMS_POPULATE_TITLES,
  //   CONST_AS_DEFAULT_STATE_BEHAVIOR,
  //   CONST_AS_DEFAULT_STATE_BEHAVIOR_TITLES,
  //   EMPTY_OBJECT_FIELDS_BEHAVIOR,
  //   EMPTY_OBJECT_FIELDS_BEHAVIOR_TITLES,
  //   MERGE_DEFAULTS_INTO_FORM,
  //   MERGE_DEFAULTS_INTO_FORM_TITLES,
  //   icons,
  //   iconsStyles,
  //   resolvers,
  //   validators,
  //   VALIDATOR_TITLES,
  //   REAL_VALIDATORS,
  // } from "@/core/index.js";
  import { themeManager } from "@/theme.svelte";
  import { setShadcnContext } from "@/shadcn-context.js";
  import Header from "@/header.svelte";
  import { router } from "@/router.js";

  import * as customComponents from "./custom-form-components/index.js";
  import SamplePicker from "./sample-picker.svelte";
  import CopyFormData from "./copy-form-data.svelte";

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

  let originalInitialValue = $state.raw<FormValue>();
  const data = $state(
    (() => {
      const data = router.load(DEFAULT_PLAYGROUND_STATE);
      originalInitialValue = data.initialValue;
      return data;
    })(),
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(data);
    return () => router.store(snap);
  });

  const theme = $derived(
    extendByRecord(PLAYGROUND_SJSF_THEMES[data.theme], customComponents),
  );
  const themeStyle = $derived(PLAYGROUND_SJSF_THEME_STYLES[data.theme]);
  const iconsSet = $derived(data.icons && PLAYGROUND_ICON_SETS[data.icons]);
  const iconSetStyle = $derived(data.icons && PLAYGROUND_ICON_SET_STYLES[data.icons]);
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

  const isDraft2020 = $derived(
    data.schema.$schema?.startsWith(
      "https://json-schema.org/draft/2020-12/schema",
    ) === true,
  );

  const finalSchema = $derived(
    isDraft2020
      ? convert(data.schema as Parameters<typeof convert>[0])
      : data.schema,
  );

  const focusOnFirstError = createFocusOnFirstError();
  const form = createForm({
    idBuilder: createFormIdBuilder,
    get resolver() {
      return PLAYGROUND_RESOLVERS[data.resolver];
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
      return finalSchema;
    },
    get uiSchema() {
      return data.uiSchema;
    },
    validator: (options) => {
      const v = PLAYGROUND_VALIDATORS[data.validator]<FormValue>(options);
      return {
        ...v,
        validateFormValue(rootSchema, formValue) {
          return v.validateFormValue(
            isDraft2020 && data.validator.endsWith("_2020")
              ? data.schema
              : rootSchema,
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

  setShadcnContext();

  const SvarProvider = $derived(
    data.theme === "svar" ? (themeManager.isDark ? WillowDark : Willow) : Noop,
  );

  const ctx = createTilerContext();
  setTilerContext(ctx);
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
    applySplit: createApplySplit(ctx),
  });

  const LAYOUT_KEY = "layout";
  const PREVIEW_TITLE = "Preview";
  const FORM_DATA_TITLE = "Form Data";
  const saved = localStorage.getItem(LAYOUT_KEY);
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
  );

  debouncedEffect(() => {
    const snap = $state.snapshot(layout);
    return () => {
      localStorage.setItem(LAYOUT_KEY, JSON.stringify(snap));
    };
  });

  const editors: Record<string, Editor<any>> = $state({});
</script>

<Header
  transitions={{
    "": () => data,
    v: () => ({
      schema: data.schema,
      input: data.initialValue,
      validator: data.validator,
    }),
    m: () => ({
      schema: data.schema,
      intersectJson: true,
      deduplicateJsonSchemas: true,
    }),
  }}
>
  <SamplePicker
    onSelect={(sample) => {
      Object.assign(data, sample);
      originalInitialValue = sample.initialValue;
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
    items={playgroundResolvers()}
  />
  <Select
    label="Validator"
    bind:value={data.validator}
    items={playgroundValidators()}
    itemLabel={playgroundValidatorTitle}
  />
  <Select
    label="Theme"
    bind:value={data.theme}
    items={playgroundThemes()}
    itemLabel={themeOrSubThemeTitle}
  />
  <Select
    label="Icons"
    bind:value={data.icons}
    items={playgroundIconSets()}
    itemLabel={playgroundIconSetTitle}
  />
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
          setValue(form, originalInitialValue);
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
  <ShadowHost
    id="shadow-host"
    class="min-h-full flex flex-col"
    style={`${themeStyle}\n${iconSetStyle}`}
    data-theme={themeManager.darkOrLight}
  >
    <style>
      .wx-willow-theme,
      .wx-willow-dark-theme {
        flex-grow: 1;
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
    <div bind:this={portalEl}></div>
  </ShadowHost>
{/snippet}
