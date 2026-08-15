<script lang="ts" module>
  import type { HTMLInputAttributes } from "svelte/elements";

  declare module "@sjsf/form" {
    interface UiOptions {
      astryxCombobox?: HTMLInputAttributes;
    }
  }
</script>

<script lang="ts">
  import type { SearchableItem } from "@astryx-svelte/core";
  import { Typeahead } from "@astryx-svelte/core";
  import {
    getFormContext,
    customInputAttributes,
    type ComponentProps,
  } from "@sjsf/form";
  import { idMapper, singleOption } from "@sjsf/form/options.svelte";
  import "@sjsf/form/fields/extra-widgets/combobox";

  let {
    config,
    handlers,
    value = $bindable(),
    options,
    mapped = singleOption({
      mapper: () => idMapper(options),
      value: () => value,
      update: (v) => (value = v),
    }),
  }: ComponentProps["comboboxWidget"] = $props();

  const ctx = getFormContext();

  const attributes = $derived(
    customInputAttributes(ctx, config, "astryxCombobox", {})
  );

  const items: SearchableItem[] = options.map((o) => ({
    id: o.mappedValue ?? o.id,
    label: o.label,
  }));

  const selectedItem = $derived(
    items.find((i) => i.id === mapped.current) ?? null
  );

  const searchSource = {
    search: (query: string) =>
      items.filter((i) => i.label.toLowerCase().includes(query.toLowerCase())),
    bootstrap: () => items,
  };
</script>

<Typeahead
  label={config.title ?? "Select"}
  {searchSource}
  value={selectedItem}
  onChange={(item) => {
    mapped.current = item?.id ?? "";
    handlers.oninput?.();
    handlers.onchange?.();
  }}
  isDisabled={attributes.disabled === true}
  hasClear
  placeholder="Search..."
/>
