<script lang="ts">
  import Minus from "@lucide/svelte/icons/minus";
  import Plus from "@lucide/svelte/icons/plus";

  import { Button } from "./ui/button/index.js";

  interface Props {
    value: number;
    minimum: number;
    onUp: () => void;
    onDown: () => void;
  }

  let { value = $bindable(), onUp, onDown, minimum }: Props = $props();
</script>

<div class="flex items-center bg-background rounded-sm">
  <Button
    variant="outline"
    class="size-8 hover:bg-accent hover:text-accent-foreground"
    size="icon"
    onclick={onDown}
    disabled={value <= minimum}
  >
    <Minus />
  </Button>
  <div class="px-2 flex items-center justify-center tabular-nums">
    {value}
  </div>
  <Button
    variant="outline"
    class="size-8 hover:bg-accent hover:text-accent-foreground"
    size="icon"
    onclick={onUp}
  >
    <Plus />
  </Button>
</div>
