<script lang="ts">
  import { Button } from "$lib/components/ui/button/index.js";

  import Trash from "@lucide/svelte/icons/trash-2";

  interface Props {
    onClick: (e: MouseEvent) => void;
  }

  const { onClick }: Props = $props();
</script>

<Button variant="destructive" size="icon" class="size-8" onclick={onClick}>
  <Trash />
</Button>
