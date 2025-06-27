<script lang="ts">
  import { array } from "@sjsf/form/lib/array";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  import type { GridCell, NodeId, NodeType } from "$lib/builder/builder.js";
  import { Button } from "$lib/components/ui/button/index.js";

  import type { NodeProps } from "../model.js";
  import SingleDropZone from "../single-drop-zone.svelte";
  import { getBuilderContext } from "../context.svelte.js";

  let { node = $bindable() }: NodeProps<NodeType.Grid> = $props();

  const { width, height } = $derived(node.options);

  const id = (x: number, y: number) => `${x}-${y}`;

  const { cells, grid, indexes } = $derived.by(() => {
    const cells = new Map<NodeId, GridCell>();
    const indexes = new Map<NodeId, number>();
    const grid: Array<Array<NodeId | null>> = array(height, () =>
      new Array(width).fill(null)
    );
    for (let k = 0; k < node.cells.length; k++) {
      const cell = node.cells[k];
      const n = cell.node;
      cells.set(n.id, cell);
      indexes.set(n.id, k);
      for (let i = cell.y; i < cell.y + cell.h; i++) {
        const row = grid[i];
        for (let j = cell.x; j < cell.x + cell.w; j++) {
          row[j] = n.id;
        }
      }
    }
    return { grid, cells, indexes };
  });

  const idToCell = new Map<NodeId, string>();
  const cellToId = new Map<string, NodeId>();

  function emptyCellId(cellId: string) {
    let index = 0;
    let cellIdToRegister = cellId;
    while (cellToId.get(cellIdToRegister) !== undefined) {
      cellIdToRegister = `${cellId}-${index++}`;
    }
    return cellIdToRegister;
  }

  function allocateId(nodeId: NodeId, cellId: string) {
    const lastCellId = idToCell.get(nodeId);
    if (lastCellId !== undefined) {
      return lastCellId;
    }
    let cellIdToRegister = emptyCellId(cellId);
    idToCell.set(nodeId, cellIdToRegister);
    cellToId.set(cellIdToRegister, nodeId);
    return cellIdToRegister;
  }

  function deallocateId(cellId: string) {
    const nodeId = cellToId.get(cellId);
    idToCell.delete(nodeId!);
    cellToId.delete(cellId);
  }

  function* elements() {
    const seen = new Set<NodeId>();
    for (let i = 0; i < height; i++) {
      const row = grid[i];
      for (let j = 0; j < width; j++) {
        const v = row[j];
        if (v === null) {
          yield {
            id: emptyCellId(id(j, i)),
            cell: {
              x: j,
              y: i,
              w: 1,
              h: 1,
              node: undefined,
            },
          };
        } else if (!seen.has(v)) {
          seen.add(v);
          yield { id: allocateId(v, id(j, i)), cell: cells.get(v)! };
        }
      }
    }
  }

  const DIR = {
    Left: 0,
    Top: 1,
    Right: 2,
    Bottom: 3,
  } as const;

  function getCheckRect(
    { x, y, h, w }: Omit<GridCell, "node">,
    dir: (typeof DIR)[keyof typeof DIR]
  ): [x: number, x1: number, y: number, y1: number] {
    switch (dir) {
      case DIR.Left:
        return [x - 1, x, y, y + h];
      case DIR.Right:
        return [x + w, x + w + 1, y, y + h];
      case DIR.Top:
        return [x, x + w, y - 1, y];
      case DIR.Bottom:
        return [x, x + w, y + h, y + h + 1];
    }
  }

  function isResizable(
    cell: Omit<GridCell, "node">,
    dir: (typeof DIR)[keyof typeof DIR]
  ): boolean {
    const [x, x1, y, y1] = getCheckRect(cell, dir);
    if (x < 0 || x1 > width || y < 0 || y1 > height) {
      return false;
    }
    for (let i = y; i < y1; i++) {
      const row = grid[i];
      for (let j = x; j < x1; j++) {
        if (row[j] !== null) {
          return false;
        }
      }
    }
    return true;
  }

  const ctx = getBuilderContext();
</script>

<div
  class="grid gap-2"
  style="grid-template-columns: repeat({width}, auto); grid-template-rows: repeat({height}, auto);"
>
  {#each elements() as element (element.id)}
    {@const c = element.cell}
    {@const isSelected =
      c.node !== undefined && ctx.selectedNode?.id === c.node.id}
    {@const rl = isSelected && isResizable(c, DIR.Left)}
    {@const rr = isSelected && isResizable(c, DIR.Right)}
    {@const rt = isSelected && isResizable(c, DIR.Top)}
    {@const rb = isSelected && isResizable(c, DIR.Bottom)}
    {@const sx = isSelected && c.w > 1}
    {@const sy = isSelected && c.h > 1}
    <div
      class="relative flex justify-center items-center"
      style="grid-column: span {c.w} / span {c.w}; grid-row: span {c.h} / span {c.h};"
    >
      <Button
        class={[
          "absolute size-8 z-10 -left-10",
          rl ? "inline-flex" : "hidden",
          sx && "top-[calc(50%-2.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.x -= 1;
          c.w += 1;
        }}
      >
        <ChevronLeft />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -left-10",
          sx ? "inline-flex" : "hidden",
          rl && "top-[calc(50%+0.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.x += 1;
          c.w -= 1;
        }}
      >
        <ChevronRight />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -right-10",
          rr ? "inline-flex" : "hidden",
          sx && "top-[calc(50%-2.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.w += 1;
        }}
      >
        <ChevronRight />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -right-10",
          sx ? "inline-flex" : "hidden",
          rr && "top-[calc(50%+0.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.w -= 1;
        }}
      >
        <ChevronLeft />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -top-10",
          rt ? "inline-flex" : "hidden",
          sy && "left-[calc(50%-2.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.y -= 1;
          c.h += 1;
        }}
      >
        <ChevronUp />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -top-10",
          sy ? "inline-flex" : "hidden",
          rt && "left-[calc(50%+0.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.y += 1;
          c.h -= 1;
        }}
      >
        <ChevronDown />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -bottom-10",
          rb ? "inline-flex" : "hidden",
          sy && "left-[calc(50%-2.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.h += 1;
        }}
      >
        <ChevronDown />
      </Button>
      <Button
        class={[
          "absolute size-8 z-10 -bottom-10",
          sy ? "inline-flex" : "hidden",
          rb && "left-[calc(50%+0.2rem)]",
        ]}
        variant="secondary"
        size="icon"
        onclick={(e) => {
          e.stopPropagation();
          c.h -= 1;
        }}
      >
        <ChevronUp />
      </Button>
      <SingleDropZone
        placeholder="Empty cell"
        bind:node={
          () => c.node,
          (v) => {
            if (v !== undefined) {
              node.cells.push({ ...c, node: v });
            } else {
              deallocateId(element.id);
              node.cells.splice(indexes.get(c.node?.id!)!, 1);
            }
          }
        }
      />
    </div>
  {/each}
</div>
