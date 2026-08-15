<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      astryxTags?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import type { SearchableItem } from "@astryx-svelte/core";
  import { Tokenizer } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/form/fields/extra-widgets/tags";

  let {
    value = $bindable(),
    config,
    handlers,
  }: ComponentProps["tagsWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "astryxTags", {})
  );

  const items = $derived((value ?? []).map((v) => ({ id: v, label: v })));

  const searchSource = {
    search: (query: string) => {
      const q = query.toLowerCase();
      return items.filter((i) => i.label.toLowerCase().includes(q));
    },
    bootstrap: () => items,
  };
</script>

<Tokenizer
  label={config.title ?? "Tags"}
  {searchSource}
  value={items}
  onChange={(newItems, change) => {
    if (change.type === "create") {
      value = [...(value ?? []), change.item.label];
    } else if (change.type === "remove") {
      value = (value ?? []).filter((v) => v !== change.item.id);
    } else if (change.type === "add") {
      value = [...(value ?? []), change.item.id];
    }
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
  hasClear={false}
  placeholder="Add tag..."
/>
