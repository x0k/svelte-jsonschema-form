<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import Ajv from "ajv";
  import { ON_BLUR, ON_CHANGE, ON_INPUT, AFTER_CHANGED, AFTER_SUBMITTED, AFTER_TOUCHED, useForm2, SimpleForm } from "@sjsf/form";
  import { translation, handleValidationProcessError } from "@sjsf/form/translations/en";
  import { addFormComponents, DEFAULT_AJV_CONFIG } from "@sjsf/ajv8-validator";
  import { focusOnFirstError } from '@sjsf/form/focus-on-first-error';
  import { setThemeContext } from '@sjsf/shadcn-theme'
  import { components } from '@sjsf/shadcn-theme/default'

  import { themes, themeStyles } from './themes'
  import { icons, iconsStyles } from './icons'
  import { ShadowHost } from "./shadow";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import ThemePicker from "./theme-picker.svelte";
  import Editor from './editor.svelte';
  import Debug from './debug.svelte';

  import { samples } from "./samples";
  import { validators } from './validators';

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
  const theme = $derived(themes[themeName]);
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
    const Val = samples[sampleName].Validator
    if (Val) {
      return new Val(
        addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)),
        uiSchema
      )
    }
    return validators[validatorName]()
  });

  let disabled = $state(false);
  let html5Validation = $state(false);
  let doFocusOnFirstError = $state(true);

  const form = useForm2({
    handleValidationProcessError: (state) => {
      console.error(state);
      return handleValidationProcessError(state)
    },
    initialValue: samples[initialSampleName].formData,
    initialErrors: samples[initialSampleName].errors ?? new SvelteMap(),
    translation,
    get schema() {
      return schema;
    },
    get uiSchema() {
      return uiSchema;
    },
    get components() {
      return theme.components;
    },
    get widgets() {
      return theme.widgets;
    },
    get validator() {
      return validator;
    },
    get disabled() {
      return disabled;
    },
    get inputsValidationMode() {
      return validationEvent | validationAfter
    },
    get icons() {
      return iconSet;
    },
    onSubmit (value) {
      console.log("submit", value);
    },
    onSubmitError (errors, e) {
      if (doFocusOnFirstError) {
        focusOnFirstError(errors, e);
      }
      console.log("errors", errors);
    },
  })

  let playgroundTheme = $state<"system" | "light" | "dark">(
    localStorage.theme ?? "system"
  );

  const lightOrDark = $derived(playgroundTheme === "system" ? window.matchMedia("(prefers-color-scheme: dark)") ? "dark" : "light" : playgroundTheme)


  function setValidation(name: "vevent" | "vafter", value: number, replace = false) {
    url.searchParams.set(name, value.toString());
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return value;
  }
  const urlValidationEvent = Number(url.searchParams.get("vevent") ?? 0)
  const initialValidationEvent = urlValidationEvent > 0 && urlValidationEvent < 8 ? urlValidationEvent : 0
  let validationEvent = $state(setValidation("vevent", initialValidationEvent, true));
  const urlValidationAfter = Number(url.searchParams.get("vafter") ?? 0)
  const initialValidationAfter = [0, AFTER_SUBMITTED, AFTER_TOUCHED, AFTER_CHANGED].find((v) => v === urlValidationAfter) ?? 0
  let validationAfter = $state(setValidation("vafter", initialValidationAfter, true));

  setThemeContext({ components });
</script>

<div
  class="py-4 px-8 min-h-screen dark:[color-scheme:dark] dark:bg-slate-900 dark:text-white"
>
  <div class="pb-6 flex flex-wrap items-center gap-4">
    <h1 class="grow text-3xl font-bold">Playground</h1>
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
    <select bind:value={validationEvent} onchange={() => setValidation("vevent", validationEvent)}>
      <option value={0}>None</option>
      <option value={ON_INPUT}>On Input</option>
      <option value={ON_CHANGE}>On Change</option>
      <option value={ON_BLUR}>On Blur</option>
      <option value={ON_INPUT | ON_BLUR}>Input & Blur</option>
      <option value={ON_INPUT | ON_CHANGE}>Input & Change</option>
      <option value={ON_BLUR | ON_CHANGE}>Blur & Change</option>
      <option value={ON_INPUT | ON_BLUR | ON_CHANGE}>All</option>
    </select>
    <select bind:value={validationAfter} onchange={() => setValidation("vafter", validationAfter)}>
      <option value={0}>Always</option>
      <option value={AFTER_CHANGED}>After Changed</option>
      <option value={AFTER_TOUCHED}>After Touched</option>
      <option value={AFTER_SUBMITTED}>After Submitted</option>
    </select>
    <select bind:value={validatorName} onchange={() => selectValidator(validatorName)}>
      {#each Object.keys(validators) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={themeName} onchange={() => selectTheme(themeName)}>
      {#each Object.keys(themes) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <select bind:value={iconSetName} onchange={() => selectIconSet(iconSetName)}>
      {#each Object.keys(icons) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <ThemePicker bind:theme={playgroundTheme} />
    <a href="https://x0k.github.io/svelte-jsonschema-form/">
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
    <div class="flex-[4] flex flex-col gap-2">
      <Editor class="font-mono h-[400px] border rounded p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent" bind:value={schema} />
      <div class="flex gap-2">
        <Editor class="font-mono h-[400px] grow border rounded p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent" bind:value={uiSchema} />
        <Editor class="font-mono h-[400px] grow border rounded p-2 data-[error=true]:border-red-500 data-[error=true]:outline-none bg-transparent" bind:value={form.value} />
      </div>
    </div>
    <ShadowHost class="flex-[3] max-h-[808px] overflow-y-auto" style={`${themeStyle}\n${iconSetStyle}`}>
      <SimpleForm
        {form}
        data-theme={themeName === "skeleton" ? "cerberus" : lightOrDark}
        class={lightOrDark}
        style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem; padding: 0.3rem;"
        novalidate={!html5Validation || undefined}
      />
      {#if location.hostname === "localhost"}
        <Debug />
      {/if}
    </ShadowHost>
  </div>
</div>
