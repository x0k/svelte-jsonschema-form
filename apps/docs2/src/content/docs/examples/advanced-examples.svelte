<script lang="ts">
  import {
    ACTUAL_THEMES,
    THEME_TITLES,
    VALIDATORS,
    type ActualTheme,
    type Validator,
  } from "@/shared";

  let theme: ActualTheme = $state.raw("basic");
  let validator: Validator = $state.raw("ajv8");
</script>

<div class="pickers">
  <button style="display: none;">Avoid starlight styles pollution</button>
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
</div>

<style>
  .pickers {
    display: grid;
    grid-auto-flow: column;
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
