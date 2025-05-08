<script lang="ts" module>
  export { Alignment, Orientation } from "./resizer/index.js";
</script>

<script lang="ts">
  import type { Snippet } from "svelte";

  import type { Vec2 } from "@/lib/math.js";
  import { identity } from "@/lib/function.js";

  import { Resizer, Alignment, Orientation } from "./resizer/index.js";

  interface Props {
    size: number;
    children: Snippet;
    /**
     * @default Orientation.Vertical
     */
    orientation?: Orientation;
    /**
     * @default Alignment.Start
     */
    alignment?: Alignment;
    normalizeSize?: (size: number, old: number) => number;
    class?: string;
  }

  let {
    size = $bindable(),
    orientation = Orientation.Vertical,
    alignment = Alignment.Start,
    children,
    class: className,
    normalizeSize = identity,
  }: Props = $props();

  const ORIENTATION_TO_STYLE: Record<Orientation, "height" | "width"> = {
    [Orientation.Horizontal]: "height",
    [Orientation.Vertical]: "width",
  };

  const ORIENTATION_TO_COORD: Record<Orientation, "clientX" | "clientY"> = {
    [Orientation.Horizontal]: "clientY",
    [Orientation.Vertical]: "clientX",
  };

  type Op = (a: number, b: number, c: number) => number;
  const op1: Op = (a, b, c) => a - b + c;
  const op2: Op = (a, b, c) => a + b - c;
  const ORIENTATION_TO_OPERATION: Record<Orientation, Record<Alignment, Op>> = {
    [Orientation.Horizontal]: {
      [Alignment.Start]: op1,
      [Alignment.End]: op2,
    },
    [Orientation.Vertical]: {
      [Alignment.Start]: op1,
      [Alignment.End]: op2,
    },
  };

  const sizeProp = $derived(ORIENTATION_TO_STYLE[orientation]);
  const coord = $derived(ORIENTATION_TO_COORD[orientation]);
  const op = $derived(ORIENTATION_TO_OPERATION[orientation][alignment]);

  let start: Vec2;
</script>

<div class={className} style="{sizeProp}: {size}px">
  <Resizer
    {orientation}
    {alignment}
    onMoveStart={(e) => {
      start = { x: size, y: e[coord] };
    }}
    onMove={(e) => {
      size = normalizeSize(op(start.y, e[coord], start.x), size);
    }}
  />
  {@render children()}
</div>
