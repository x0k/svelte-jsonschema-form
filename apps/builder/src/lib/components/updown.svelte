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

<div class="bg-background flex items-center rounded-sm">
  <Button
    variant="outline"
    class="hover:bg-accent hover:text-accent-foreground size-8"
    size="icon"
    onclick={onDown}
    disabled={value <= minimum}
  >
    <Minus />
  </Button>
  <div class="flex items-center justify-center px-2 tabular-nums">
    {value}
  </div>
  <Button
    variant="outline"
    class="hover:bg-accent hover:text-accent-foreground size-8"
    size="icon"
    onclick={onUp}
  >
    <Plus />
  </Button>
</div>
