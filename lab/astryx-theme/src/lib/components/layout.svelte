<script lang="ts">
  import { HStack, VStack, StackItem } from "@astryx-svelte/core";
  import {
    getFormContext,
    layoutAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/layout.svelte";

  const { type, children, config, errors }: ComponentProps["layout"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    layoutAttributes(ctx, config, "layout", "layouts", type, {})
  );
</script>

{#if type === "field-content"}
  {@render children()}
{:else if type === "array-item-controls"}
  <div {...attributes}>
    <HStack gap={0.5}>
      {@render children()}
    </HStack>
  </div>
{:else if type === "field"}
  <div
    {...attributes}
    class={[
      "astryx-field",
      errors.length > 0 && "astryx-field--error",
      attributes.class,
    ]}
  >
    <VStack gap={0.5}>
      {@render children()}
    </VStack>
  </div>
{:else if type === "multi-field-controls"}
  <div {...attributes}>
    <HStack gap={0.5} justify="between" align="center">
      {@render children()}
    </HStack>
  </div>
{:else if type === "array-item"}
  <div {...attributes}>
    <HStack gap={0.5} vAlign="start">
      {@render children()}
    </HStack>
  </div>
{:else if type === "array-item-content"}
  <div {...attributes}>
    <StackItem size="fill">
      {@render children()}
    </StackItem>
  </div>
{:else if type === "object-property"}
  <div {...attributes}>
    <HStack gap={0.5} vAlign="start">
      {@render children()}
    </HStack>
  </div>
{:else if type === "object-property-key-input" || type === "object-property-content"}
  <div {...attributes}>
    <StackItem size="fill">
      {@render children()}
    </StackItem>
  </div>
{:else if type === "field-title-row" || type === "array-field-title-row" || type === "object-field-title-row"}
  <div {...attributes}>
    <HStack gap={0.5} justify="between" align="center">
      {@render children()}
    </HStack>
  </div>
{:else if type === "array-items" || type === "object-properties" || type === "array-field" || type === "object-field" || type === "multi-field"}
  <div {...attributes}>
    <VStack gap={1}>
      {@render children()}
    </VStack>
  </div>
{:else}
  <div {...attributes}>
    {@render children()}
  </div>
{/if}

<style>
  :global(.astryx-field) {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius-element);
    background-color: var(--color-background-surface);
    transition: border-color 125ms ease;
  }

  :global(.astryx-field:focus-within) {
    border-color: var(--color-border-emphasized);
  }

  :global(.astryx-field--error) {
    border-color: var(--color-error);
  }
</style>
