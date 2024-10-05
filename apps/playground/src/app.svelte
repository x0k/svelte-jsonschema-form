<script lang="ts">
  import Ajv from "ajv";

  import { ValidatorErrorType, type ValidatorError } from './core';
  import { Form } from "./form";
  import { translation } from "./translation/en";
  import { components, widgets } from "./basic-theme";
  import { AjvValidator } from "./validator";

  import { ShadowHost } from "./shadow";
  import Github from "./github.svelte";
  import ThemePicker from './theme-picker.svelte';
  
  import { samples } from "./samples";

  function isSampleName(name: unknown): name is keyof typeof samples {
    return typeof name === "string" && name in samples
  }

  const url = new URL(window.location.toString());
  const parsedSampleName = url.searchParams.get("sample");
  function selectSample(name: keyof typeof samples, replace = false) {
    url.searchParams.set("sample", name);
    history[replace ? "replaceState" : "pushState"](null, "", url);
    return name
  }
  const initialSampleName = isSampleName(parsedSampleName)
    ? parsedSampleName
    : selectSample("Simple", true)
  let sampleName = $state(initialSampleName);
  let schema = $state(samples[initialSampleName].schema);
  let uiSchema = $state(samples[initialSampleName].uiSchema);
  let value = $state(samples[initialSampleName].formData);

  const validator = $derived(new AjvValidator(
    new Ajv({
      allErrors: true,
      multipleOfPrecision: 8,
      strict: false,
      verbose: true,
      discriminator: true,
    }),
    uiSchema
  ));
  
  let disabled = $state(false)
  let readonly = $state(false)
  let html5Validation = $state(false)
  let errorsList = $state(true)
  let errors = $state.raw<ValidatorError<any>[]>(samples[initialSampleName].errors ?? [])
  $effect(() => {
    console.log("errors", errors)
  })
</script>

<div class="py-4 px-8 min-h-screen dark:[color-scheme:dark] dark:bg-slate-900 dark:text-white">
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
    <ThemePicker />
    <a target="_blank" href="https://github.com/x0k/svelte-jsonschema-form">
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
                (_, v) => (typeof v === "function" ? `Component(${v.componentName})` : v),
                2
              )}</code
            ></pre>
        </div>
        <div class="h-[400px] flex-1 border rounded overflow-auto p-2">
          <pre class="w-0"><code>{JSON.stringify(value, null, 2)}</code></pre>
        </div>
      </div>
    </div>
    <ShadowHost class="flex-[3] max-h-[808px] overflow-y-auto">
      {#if errorsList && errors.length > 0}
        <div style="color: red; padding-bottom: 1rem;">
          <span style="font-size: larger; font-weight: bold;" >Errors</span>
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
        {components}
        {widgets}
        {schema}
        {uiSchema}
        {validator}
        {translation}
        {readonly}
        {disabled}
        novalidate={!html5Validation || undefined}
        bind:errors
      />
    </ShadowHost>
  </div>
</div>
