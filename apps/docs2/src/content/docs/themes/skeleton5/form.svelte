<script lang="ts">
  import { BasicForm, createForm, getValueSnapshot } from "@sjsf/form";
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import { theme } from "@sjsf/skeleton5-theme";
  import { specs } from "@sjsf/skeleton5-theme/specs";

  import * as defaults from "@/lib/sjsf/defaults";
  import { themeManager } from "@/theme.svelte";

  import { createSchemas } from "../_demo-schema";

  let rootNode = $state<Node>();
  const options = {
    getRootNode() {
      return rootNode!;
    },
  };
  const portalProps = {
    get target() {
      return divEl;
    },
  };

  const form = createForm({
    ...defaults,
    ...createSchemas(specs),
    theme,
    extraUiOptions: fromRecord({
      skeleton5Slider: options,
      skeleton5FileUpload: options,
      skeleton5RangeSlider: options,
      skeleton5Rating: options,
      skeleton5Segment: options,
      skeleton5Switch: options,
      skeleton5Tags: options,
      skeleton5Combobox: options,
      skeleton5ComboboxPortal: portalProps,
      skeleton5DatePicker: options,
      skeleton5DatePickerPortal: portalProps,
      skeleton5DateRangePicker: options,
      skeleton5DateRangePickerPortal: portalProps,
    }),
  });

  let divEl: HTMLElement;
  $effect(() => {
    rootNode = divEl.getRootNode();
  });
</script>

<div bind:this={divEl}></div>

{#if rootNode}
  <BasicForm
    {form}
    novalidate
    class="flex flex-col gap-4"
    style="margin-bottom: 1rem; color-scheme: {themeManager.darkOrLight};"
    data-theme="cerberus"
  />
{/if}

<pre>{JSON.stringify(getValueSnapshot(form), null, 2)}</pre>
