<script lang="ts">
  import Ajv from "ajv";
  import {
    Form,
    ValidatorErrorType,
    type ValidatorError,
  } from "@sjsf/form";
  import { translation } from "@sjsf/form/translations/en";
  import { themes, themeStyles } from './themes'
  import { AjvValidator, addFormComponents, DEFAULT_AJV_CONFIG } from "@sjsf/ajv8-validator";

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
  let errors = $state.raw<ValidatorError<any>[]>(
    samples[initialSampleName].errors ?? []
  );
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
    <select bind:value={themeName}>
      {#each Object.keys(themes) as name (name)}
        <option value={name}>{name}</option>
      {/each}
    </select>
    <ThemePicker />
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
          errors = samples[sampleName].errors ?? [];
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
      {#if errorsList && errors.length > 0}
        <div style="color: red; padding-bottom: 1rem;">
          <span style="font-size: larger; font-weight: bold;">Errors</span>
          <ui>
            {#each errors as err}
              {#if err.type === ValidatorErrorType.ValidationError}
                <li>'{err.propertyTitle}' {err.message}</li>
              {:else}
                <li>{err.message}</li>
              {/if}
            {/each}
          </ui>
        </div>
      {/if}
      <Form
        bind:value
        {...theme}
        {schema}
        {uiSchema}
        {validator}
        {translation}
        {readonly}
        {disabled}
        novalidate={!html5Validation || undefined}
        bind:errors
        onSubmit={(value) => {
          console.log("submit", value);
        }}
        onSubmitError={(errors) => {
          console.log("errors", errors);
        }}
      />
    </ShadowHost>
  </div>
</div>
