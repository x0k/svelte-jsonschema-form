<script lang="ts">
  import { array } from "@sjsf/form/lib/array";

  import type { GridCell, NodeId, NodeType } from "$lib/builder/builder.js";

  import type { NodeProps } from "../model.js";
  import SingleDropZone from "../single-drop-zone.svelte";

  let { node = $bindable() }: NodeProps<NodeType.Grid> = $props();

  const { cells, grid, indexes } = $derived.by(() => {
    const cells = new Map<NodeId, GridCell>();
    const indexes = new Map<NodeId, number>();
    const grid: Array<Array<NodeId | null>> = array(node.height, () =>
      new Array(node.width).fill(null)
    );
    for (let k = 0; k < node.cells.length; k++) {
      const cell = node.cells[k];
      const n = cell.node;
      cells.set(n.id, cell);
      indexes.set(n.id, k)
      for (let i = cell.y; i < cell.y + cell.h; i++) {
        const row = grid[i];
        for (let j = cell.x; j < cell.x + cell.w; j++) {
          row[j] = n.id;
        }
      }
    }
    return { grid, cells, indexes };
  });

  function* elements() {
    const seen = new Set<NodeId>();
    for (let i = 0; i < node.height; i++) {
      const row = grid[i];
      for (let j = 0; j < node.width; j++) {
        const v = row[j];
        if (v === null) {
          yield {
            id: `${i}-${j}`,
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
          yield { id: v, cell: cells.get(v)! };
        }
      }
    }
  }
</script>

<div
  class="grid gap-2"
  style="grid-template-columns: repeat({node.width}, 1fr); grid-template-rows: repeat({node.height}, 1fr);"
>
  {#each elements() as element (element.id)}
    <SingleDropZone
      placeholder="Drop zone"
      bind:node={
        () => element.cell.node,
        (v) => {
          if (v !== undefined) {
            node.cells.push({ ...element.cell, node: v });
          } else {
            node.cells.splice(indexes.get(element.id as NodeId)!, 1);
          }
        }
      }
    />
  {/each}
</div>
