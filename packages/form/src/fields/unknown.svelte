<script lang="ts">
  import type { ComponentProps } from "@/form/index.js";

  const { value = $bindable() }: ComponentProps["unknownField"] = $props();
</script>
