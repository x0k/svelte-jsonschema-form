<script lang="ts">
  import ExternalLink from "@lucide/svelte/icons/external-link";
  import { EXAMPLE_ENTRIES, openExample } from "meta/demos";
  import { SandboxPlatform } from "meta/sandbox";

  import { persistentThemeRef } from "./demo.svelte";

  interface Props {
    example: string;
  }

  let { example }: Props = $props();

  const entry = $derived(EXAMPLE_ENTRIES.find((e) => e.meta.title === example));

  async function handleClick() {
    if (!entry) {
      console.warn(`Example "${example}" not found`);
      return;
    }
    await openExample({
      entry,
      themeOrSubTheme: persistentThemeRef.current,
      validator: "ajv8",
      platform: SandboxPlatform.StackBlitz,
    });
  }
</script>

<button
  type="button"
  class="open-in-sandbox"
  onclick={handleClick}
  disabled={!entry}
  title="Open example in StackBlitz"
>
  {example}<ExternalLink size={12} />
</button>

<style>
  .open-in-sandbox {
    all: unset;
    cursor: pointer;
    color: var(--sl-color-text-accent);
    text-decoration: underline;
    text-decoration-style: dotted;
    font: inherit;
    display: inline-flex;
    align-items: center;
    gap: 0.15em;

    &:hover {
      color: var(--sl-color-text);
    }

    &:disabled {
      cursor: default;
      opacity: 0.5;
    }
  }
</style>
