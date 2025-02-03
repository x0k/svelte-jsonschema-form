<script lang="ts">
  import type { ComponentProps } from "@sjsf/form";

  const { description }: ComponentProps<"description"> = $props();
</script>

<p class="fieldset-label">{description}</p>
