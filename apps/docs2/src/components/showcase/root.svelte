<script lang="ts">
  import type { Snippet } from "svelte";
  import { SvelteMap, SvelteURLSearchParams } from "svelte/reactivity";

  import { isTheme, THEME_TITLES, THEMES, type Theme } from "@/shared";

  import { setShowcaseContext, type ShowcaseContext } from "./context";

  const { children }: { children: Snippet } = $props();

  const themes = new SvelteMap<Theme, Snippet>();

  // const params = new SvelteURLSearchParams(location.search);

  // function setTheme(theme: Theme) {
  //   params.set("theme", theme);
  //   history.replaceState({}, "", "?" + params.toString());
  // }

  // const selected = $derived.by((): Theme => {
  //   const themeParameter = params.get("theme");
  //   if (themeParameter && isTheme(themeParameter)) {
  //     return themeParameter;
  //   }
  //   return "basic";
  // });

  let selected: Theme = $state("basic");

  function setTheme(theme: Theme) {
    selected = theme;
  }

  const context: ShowcaseContext = {
    addTheme(theme, snippet) {
      themes.set(theme, snippet);
    },
    get selected() {
      return selected;
    },
  };

  setShowcaseContext(context);

  // const theme = $derived(themes.get(selected))
</script>

<h2 id="installation">Installation</h2>

<p>Choose your favorite theme:</p>

<div class="theme-buttons-container">
  {#each THEMES as theme (theme)}
    <button onclick={() => setTheme(theme)} data-selected={selected === theme}>
      {THEME_TITLES[theme]}
    </button>
  {/each}
</div>

{@render children()}

<!-- {@render theme?.()} -->

<style>
  .theme-buttons-container {
    display: flex;
    justify-content: center;
    align-items: baseline;
    flex-wrap: wrap;
    padding-bottom: 2rem;
    button {
      margin: 0;
      background-color: transparent;
      cursor: pointer;
      padding: 0.5rem 1rem;
      border: 1px solid var(--sl-color-gray-5);
      color: var(--sl-color-text-accent);
      &[data-selected="true"] {
        background-color: var(--sl-color-gray-5);
      }
    }
  }
</style>
