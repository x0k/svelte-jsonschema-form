<script lang="ts" module>
  import type {
    FormState,
    MergerState,
    OmitState,
    ValidatorState,
  } from "meta/playground";

  import type { Page } from "./router.js";

  const clearUrl = new URL(location.href);
  clearUrl.search = "";
  clearUrl.hash = "";
  const clearHref = clearUrl.toString();

  const TITLES: Record<Page, string> = {
    "": "Form",
    m: "Merger",
    o: "Omit",
    v: "Validator",
  };

  interface PageStates {
    "": FormState;
    v: ValidatorState;
    m: MergerState;
    o: OmitState;
  }
</script>

<script lang="ts">
  import Monitor from "@lucide/svelte/icons/monitor";
  import Moon from "@lucide/svelte/icons/moon";
  import Sun from "@lucide/svelte/icons/sun";
  import { abortPrevious, createTask } from "@sjsf/form/lib/task.svelte";
  import type { MaybePromise } from "@sjsf/form/lib/types";
  import type { Snippet } from "svelte";

  import * as ButtonGroup from "$lib/components/ui/button-group/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Github from "$lib/github.svelte";
  import OpenBook from "$lib/open-book.svelte";
  import { Theme } from "$lib/theme.js";

  import { router } from "./router.js";
  import { themeManager } from "./theme.svelte.js";

  const {
    children,
    transitions,
  }: {
    children?: Snippet;
    transitions: {
      [P in Page]: (s: AbortSignal) => MaybePromise<Partial<PageStates[P]>>;
    };
  } = $props();

  const navigationTask = createTask<[Page], Partial<PageStates[Page]>>({
    combinator: abortPrevious,
    execute: async (s, page) => transitions[page](s),
    onSuccess(data, page) {
      router.navigate(page, data);
    },
    onFailure(err) {
      if (err.reason === "aborted") {
        return;
      }
      console.error(err);
    },
  });
</script>

{#snippet link(page: Page)}
  <Button
    variant="secondary"
    class={[router.page === page && "bg-primary/10", "hover:bg-primary/10"]}
    onclick={(e) => {
      e.preventDefault();
      navigationTask.run(page);
    }}
    href={page ? `${clearHref}?page=${page}` : clearHref}>{TITLES[page]}</Button
  >
{/snippet}

<div class="flex flex-wrap items-center gap-2">
  <a href={clearHref} class="mr-2 text-3xl font-bold">Playground</a>
  <ButtonGroup.Root>
    {@render link("")}
    {@render link("v")}
    {@render link("m")}
    {@render link("o")}
  </ButtonGroup.Root>
  <div class="grow"></div>
  {@render children?.()}
  <ButtonGroup.Root>
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
    <Button
      size="icon"
      variant="ghost"
      onclick={() => {
        themeManager.theme =
          themeManager.theme === Theme.System
            ? Theme.Light
            : themeManager.theme === Theme.Light
              ? Theme.Dark
              : Theme.System;
      }}
    >
      {#if themeManager.theme === Theme.Light}
        <Sun class="size-6" />
      {:else if themeManager.theme === Theme.Dark}
        <Moon class="size-6" />
      {:else}
        <Monitor class="size-6" />
      {/if}
    </Button>
  </ButtonGroup.Root>
</div>
