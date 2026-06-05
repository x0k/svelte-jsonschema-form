<script lang="ts">
  import { themeOrSubThemeTitle, validatorTitle } from "meta";
  import {
    codegenThemeOrSubTheme,
    type CodegenThemeOrSubTheme,
    type CodegenNonPrecompiledValidator,
  } from "meta/codegen";
  import { SandboxPlatform, SANDBOX_PLATFORMS } from "meta/sandbox";
  import {
    EXAMPLES,
    EXAMPLE_METADATA,
    openExample,
    ExampleCategory,
    type Example,
    nonPrecompiledValidators,
  } from "meta/demos";

  let platform: SandboxPlatform = $state.raw(SandboxPlatform.StackBlitz);
  let theme: CodegenThemeOrSubTheme = $state.raw("basic");
  let validator: CodegenNonPrecompiledValidator = $state.raw("ajv8");

  let open = $state({
    generic: false,
    formActions: false,
    remoteFunctions: false,
    validatorSpecific: false,
  });

  const generic = EXAMPLES.filter(
    (e) => EXAMPLE_METADATA[e].category === ExampleCategory.Generic
  );
  const formActions = EXAMPLES.filter(
    (e) => EXAMPLE_METADATA[e].category === ExampleCategory.FormActions
  );
  const remoteFunctions = EXAMPLES.filter(
    (e) => EXAMPLE_METADATA[e].category === ExampleCategory.RemoteFunctions
  );
  const validatorSpecific = EXAMPLES.filter(
    (e) => EXAMPLE_METADATA[e].category === ExampleCategory.ValidatorSpecific
  );
</script>

{#snippet sectionToggle(label: string, sectionKey: keyof typeof open)}
  <button
    class="section-toggle"
    onclick={() => (open[sectionKey] = !open[sectionKey])}
  >
    <h3>{label}</h3>
    <svg
      class="chevron"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      {#if open[sectionKey]}
        <polyline points="6 9 12 15 18 9" />
      {:else}
        <polyline points="9 18 15 12 9 6" />
      {/if}
    </svg>
  </button>
{/snippet}

{#snippet exampleCards(examplesList: Example[])}
  <div class="cards">
    {#each examplesList as example (example)}
      {@const meta = EXAMPLE_METADATA[example]}
      <div
        class="card not-content"
        role="button"
        tabindex="0"
        onclick={() =>
          openExample({ example, themeOrSubTheme: theme, validator, platform })}
        onkeydown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openExample({
              example,
              themeOrSubTheme: theme,
              validator,
              platform,
            });
          }
        }}
      >
        <span class="stack">
          <span class="title">{meta.title}</span>
          <span class="description">{meta.description}</span>
        </span>
        <span class="arrow">→</span>
      </div>
    {/each}
  </div>
{/snippet}

<div class="pickers">
  <button style="display: none;">Avoid starlight styles pollution</button>
  <label>
    <span>Platform</span>
    <select bind:value={platform}>
      {#each SANDBOX_PLATFORMS as v (v)}
        <option value={v}>
          {v}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Validator</span>
    <select bind:value={validator}>
      {#each nonPrecompiledValidators() as v (v)}
        <option value={v}>
          {validatorTitle(v)}
        </option>
      {/each}
    </select>
  </label>
  <label>
    <span>Theme</span>
    <select bind:value={theme}>
      {#each codegenThemeOrSubTheme() as t (t)}
        <option value={t}>
          {themeOrSubThemeTitle(t)}
        </option>
      {/each}
    </select>
  </label>
</div>

{@render sectionToggle(`Generic (${generic.length})`, "generic")}
{#if open.generic}
  {@render exampleCards(generic)}
{/if}

{@render sectionToggle(`Form Actions (${formActions.length})`, "formActions")}
{#if open.formActions}
  {@render exampleCards(formActions)}
{/if}

{@render sectionToggle(
  `Remote Functions (${remoteFunctions.length})`,
  "remoteFunctions"
)}
{#if open.remoteFunctions}
  {@render exampleCards(remoteFunctions)}
{/if}

{@render sectionToggle(
  `Validator specific (${validatorSpecific.length})`,
  "validatorSpecific"
)}
{#if open.validatorSpecific}
  <p><em>Validator selector will be ignored</em></p>
  {@render exampleCards(validatorSpecific)}
{/if}

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
    }
  }

  .cards {
    display: grid;
    grid-template-columns: 100%;
    gap: 1rem;
  }

  @media (min-width: 50rem) {
    .cards {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
  }

  .card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.5rem;
    align-items: start;
    margin: 0;
    padding: 1rem;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 0.5rem;
    box-shadow: var(--sl-shadow-sm);
    background: transparent;
    cursor: pointer;
    text-align: start;
    color: inherit;
  }

  .card:hover {
    background: var(--sl-color-gray-7, var(--sl-color-gray-6));
    border-color: var(--sl-color-gray-2);
  }

  .card:hover .arrow {
    color: var(--sl-color-white);
  }

  .stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .title {
    color: var(--sl-color-white);
    font-weight: 600;
    font-size: var(--sl-text-lg);
    line-height: var(--sl-line-height-headings);
  }

  .description {
    color: var(--sl-color-gray-3);
    line-height: 1.5;
  }

  .arrow {
    color: var(--sl-color-gray-3);
    font-size: 1.333em;
  }

  .section-toggle {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .chevron {
    flex-shrink: 0;
    margin: 0;
    color: var(--sl-color-gray-3);
  }
</style>
