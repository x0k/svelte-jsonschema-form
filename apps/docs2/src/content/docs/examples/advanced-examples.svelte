<script lang="ts">
  import { themeOrSubThemeTitle, validatorTitle } from "meta";
  import {
    codegenThemeOrSubTheme,
    type CodegenThemeOrSubTheme,
  } from "meta/codegen";
  import {
    GROUPED_EXAMPLES,
    openExample,
    Tag,
    exampleCategories,
    type ExampleEntry,
    type DemosValidator,
    demosValidators,
  } from "meta/demos";
  import { SandboxPlatform, SANDBOX_PLATFORMS } from "meta/sandbox";

  import Button from "@/components/button.svelte";

  import ExampleCards from "./example-cards.svelte";
  import CatalogFilter from "./catalog-filter.svelte";

  let platform: SandboxPlatform = $state.raw(SandboxPlatform.StackBlitz);
  let theme: CodegenThemeOrSubTheme = $state.raw("basic");
  let validator: DemosValidator["name"] = $state.raw("ajv8");
</script>

{#snippet exampleCards(entries: readonly ExampleEntry[])}
  <ExampleCards
    items={entries}
    onclick={(entry) =>
      openExample({ entry, themeOrSubTheme: theme, validator, platform })}
    title={(entry) => entry.meta.title}
    description={(entry) => entry.meta.description}
  >
    {#snippet children(entry)}
      <span class="tag-pills">
        {#each entry.meta.tags as tag (tag)}
          <Button size="sm">{tag}</Button>
        {/each}
      </span>
    {/snippet}
  </ExampleCards>
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
      {#each demosValidators() as { name } (name)}
        <option value={name}>
          {validatorTitle(name)}
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

<CatalogFilter
  tags={Object.values(Tag)}
  categories={exampleCategories()}
  grouped={GROUPED_EXAMPLES}
  label="example"
>
  {#snippet children({ category, items })}
    {@render exampleCards(items)}
  {/snippet}
</CatalogFilter>

<style>
  :global(html) {
    overflow-y: scroll;
  }

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

  .tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
</style>
