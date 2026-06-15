<script lang="ts">
  import {
    errorsListAttributes,
    getFormContext,
    type ComponentProps,
  } from "@sjsf/form";
  import "@sjsf/basic-theme/components/errors-list.svelte";

  const { errors, config }: ComponentProps["errorsList"] = $props();

  const ctx = getFormContext();
</script>

<ul
  class="list-inside list-disc text-destructive"
  {...errorsListAttributes(ctx, config, "errorsList", {})}
>
  {#each errors as err, i (i)}
    <li>{err}</li>
  {/each}
</ul>
