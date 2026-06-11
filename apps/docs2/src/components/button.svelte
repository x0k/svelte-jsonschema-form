<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    active?: boolean;
    disabled?: boolean;
    onclick?: () => void;
    variant?: "pill" | "icon";
    size?: "sm" | "md";
    title?: string;
    children: Snippet;
  }

  let {
    active = false,
    disabled = false,
    onclick,
    variant = "pill",
    size = "md",
    title,
    children,
  }: Props = $props();
</script>

{#if onclick}
  <button
    class="btn {variant} {size}"
    class:active
    {disabled}
    {onclick}
    {title}
  >
    {@render children()}
  </button>
{:else}
  <span class="btn {variant} {size}">
    {@render children()}
  </span>
{/if}

<style>
  .btn {
    all: unset;
    display: inline-flex;
    align-items: center;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
  }

  /* Pill variant */
  .btn.pill {
    border: 1px solid var(--sl-color-gray-5);
    border-radius: 999px;
    background: var(--sl-color-bg);
  }

  .btn.pill.md {
    padding: 0.25rem 1rem;
    font-size: var(--sl-text-xs);
  }

  .btn.pill.sm {
    padding: 0.125rem 0.5rem;
    font-size: var(--sl-text-xs);
  }

  /* Icon variant */
  .btn.icon {
    justify-content: center;
    width: 1.6rem;
    height: 1.6rem;
    border: 1px solid transparent;
    border-radius: 0.375rem;
    background: transparent;
  }

  /* Shared states */
  .btn:hover {
    background: var(--sl-color-gray-6);
    color: var(--sl-color-white);
  }

  .btn.active {
    background: var(--sl-color-gray-5);
    color: var(--sl-color-white);
    border-color: var(--sl-color-text-accent);
  }

  :global([data-theme="light"]) .btn.active {
    background-color: transparent;
  }

  .btn:disabled {
    opacity: 0.35;
    cursor: default;
    pointer-events: none;
  }
</style>
