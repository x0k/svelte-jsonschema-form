<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props extends Omit<HTMLButtonAttributes, "children" | "class"> {
    active?: boolean;
    size?: "sm" | "md" | "lg";
    variant?: "pill" | "ghost" | "outlined";
    children: Snippet;
  }

  let {
    active = false,
    disabled = false,
    onclick,
    size = "md",
    title,
    variant = "ghost",
    children,
    ...restProps
  }: Props = $props();
</script>

<button
  {...restProps}
  type="button"
  class="btn {variant} {size}"
  class:active
  {disabled}
  {onclick}
  {title}
>
  {@render children()}
</button>

<style>
  /* Base */
  .btn {
    --btn-height: 2rem;

    all: unset;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--btn-height);
    padding-inline: 0.75rem;
    font-size: var(--sl-text-sm);
    line-height: 1;
    color: var(--sl-color-gray-3);
    cursor: pointer;
    gap: 0.5rem;
    transition:
      background 0.15s,
      color 0.15s,
      border-color 0.15s;
    border-radius: 0.2rem;

    &:global(:has(svg:only-child)) {
      inline-size: var(--btn-height);
      padding-inline: 0;
    }

    &:hover {
      background: var(--sl-color-gray-6);
      color: var(--sl-color-white);
    }

    &:focus-visible {
      outline: 2px solid var(--sl-color-text-accent);
      outline-offset: 2px;
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
      pointer-events: none;
    }

    &.sm {
      --btn-height: 1.625rem;

      padding-inline: 0.625rem;
      font-size: var(--sl-text-xs);
    }

    &.lg {
      --btn-height: 2.25rem;

      padding-inline: 1rem;
    }

    /* Variants — visual style */
    &.pill {
      border: 1px solid var(--sl-color-gray-5);
      border-radius: 999px;
      background: var(--sl-color-bg);
    }

    &.ghost {
      border: 1px solid transparent;
    }

    &.outlined {
      border: 1px solid var(--sl-color-gray-5);
      border-radius: 0.375rem;
      background: transparent;
    }

    &.active {
      background: var(--sl-color-gray-5);
      color: var(--sl-color-white);
      border-color: var(--sl-color-text-accent);

      :global([data-theme="light"]) & {
        background-color: transparent;
      }
    }
  }
</style>
