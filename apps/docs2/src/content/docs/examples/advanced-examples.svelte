<script lang="ts">
  import { identity } from "@sjsf/form/lib/function";

  import {
    ACTUAL_THEMES,
    GENERIC_EXAMPLES,
    THEME_TITLES,
    type ActualTheme,
    type Validator,
    VALIDATOR_SPECIFIC_EXAMPLES,
    VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS,
    VALIDATORS,
    SVELTE_KIT_EXAMPLES,
  } from "@/shared";
  import { openProject, Platform, PLATFORMS } from "@/web-ide";

  import Buttons from "./buttons.svelte";

  let platform: Platform = $state.raw(Platform.StackBlitz);
  let theme: ActualTheme = $state.raw("basic");
  let validator: Validator = $state.raw("Ajv");
</script>

<div class="pickers">
  <button style="display: none;">Avoid starlight styles pollution</button>
  <label>
    <span>Platform</span>
    <select bind:value={platform}>
      {#each PLATFORMS as v (v)}
        <option value={v}>
          {v}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Validator</span>
    <select bind:value={validator}>
      {#each VALIDATORS as v (v)}
        <option value={v}>
          {v}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Theme</span>
    <select bind:value={theme}>
      {#each ACTUAL_THEMES as t (t)}
        <option value={t}>
          {THEME_TITLES[t]}
        </option>
      {/each}
    </select>
  </label>
</div>

<h3>Generic</h3>

<Buttons
  items={GENERIC_EXAMPLES}
  onClick={(example) => {
    openProject({
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
  items={SVELTE_KIT_EXAMPLES}
  onClick={(example) => {
    openProject({
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
  items={VALIDATOR_SPECIFIC_EXAMPLES}
  onClick={(example) => {
    openProject({
      platform,
      example,
      theme,
      validator: VALIDATOR_SPECIFIC_EXAMPLE_VALIDATORS[example],
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
    & :global(select) {
      width: 100%;
      background-color: var(--sl-color-bg);
      padding: 0.5rem;
      border-radius: 0.5rem;
      color: inherit;
      /* appearance: none; */
    }
  }
</style>
