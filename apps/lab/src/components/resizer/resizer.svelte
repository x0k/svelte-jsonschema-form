<script lang="ts">
  import { Alignment, Orientation } from "./model.js";

  interface Props {
    onMove: (e: MouseEvent) => void;
    onMoveStart?: (e: MouseEvent) => void;
    onMoveEnd?: (e: MouseEvent) => void;
    /**
     * @default Orientation.Vertical
     */
    orientation?: Orientation;
    /**
     * @default Alignment.Start
     */
    alignment?: Alignment;
  }

  const {
    onMove,
    onMoveStart,
    onMoveEnd,
    orientation = Orientation.Vertical,
    alignment = Alignment.Start,
  }: Props = $props();

  let resizerElement: HTMLDivElement;

  function onEndMove(e: MouseEvent) {
    onMoveEnd?.(e);
    window.removeEventListener("mouseup", onEndMove);
    window.removeEventListener("mouseleave", onEndMove);
    window.removeEventListener("mousemove", onMove);
  }

  function onStartMove(e: MouseEvent) {
    onMoveStart?.(e);
    window.addEventListener("mouseup", onEndMove);
    window.addEventListener("mouseleave", onEndMove);
    window.addEventListener("mousemove", onMove);
  }

  $effect(() => {
    resizerElement.addEventListener("mousedown", onStartMove);
    return () => {
      resizerElement.removeEventListener("mousedown", onStartMove);
    };
  });
</script>

<div
  bind:this={resizerElement}
  class={[
    "absolute select-none z-50 active:bg-primary hover:bg-primary/50",
    alignment === Alignment.Start && "top-0 left-0",
    alignment === Alignment.End && "bottom-0 right-0",
    orientation === Orientation.Horizontal &&
      "h-1 w-full hover:cursor-row-resize",
    orientation === Orientation.Vertical &&
      "h-full w-1 hover:cursor-col-resize",
  ]}
></div>
