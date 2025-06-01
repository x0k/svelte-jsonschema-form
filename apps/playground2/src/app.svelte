<script lang="ts">
  import { onMount } from "svelte";
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
    type InitialErrors,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";
  import {
    compressToEncodedURIComponent,
    decompressFromEncodedURIComponent,
  } from "lz-string";

  import { themes, themeStyles } from "./themes";
  import { icons, iconsStyles } from "./icons";
  import { ShadowHost } from "./shadow";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import Editor from "./editor.svelte";
  import Popup from "./popup.svelte";
  import Bits from "./bits.svelte";
  import Debug from "./debug.svelte";

  import { samples } from "./samples";
  import * as customComponents from "./samples/components";
  import { validators } from "./validators";
  import { themeManager } from "./theme.svelte";
  import { Theme, THEME_TITLES, THEMES } from "./shared";

  type Validators = typeof validators;
  type Themes = typeof themes;
  type Icons = typeof icons;

  const data = $state<{
    schema: Schema;
    uiSchema: UiSchemaRoot;
    initialValue: FormValue;
    initialErrors: InitialErrors<
      { [K in keyof Validators]: ReturnType<Validators[K]> }[keyof Validators]
    >;
    disabled: boolean;
    html5Validation: boolean;
    focusOnFirstError: boolean;
    fieldsValidationMode: 0;
    validator: keyof Validators;
    theme: keyof Themes;
    icons: keyof Icons | undefined;
  }>({
    schema: {},
    uiSchema: {},
    initialValue: {},
    initialErrors: [],
    disabled: false,
    html5Validation: false,
    focusOnFirstError: true,
    fieldsValidationMode: 0,
    validator: "ajv8",
    theme: "basic",
    icons: undefined,
  });

  const theme = $derived(extendByRecord(themes[data.theme], customComponents));
  const themeStyle = $derived(themeStyles[data.theme]);
  const validator = $derived(validators[data.validator]());
  const iconsSet = $derived(data.icons && icons[data.icons]);
  const iconSetStyle = $derived(data.icons && iconsStyles[data.icons]);

  const focusOnFirstError = createFocusOnFirstError();
  const form = createForm({
    resolver,
    initialValue: data.initialValue,
    initialErrors: data.initialErrors,
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

  setThemeContext({ components });
</script>

<div
  class="py-4 px-8 min-h-screen dark:[color-scheme:dark] dark:bg-slate-900 dark:text-white"
>
  <div class="pb-6 flex flex-wrap items-center gap-4">
    <h1 class="grow text-3xl font-bold">Playground</h1>
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
    <Bits
      title="Fields Validation Triggers"
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
      title="Fields Validation Modifiers"
      bind:value={data.fieldsValidationMode}
      flags={[
        [AFTER_CHANGED, "After Changed"],
        [AFTER_TOUCHED, "After Touched"],
        [AFTER_SUBMITTED, "After Submitted"],
      ]}
    />
    <select bind:value={data.validator}>
      {#each Object.keys(validators) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={data.theme}>
      {#each Object.keys(themes) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={data.icons}>
      {#each Object.keys(icons) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={themeManager.theme}>
      {#each THEMES as theme (theme)}
        <option value={theme}>{THEME_TITLES[theme]}</option>
      {/each}
    </select>

    <a href="https://x0k.github.io/svelte-jsonschema-form/v2/">
      <OpenBook class="h-8 w-8" />
    </a>
    <a target="_blank" href="https://github.com/x0k/svelte-jsonschema-form/">
      <Github class="h-8 w-8 bg-white rounded-full" />
    </a>
  </div>
  <div class="flex gap-2 flex-wrap pb-6 text-black">
    {#each Object.entries(samples) as [name, sample]}
      <button
        type="button"
        class="rounded shadow p-2 bg-green-300"
        onclick={() => {
          data.schema = sample.schema;
          data.uiSchema = sample.uiSchema;
          form.value = sample.formData;
          form.errors = sample.errors ?? new SvelteMap();
        }}
      >
        {name}
      </button>
    {/each}
  </div>
  <div class="flex gap-8">
    <div class="flex-[4] grid grid-cols-2 grid-rows-[repeat(2,385px)]">
      <Editor
        class="col-span-2 border border-b-0 rounded-t data-[error=true]:border-red-500 data-[error=true]:outline-none"
        bind:value={data.schema}
      />
      <Editor
        class="border rounded-bl data-[error=true]:border-red-500 data-[error=true]:outline-none"
        bind:value={data.uiSchema}
      />
      <Editor
        class="border rounded-br data-[error=true]:border-red-500 data-[error=true]:outline-none"
        bind:value={form.value}
      />
    </div>
    <ShadowHost
      class="flex-[3] max-h-[770px] overflow-y-auto"
      style={`${themeStyle}\n${iconSetStyle}`}
    >
      <BasicForm
        {form}
        class={themeManager.darkOrLight}
        style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem; padding: 0.3rem;"
        novalidate={!data.html5Validation || undefined}
        data-theme={data.theme.startsWith("skeleton")
          ? "cerberus"
          : themeManager.darkOrLight}
      />
      {#if location.hostname === "localhost"}
        <Debug />
      {/if}
    </ShadowHost>
  </div>
</div>

<style>
  :global(.dark select) {
    background-color: transparent;
  }
  :global(.dark option) {
    background-color: var(--color-slate-600);
  }
</style>
