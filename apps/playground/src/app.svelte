<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';
  import Ajv from "ajv";
  import { Form, ON_BLUR, ON_CHANGE, ON_INPUT, AFTER_CHANGED, AFTER_SUBMITTED, AFTER_TOUCHED, type Errors } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { AjvValidator, addFormComponents, DEFAULT_AJV_CONFIG } from "@sjsf/ajv8-validator";
  import { focusOnFirstError } from '@sjsf/form/focus-on-first-error';

  import { themes, themeStyles } from './themes'
  import { ShadowHost } from "./shadow";
  import Github from "./github.svelte";
  import OpenBook from "./open-book.svelte";
  import ThemePicker from "./theme-picker.svelte";

  import { samples } from "./samples";

  function isSampleName(name: unknown): name is keyof typeof samples {
    return typeof name === "string" && name in samples;
  }

  function isThemeName(name: unknown): name is keyof typeof themes {
    return typeof name === "string" && name in themes;
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
  let value = $state(samples[initialSampleName].formData);

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

  const validator = $derived(
    new (samples[sampleName].Validator ?? AjvValidator)(
      addFormComponents(new Ajv(DEFAULT_AJV_CONFIG)),
      uiSchema
    )
  );

  let disabled = $state(false);
  let readonly = $state(false);
  let html5Validation = $state(false);
  let errorsList = $state(true);
  let doFocusOnFirstError = $state(true);
  let errors: Errors = $state.raw(
    samples[initialSampleName].errors ?? new SvelteMap()
  );

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
      <input type="checkbox" bind:checked={readonly} />
      Readonly
    </label>
    <label>
      <input type="checkbox" bind:checked={html5Validation} />
      HTML5 validation
    </label>
    <label>
      <input type="checkbox" bind:checked={errorsList} />
      Errors list
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
    <select bind:value={themeName} onchange={() => selectTheme(themeName)}>
      {#each Object.keys(themes) as name (name)}
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
          value = samples[sampleName].formData;
          errors = samples[sampleName].errors ?? new SvelteMap();
        }}
      >
        {name}
      </button>
    {/each}
  </div>
  <div class="flex gap-8">
    <div class="flex-[4] flex flex-col gap-2">
      <div class="h-[400px] border rounded overflow-auto p-2">
        <pre class="w-0"><code>{JSON.stringify(schema, null, 2)}</code></pre>
      </div>
      <div class="flex gap-2">
        <div class="h-[400px] flex-1 border rounded overflow-auto p-2">
          <pre class="w-0"><code
              >{JSON.stringify(
                uiSchema,
                (_, v) =>
                  typeof v === "function" ? `Component(${v.componentName})` : v,
                2
              )}</code
            ></pre>
        </div>
        <div class="h-[400px] flex-1 border rounded overflow-auto p-2">
          <pre class="w-0"><code>{JSON.stringify(value, null, 2)}</code></pre>
        </div>
      </div>
    </div>
    <ShadowHost class="flex-[3] max-h-[808px] overflow-y-auto" style={themeStyle}>
      <Form
        data-theme={lightOrDark}
        class={lightOrDark}
        style="background-color: transparent; display: flex; flex-direction: column; gap: 1rem"
        bind:value
        {...theme}
        {schema}
        {uiSchema}
        {validator}
        {translation}
        {readonly}
        {disabled}
        novalidate={!html5Validation || undefined}
        inputsValidationMode={validationEvent | validationAfter}
        bind:errors
        onSubmit={(value) => {
          console.log("submit", value);
        }}
        onSubmitError={(errors, e) => {
          if (doFocusOnFirstError) {
            focusOnFirstError(errors, e);
          }
          console.log("errors", errors);
        }}
      />
      {#if errorsList && errors.size > 0}
        <div style="color: red; padding-bottom: 1rem;">
          <span style="font-size: larger; font-weight: bold;">Errors</span>
          <ui>
            {#each errors as [field, fieldErrors] (field)}
              {#each fieldErrors as err}
                <li>{err.propertyTitle} {err.message}</li>
              {/each}
            {/each}
          </ui>
        </div>
      {/if}
    </ShadowHost>
  </div>
</div>
