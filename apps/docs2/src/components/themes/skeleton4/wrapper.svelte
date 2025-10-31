<script lang="ts">
  import { fromRecord } from "@sjsf/form/lib/resolver";
  import type { ExtraUiOptions } from '@sjsf/form';

  import Form from './form.svelte'

  let portalEl = $state.raw() as HTMLDivElement
  const rootNode = $derived(portalEl?.getRootNode());

  const options = {
    getRootNode() {
      return rootNode;
    },
  };

  const extraUiOptions: ExtraUiOptions = fromRecord({
    skeleton4Slider: options,
    skeleton4FileUpload: options,
    skeleton4Rating: options,
    skeleton4Segment: options,
    skeleton4Switch: options,
    skeleton4Tags: options,
    skeleton4DatePicker: options,
    skeleton4Combobox: options,
  })
</script>

<Form {extraUiOptions} />
<div bind:this={portalEl}></div>
