<script lang="ts" module>
  import type { Tiles } from "svelte-tiler";
  import type { HTMLAttributes } from "svelte/elements";

  import Grip from "./grip.svelte";

  export { gripHeader };
</script>

{#snippet gripHeader(
  props: HTMLAttributes<HTMLElement>,
  tile: Tiles["tabs"],
  index: number
)}
  <div {...props}>
    <Grip />
    {tile.titles[index]}
  </div>
{/snippet}
