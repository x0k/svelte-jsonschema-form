<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";
  import Helper from 'flowbite-svelte/Helper.svelte'

  const { help }: ComponentProps<"help"> = $props();
</script>

<Helper>{help}</Helper>
