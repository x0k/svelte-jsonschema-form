<script lang="ts">
  import { SvelteMap } from "svelte/reactivity";
  import { extendByRecord } from "@sjsf/form/lib/resolver";
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
    type Schema,
    type UiSchemaRoot,
    type FormValue,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
  } from "lz-string";

  import { Button } from "$lib/components/ui/button/index.js";
  import { THEMES } from "./shared/index.js";
  import { themes, themeStyles } from "./themes.js";
  import { icons, iconsStyles } from "./icons.js";
  import { resolvers } from "./resolvers.js";
  import { ShadowHost } from "./shadow/index.js";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import Editor from "./editor.svelte";
  import Popup from "./popup.svelte";
  import Bits from "./bits.svelte";
  import Select from "./select.svelte";

  import * as customComponents from "./custom-form-components/index.js";
  import { validators } from "./validators.js";
  import { themeManager } from "./theme.svelte";
  import SamplePicker from "./sample-picker.svelte";

  type Validators = typeof validators;
  type Themes = typeof themes;
  type Icons = typeof icons;
  type Resolvers = typeof resolvers;

  interface PlaygroundState {
    schema: Schema;
    uiSchema: UiSchemaRoot;
    initialValue: FormValue;
    disabled: boolean;
    html5Validation: boolean;
    focusOnFirstError: boolean;
    fieldsValidationMode: 0;
    validator: keyof Validators;
    theme: keyof Themes;
    icons: keyof Icons;
    resolver: keyof Resolvers;
  }

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
    initialValue: {
      hello: "World",
    },
    disabled: false,
    html5Validation: false,
    focusOnFirstError: true,
    fieldsValidationMode: 0,
    validator: "ajv8",
    theme: "basic",
    icons: "none",
    resolver: "compat",
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
  const PLAYGROUND_STATE_KEYS = Object.keys(
    DEFAULT_PLAYGROUND_STATE
  ) as (keyof PlaygroundState)[];
  $effect(() => {
    for (const key of PLAYGROUND_STATE_KEYS) {
      data[key];
    }
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

  const focusOnFirstError = createFocusOnFirstError();
  const form = createForm({
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
    get disabled() {
      return data.disabled;
    },
    get fieldsValidationMode() {
      return data.fieldsValidationMode;
    },
    get icons() {
      return iconsSet;
    },
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

  setThemeContext({ components });

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
        data.schema = sample.schema;
        data.uiSchema = sample.uiSchema;
        form.value = sample.formData;
        form.errors = new SvelteMap();
      }}
    />
    <Popup>
      {#snippet label()}
        Form options ({+data.disabled +
          +data.html5Validation +
          +data.focusOnFirstError})
      {/snippet}
      <label>
        <input type="checkbox" bind:checked={data.disabled} />
        Disabled
      </label>
      <label>
        <input type="checkbox" bind:checked={data.html5Validation} />
        HTML5 validation
      </label>
      <label>
        <input type="checkbox" bind:checked={data.focusOnFirstError} />
        Focus on first error
      </label>
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
    <Select label="App theme" bind:value={themeManager.theme} items={THEMES} />
    <Button
      variant="ghost"
      size="icon"
      href="https://x0k.github.io/svelte-jsonschema-form/v2/"
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
    class="col-span-3 row-span-2 overflow-y-auto border rounded-md"
    style={`${themeStyle}\n${iconSetStyle}`}
  >
    <BasicForm
      {form}
      class={themeManager.darkOrLight}
      style="min-height: 100%; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem;"
      novalidate={!data.html5Validation || undefined}
      data-theme={data.theme.startsWith("skeleton")
        ? "cerberus"
        : themeManager.darkOrLight}
    />
  </ShadowHost>
</div>
