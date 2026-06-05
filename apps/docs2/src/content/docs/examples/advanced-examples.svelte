<script lang="ts">
  import { themeOrSubThemeTitle, validatorTitle } from "meta";
  import {
    codegenThemeOrSubTheme,
    type CodegenThemeOrSubTheme,
    type CodegenNonPrecompiledValidator,
  } from "meta/codegen";
  import { SvelteSet } from "svelte/reactivity";
  import { SandboxPlatform, SANDBOX_PLATFORMS } from "meta/sandbox";
  import {
    EXAMPLES,
    EXAMPLE_METADATA,
    openExample,
    Tag,
    type Example,
    nonPrecompiledValidators,
  } from "meta/demos";

  let platform: SandboxPlatform = $state.raw(SandboxPlatform.StackBlitz);
  let theme: CodegenThemeOrSubTheme = $state.raw("basic");
  let validator: CodegenNonPrecompiledValidator = $state.raw("ajv8");

  const allTags = Object.values(Tag) as Tag[];
  const selectedTags = new SvelteSet<Tag>();

  const filteredExamples = $derived(
    selectedTags.size === 0
      ? EXAMPLES
      : EXAMPLES.filter((e) => {
          let c = 0;
          const tags = EXAMPLE_METADATA[e].tags;
          for (let i = 0; c < selectedTags.size && i < tags.length; i++) {
            if (selectedTags.has(tags[i])) {
              c++;
            }
          }
          return c === selectedTags.size;
        })
  );

  function toggleTag(tag: Tag) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
  }
</script>

{#snippet exampleCards(examplesList: readonly Example[])}
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
          <span class="tag-pills">
            {#each meta.tags as tag (tag)}
              <span class="tag-pill">{tag}</span>
            {/each}
          </span>
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

<div class="tag-bar">
  {#each allTags as tag (tag)}
    <button
      class="tag-chip"
      class:active={selectedTags.has(tag)}
      onclick={() => toggleTag(tag)}
    >
      {tag}
    </button>
  {/each}
</div>

<p class="count">
  Showing {filteredExamples.length}
  {filteredExamples.length === 1
    ? "example"
    : "examples"}{#if selectedTags.size > 0}, <button
      class="clear-btn"
      onclick={() => selectedTags.clear()}>clear filter</button
    >{/if}
</p>

{@render exampleCards(filteredExamples)}

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

  .tag-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: flex-start;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .tag-chip {
    padding: 0.25rem 0.75rem;
    margin: 0;
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 999px;
    background: transparent;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    font-size: var(--sl-text-sm);
    font-family: inherit;
    line-height: 1.4;
    outline: none;
    &:hover {
      border-color: var(--sl-color-gray-2);
      color: var(--sl-color-white);
    }
  }

  .tag-chip.active {
    padding: 0.25rem 0.75rem;
    margin: 0;
    border: 1px solid var(--sl-color-gray-2);
    border-radius: 999px;
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
    cursor: pointer;
    font-size: var(--sl-text-sm);
    font-family: inherit;
    line-height: 1.4;
    outline: none;
  }

  .clear-btn {
    padding: 0;
    border: none;
    background: none;
    color: inherit;
    font: inherit;
    outline: none;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 2px;
    &:hover {
      color: var(--sl-color-red);
    }
  }

  .count {
    color: var(--sl-color-gray-3);
    font-size: var(--sl-text-sm);
    margin: 1rem 0;
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
    min-height: 100%;
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

  .tag-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin-top: auto;
  }

  .tag-pill {
    padding: 0.125rem 0.5rem;
    border: 1px solid var(--sl-color-gray-6);
    border-radius: 999px;
    font-size: var(--sl-text-xs);
    color: var(--sl-color-gray-3);
  }

  .arrow {
    color: var(--sl-color-gray-3);
    font-size: 1.333em;
  }
</style>
