<script lang="ts" module>
  import type {
    PlaygroundState,
    ValidatorPageState,
    MergerPageState,
  } from "./core/index.js";
  import type { Page } from "./router.js";

  const clearUrl = new URL(location.href);
  clearUrl.search = "";
  clearUrl.hash = "";
  const clearHref = clearUrl.toString();

  const TITLES: Record<Page, string> = {
    "": "Form",
    m: "Merger",
    v: "Validator",
  };

  interface PageStates {
    "": PlaygroundState;
    v: ValidatorPageState;
    m: MergerPageState;
  }
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  import { Button } from "$lib/components/ui/button/index.js";
  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { THEME_TITLES, THEMES } from "$lib/theme.js";
  import Select from "$lib/select.svelte";
  import Github from "$lib/github.svelte";
  import OpenBook from "$lib/open-book.svelte";

  import { themeManager } from "./theme.svelte.js";
  import { router } from "./router.js";

  const {
    children,
    transitions,
  }: {
    children?: Snippet;
    transitions: { [P in Page]: () => Partial<PageStates[P]> };
  } = $props();
</script>

{#snippet link(page: Page)}
  <Button
    variant="secondary"
    class={[router.page === page && "bg-primary/10", "hover:bg-primary/10"]}
    onclick={(e) => {
      e.preventDefault();
      router.navigate(page, transitions[page]());
    }}
    href={page ? `${clearHref}?page=${page}` : clearHref}>{TITLES[page]}</Button
  >
{/snippet}

<div class="flex flex-wrap items-center gap-2">
  <a href={clearHref} class="text-3xl font-bold mr-2">Playground</a>
  <ButtonGroup.Root>
    {@render link("")}
    {@render link("v")}
    {@render link("m")}
  </ButtonGroup.Root>
  <div class="grow"></div>
  {@render children?.()}
  <Button
    variant="ghost"
    size="icon"
    href="https://x0k.github.io/svelte-jsonschema-form/"
  >
    <OpenBook class="size-6" />
  </Button>
  <Button
    target="_blank"
    href="https://github.com/x0k/svelte-jsonschema-form/"
    size="icon"
    variant="ghost"
  >
    <Github class="size-6" />
  </Button>
  <Select
    label="App theme"
    bind:value={themeManager.theme}
    items={THEMES}
    labels={THEME_TITLES}
  />
</div>
