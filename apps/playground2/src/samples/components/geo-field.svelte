<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  let { config, value = $bindable() }: ComponentProps["objectField"] = $props();
</script>

<div>
  <h3>This is a custom field</h3>
  <p>
    Which breaks a lot of expectations (disabled, readonly, customization via
    uiSchema, etc). Use wisely.
  </p>
  {#if value}
    <div style="display: flex; gap: 0.5rem">
      <label style="flex: 1">
        <b>Latitude</b>
        <input
          id="{config.id}-lat"
          type="number"
          step="0.00001"
          bind:value={value.lat}
        />
      </label>
      <label style="flex: 1">
        <b>Longitude</b>
        <input
          id="{config.id}-lon"
          type="number"
          step="0.00001"
          bind:value={value.lon}
        />
      </label>
    </div>
  {/if}
</div>
