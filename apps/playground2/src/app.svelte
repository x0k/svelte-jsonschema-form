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
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { resolver } from "@sjsf/form/resolvers/compat";
  import { createFocusOnFirstError } from "@sjsf/form/focus-on-first-error";
  import { setThemeContext } from "@sjsf/shadcn4-theme";
  import * as components from "@sjsf/shadcn4-theme/new-york";

  import { themes, themeStyles } from "./themes";
  import { icons, iconsStyles } from "./icons";
  import { ShadowHost } from "./shadow";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import ThemePicker from "./theme-picker.svelte";
  import Editor from "./editor.svelte";
  import Popup from "./popup.svelte";
  import Bits from "./bits.svelte";
  import Debug from "./debug.svelte";

  import { samples } from "./samples";
  import * as customComponents from "./samples/components";
  import { validators } from "./validators";

  function isSampleName(name: unknown): name is keyof typeof samples {
    return typeof name === "string" && name in samples;
  }

  function isThemeName(name: unknown): name is keyof typeof themes {
    return typeof name === "string" && name in themes;
  }

  function isIconSetName(name: unknown): name is keyof typeof icons {
    return typeof name === "string" && name in icons;
  }

  function isValidatorName(name: unknown): name is keyof typeof validators {
    return typeof name === "string" && name in validators;
  }

  const url = new URL(window.location.toString());

  const parsedSampleName = url.searchParams.get("sample");
  function selectSample(name: keyof typeof samples, replace = false) {
    url.searchParams.set("sample", name);
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return name;
  }
  const initialSampleName = isSampleName(parsedSampleName)
    ? parsedSampleName
    : selectSample("Simple", true);
  let sampleName = $state(initialSampleName);
  let schema = $state(samples[initialSampleName].schema);
  let uiSchema = $state(samples[initialSampleName].uiSchema);

  const parsedThemeName = url.searchParams.get("theme");
  function selectTheme(name: keyof typeof themes, replace = false) {
    url.searchParams.set("theme", name);
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return name;
  }
  const initialThemeName = isThemeName(parsedThemeName)
    ? parsedThemeName
    : selectTheme("basic", true);
  let themeName = $state(initialThemeName);
  const theme = $derived(extendByRecord(themes[themeName], customComponents));
  const themeStyle = $derived(themeStyles[themeName]);

  const parsedIconSetName = url.searchParams.get("icons");
  function selectIconSet(name: keyof typeof icons, replace = false) {
    url.searchParams.set("icons", name);
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return name;
  }
  const initialIconSetName = isIconSetName(parsedIconSetName)
    ? parsedIconSetName
    : selectIconSet("none", true);
  let iconSetName = $state(initialIconSetName);
  const iconSet = $derived(icons[iconSetName]);
  const iconSetStyle = $derived(iconsStyles[iconSetName]);

  const parsedValidatorName = url.searchParams.get("validator");
  function selectValidator(name: keyof typeof validators, replace = false) {
    url.searchParams.set("validator", name);
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return name;
  }
  const initialValidatorName = isValidatorName(parsedValidatorName)
    ? parsedValidatorName
    : selectValidator("ajv8", true);
  let validatorName = $state(initialValidatorName);
  const validator = $derived.by(() => {
    const validator = validators[validatorName]();
    const { customizeValidator } = samples[sampleName];
    return customizeValidator?.(validator) ?? validator;
  });

  let disabled = $state(false);
  let html5Validation = $state(false);
  let doFocusOnFirstError = $state(true);

  const form = createForm({
    resolver,
    initialValue: samples[initialSampleName].formData,
    initialErrors: samples[initialSampleName].errors,
    translation,
    get theme() {
      return theme;
    },
    get schema() {
      return schema;
    },
    get uiSchema() {
      return uiSchema;
    },
    get validator() {
      return validator;
    },
    get disabled() {
      return disabled;
    },
    get fieldsValidationMode() {
      return validationEvent | validationAfter;
    },
    get icons() {
      return iconSet;
    },
    onSubmit(value) {
      console.log("submit", value);
    },
    onSubmitError(errors, e) {
      if (doFocusOnFirstError) {
        createFocusOnFirstError()(errors, e);
      }
      console.log("errors", errors);
    },
  });

  let playgroundTheme = $state<"system" | "light" | "dark">(
    localStorage.theme ?? "system"
  );

  const lightOrDark = $derived(
    playgroundTheme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)")
        ? "dark"
        : "light"
      : playgroundTheme
  );

  function setValidation(
    name: "vevent" | "vafter",
    value: number,
    replace = false
  ) {
    url.searchParams.set(name, value.toString());
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return value;
  }
  const urlValidationEvent = Number(url.searchParams.get("vevent") ?? 0);
  const initialValidationEvent =
    urlValidationEvent > 0 && urlValidationEvent <= ON_OBJECT_CHANGE
      ? urlValidationEvent
      : 0;
  let validationEvent = $state(
    setValidation("vevent", initialValidationEvent, true)
  );
  $effect(() => {
    setValidation("vevent", validationEvent);
  });
  const urlValidationAfter = Number(url.searchParams.get("vafter") ?? 0);
  const initialValidationAfter =
    urlValidationAfter === 0 ||
    (urlValidationAfter >= AFTER_CHANGED &&
      urlValidationAfter <= AFTER_SUBMITTED)
      ? urlValidationAfter
      : 0;
  let validationAfter = $state(
    setValidation("vafter", initialValidationAfter, true)
  );
  $effect(() => {
    setValidation("vafter", validationAfter);
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
        Form options ({+disabled + +html5Validation + +doFocusOnFirstError})
      {/snippet}
      <label>
        <input type="checkbox" bind:checked={disabled} />
        Disabled
      </label>
      <label>
        <input type="checkbox" bind:checked={html5Validation} />
        HTML5 validation
      </label>
      <label>
        <input type="checkbox" bind:checked={doFocusOnFirstError} />
        Focus on first error
      </label>
    </Popup>
    <Bits
      title="Fields Validation Triggers"
      bind:value={validationEvent}
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
      bind:value={validationAfter}
      flags={[
        [AFTER_CHANGED, "After Changed"],
        [AFTER_TOUCHED, "After Touched"],
        [AFTER_SUBMITTED, "After Submitted"],
      ]}
    />
    <select
      bind:value={validatorName}
      onchange={() => selectValidator(validatorName)}
    >
      {#each Object.keys(validators) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={themeName} onchange={() => selectTheme(themeName)}>
      {#each Object.keys(themes) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select
      bind:value={iconSetName}
      onchange={() => selectIconSet(iconSetName)}
    >
      {#each Object.keys(icons) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <ThemePicker bind:theme={playgroundTheme} />
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
        class="rounded shadow p-2"
        class:bg-green-300={sample.status === "perfect"}
        class:bg-yellow-300={sample.status === "warnings"}
        class:bg-red-300={sample.status === "broken" ||
          sample.status === undefined}
        class:bg-neutral-300={sample.status === "skipped"}
        class:font-bold={name === sampleName}
        disabled={sample.status === "skipped"}
        onclick={() => {
          sampleName = selectSample(name as keyof typeof samples);
          schema = samples[sampleName].schema;
          uiSchema = samples[sampleName].uiSchema;
          form.value = samples[sampleName].formData;
          form.errors = samples[sampleName].errors ?? new SvelteMap();
        }}
      >
        {name}
      </button>
    {/each}
  </div>
  <div class="flex gap-8">
    <div class="flex-[4] flex flex-col">
      <Editor
        class="font-mono h-[385px] border border-b-0 rounded-t p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent"
        bind:value={schema}
      />
      <div class="flex">
        <Editor
          class="font-mono h-[385px] grow border rounded-bl p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent"
          bind:value={uiSchema}
        />
        <Editor
          class="font-mono h-[385px] grow border rounded-br p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent"
          bind:value={form.value}
        />
      </div>
    </div>
    <ShadowHost
      class="flex-[3] max-h-[770px] overflow-y-auto"
      style={`${themeStyle}\n${iconSetStyle}`}
    >
      <BasicForm
        {form}
        class={lightOrDark}
        style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem; padding: 0.3rem;"
        novalidate={!html5Validation || undefined}
        data-theme={themeName.startsWith("skeleton") ? "cerberus" : lightOrDark}
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
