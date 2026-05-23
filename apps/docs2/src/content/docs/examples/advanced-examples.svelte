<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";
  import { themeOrSubThemeTitle, validatorTitle } from "meta";
  import {
    PROJECT_GENERIC_EXAMPLES,
    PROJECT_PLATFORMS,
    PROJECT_SVELTE_KIT_EXAMPLES,
    PROJECT_VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS,
    PROJECT_VALIDATOR_SPECIFIC_EXAMPLES,
    projectOpen,
    ProjectPlatform,
    projectThemes,
    projectValidators,
    type ProjectTheme,
    type ProjectValidator,
  } from "meta/composer";

  import Buttons from "./buttons.svelte";

  let platform: ProjectPlatform = $state.raw(ProjectPlatform.StackBlitz);
  let theme: ProjectTheme = $state.raw("basic");
  let validator: ProjectValidator = $state.raw("ajv8");
</script>

<div class="pickers">
  <button style="display: none;">Avoid starlight styles pollution</button>
  <label>
    <span>Platform</span>
    <select bind:value={platform}>
      {#each PROJECT_PLATFORMS as v (v)}
        <option value={v}>
          {v}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Validator</span>
    <select bind:value={validator}>
      {#each projectValidators() as v (v)}
        <option value={v}>
          {validatorTitle(v)}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Theme</span>
    <select bind:value={theme}>
      {#each projectThemes() as t (t)}
        <option value={t}>
          {themeOrSubThemeTitle(t)}
        </option>
      {/each}
    </select>
  </label>
</div>

<h3>Generic</h3>

<Buttons
  items={PROJECT_GENERIC_EXAMPLES}
  onClick={(example) => {
    projectOpen({
      platform,
      example,
      theme,
      validator,
    });
  }}
  label={identity}
/>

<h3>SvelteKit</h3>

<Buttons
  items={PROJECT_SVELTE_KIT_EXAMPLES}
  onClick={(example) => {
    projectOpen({
      platform,
      example,
      theme,
      validator,
    });
  }}
  label={identity}
/>

<h3>Validator specific</h3>
<p><em>Validator selector will be ignored</em></p>

<Buttons
  items={PROJECT_VALIDATOR_SPECIFIC_EXAMPLES}
  onClick={(example) => {
    projectOpen({
      platform,
      example,
      theme,
      validator: PROJECT_VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS[example],
    });
  }}
  label={identity}
/>

<style>
  .pickers {
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: 1fr;
    column-gap: 2rem;
    & select {
      width: 100%;
      background-color: var(--sl-color-bg);
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: inherit;
      /* appearance: none; */
    }
  }
</style>
