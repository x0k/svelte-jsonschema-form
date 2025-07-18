<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import { BitsConfig } from "bits-ui";
  import { extendByRecord, fromRecord } from "@sjsf/form/lib/resolver";
  import {
    ON_BLUR,
    ON_CHANGE,
    ON_INPUT,
    AFTER_CHANGED,
    AFTER_SUBMITTED,
    AFTER_TOUCHED,
    createForm,
    BasicForm,
    ON_ARRAY_CHANGE,
    ON_OBJECT_CHANGE,
    createFormMerger,
    type FormValue,
    type Validator,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { omitExtraData } from "@sjsf/form/omit-extra-data";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
  } from "lz-string";

  import { Button } from "$lib/components/ui/button/index.js";
  import { Label } from "$lib/components/ui/label/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox/index.js";
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
    type PlaygroundState,
  } from "./core/index.js";
  import { ShadowHost } from "./shadow/index.js";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import Editor from "./editor.svelte";
  import Popup from "./popup.svelte";
  import Bits from "./bits.svelte";
  import Select from "./select.svelte";

  import * as customComponents from "./custom-form-components/index.js";
  import { themeManager } from "./theme.svelte";
  import SamplePicker from "./sample-picker.svelte";
  import { setShadcnContext } from "./shadcn-context.js";

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
            decompressFromEncodedURIComponent(location.hash.substring(1))
          )
        );
      } catch {
        console.error("Failed to decode initial state");
      }
    }
    return DEFAULT_PLAYGROUND_STATE;
  }

  const data: PlaygroundState = $state(init());

  let callbackId: number | undefined;
  $effect(() => {
    Object.values(data);
    clearTimeout(callbackId);
    callbackId = setTimeout(() => {
      const url = new URL(location.href);
      url.hash = compressToEncodedURIComponent(JSON.stringify(data));
      history.replaceState(null, "", url);
    }, 300);
  });

  const theme = $derived(extendByRecord(themes[data.theme], customComponents));
  const themeStyle = $derived(themeStyles[data.theme]);
  const validator = $derived(validators[data.validator]());
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
  const resolver = $derived(resolvers[data.resolver]);
  const merger = $derived(
    createFormMerger(validator, data.schema, {
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

  let portalEl = $state.raw() as HTMLDivElement;
  const rootNode = $derived(portalEl?.getRootNode());

  const options = {
    getRootNode() {
      return rootNode;
    },
  };

  const focusOnFirstError = createFocusOnFirstError();
  const form = createForm<FormValue, Validator>({
    get resolver() {
      return resolver;
    },
    initialValue: data.initialValue,
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
    get validator() {
      return validator;
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
    getSnapshot(ctx) {
      const snap = $state.snapshot(ctx.value);
      return data.omitExtraData
        ? omitExtraData(validator, merger, data.schema, snap)
        : snap;
    },
    extraUiOptions: fromRecord({
      skeleton3Slider: options,
      skeleton3FileUpload: options,
      skeleton3Rating: options,
      skeleton3Segment: options,
      skeleton3Switch: options,
      skeleton3Tags: options,
    }),
    onSubmit(value) {
      console.log("submit", value);
    },
    onSubmitError(errors, e) {
      if (data.focusOnFirstError) {
        focusOnFirstError(errors, e);
      }
      console.log("errors", errors);
    },
  });

  $effect(() => {
    data.initialValue = form.value;
  });

  setShadcnContext();

  const clearLink = new URL(location.href);
  clearLink.hash = "";
</script>

<div
  class="py-4 px-8 gap-4 h-screen grid grid-rows-[auto_1fr_1fr] grid-cols-[repeat(7,1fr)] dark:[color-scheme:dark]"
>
  <div class="col-span-7 flex flex-wrap items-center gap-2">
    <a href={clearLink.toString()} class="text-3xl font-bold mr-auto"
      >Playground</a
    >
    <SamplePicker
      onSelect={(sample) => {
        Object.assign(data, sample);
        form.value = sample.initialValue;
        form.errors = new SvelteMap();
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
      items={Object.keys(validators)}
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
  <Editor
    class="col-span-4 border rounded-md data-[error=true]:border-red-500 data-[error=true]:outline-none"
    bind:value={data.schema}
  />
  <Editor
    class="row-start-3 col-span-2 border rounded-md data-[error=true]:border-red-500 data-[error=true]:outline-none"
    bind:value={data.uiSchema}
  />
  <Editor
    class="row-start-3 col-span-2 border rounded-md data-[error=true]:border-red-500 data-[error=true]:outline-none"
    bind:value={form.value}
  />
  <ShadowHost
    class="col-span-3 row-span-2 overflow-y-auto border border-[var(--global-border)] rounded-md"
    style={`${themeStyle}\n${iconSetStyle}`}
  >
    {#if portalEl}
      <BitsConfig defaultPortalTo={portalEl}>
        <BasicForm
          id="form"
          {form}
          class={themeManager.darkOrLight}
          style="min-height: 100%; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"
          novalidate={!data.html5Validation || undefined}
          data-theme={data.theme.startsWith("skeleton")
            ? "cerberus"
            : themeManager.darkOrLight}
        />
      </BitsConfig>
    {/if}
    <div bind:this={portalEl}></div>
  </ShadowHost>
</div>
