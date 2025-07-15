<script lang="ts">
  import { array } from "@sjsf/form/lib/array";
  import ChevronLeft from "@lucide/svelte/icons/chevron-left";
  import ChevronRight from "@lucide/svelte/icons/chevron-right";
  import ChevronUp from "@lucide/svelte/icons/chevron-up";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";

  import type { GridCell, NodeId, NodeType } from "$lib/builder/index.js";
  import { Button } from "$lib/components/ui/button/index.js";
  import Updown from "$lib/components/updown.svelte";

  import type { NodeProps } from "../model.js";
  import SingleDropZone from "../single-dropzone.svelte";
  import { getBuilderContext } from "../context.svelte.js";
  import NodeHeader from "../customizable-node-header.svelte";
  import NodeContainer from "../node-container.svelte";
  import NodeIssues from "../node-issues.svelte";
  import {
    createShrinkOrMove,
    isFailed,
    mergeShrinkOrMove,
    Rect,
    type CheckRect,
    type ToShrinkOrMove,
  } from "./grid.js";

  let {
    node = $bindable(),
    draggable,
    unmount,
    showRequired,
  }: NodeProps<NodeType.Grid> = $props();

  const id = (x: number, y: number) => `${x}-${y}`;

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
    for (let i = 0; i < node.height; i++) {
      const row = grid[i];
      for (let j = 0; j < node.width; j++) {
        const v = row[j];
        if (v === null) {
          yield {
            id: emptyCellId(id(j, i)),
            index: -1,
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
          yield {
            id: allocateId(v, id(j, i)),
            index: indexes.get(v)!,
            cell: cells.get(v)!,
          };
        }
      }
    }
  }

  function isAvailable([x, x1, y, y1]: CheckRect): boolean {
    if (x < 0 || x1 > node.width || y < 0 || y1 > node.height) {
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

  function tryXShrinkOrMove(nodeId: NodeId): ToShrinkOrMove {
    let result = createShrinkOrMove();
    const cell = cells.get(nodeId)!;
    if (cell.w > 1) {
      result.toShrink.add(nodeId);
      return result;
    }
    // is movable
    if (cell.x <= 0) {
      return result;
    }
    let lastNodeId: NodeId | undefined;
    const x = cell.x - 1;
    for (let i = cell.y; i < cell.y + cell.h; i++) {
      const c = grid[i][x];
      if (c === null || lastNodeId === c) {
        continue;
      }
      lastNodeId = c;
      const r = tryXShrinkOrMove(c);
      if (isFailed(r)) {
        return r;
      }
      result = mergeShrinkOrMove(result, r);
    }
    result.toMove.add(nodeId);
    return result;
  }

  function xShrink() {
    let total = createShrinkOrMove();
    const toRemove = new Set<NodeId>();
    let lastNodeId: NodeId | undefined;
    const x = node.width - 1;
    for (let i = 0; i < node.height; i++) {
      const nodeId = grid[i][x];
      if (nodeId === null || lastNodeId === nodeId) {
        continue;
      }
      lastNodeId = nodeId;
      const result = tryXShrinkOrMove(nodeId);
      if (isFailed(result)) {
        toRemove.add(nodeId);
      } else {
        total = mergeShrinkOrMove(total, result);
      }
    }
    for (const id of total.toShrink) {
      cells.get(id)!.w--;
    }
    for (const id of total.toMove) {
      cells.get(id)!.x--;
    }
    if (toRemove.size > 0) {
      node.cells = node.cells.filter((c) => !toRemove.has(c.node.id));
    }
    node.width--;
  }

  function tryYShrinkOrMove(nodeId: NodeId): ToShrinkOrMove {
    let result = createShrinkOrMove();
    const cell = cells.get(nodeId)!;
    if (cell.h > 1) {
      result.toShrink.add(nodeId);
      return result;
    }
    // is movable
    if (cell.y <= 0) {
      return result;
    }
    let lastNodeId: NodeId | undefined;
    const row = grid[cell.y - 1];
    for (let i = cell.x; i < cell.x + cell.w; i++) {
      const c = row[i];
      if (c === null || lastNodeId === c) {
        continue;
      }
      lastNodeId = c;
      const r = tryYShrinkOrMove(c);
      if (isFailed(r)) {
        return r;
      }
      result = mergeShrinkOrMove(result, r);
    }
    result.toMove.add(nodeId);
    return result;
  }

  function yShrink() {
    let total = createShrinkOrMove();
    const toRemove = new Set<NodeId>();
    let lastNodeId: NodeId | undefined;
    const row = grid[node.height - 1];
    for (let i = 0; i < node.width; i++) {
      const nodeId = row[i];
      if (nodeId === null || lastNodeId === nodeId) {
        continue;
      }
      lastNodeId = nodeId;
      const result = tryYShrinkOrMove(nodeId);
      if (isFailed(result)) {
        toRemove.add(nodeId);
      } else {
        total = mergeShrinkOrMove(total, result);
      }
    }
    for (const id of total.toShrink) {
      cells.get(id)!.h--;
    }
    for (const id of total.toMove) {
      cells.get(id)!.y--;
    }
    if (toRemove.size > 0) {
      node.cells = node.cells.filter((c) => !toRemove.has(c.node.id));
    }
    node.height--;
  }

  const ctx = getBuilderContext();
</script>

<NodeContainer
  bind:node
  {draggable}
  {showRequired}
  class="flex flex-col gap-0.5"
>
  <NodeHeader {node} {draggable} {unmount} {showRequired}>
    {#snippet append()}
      <div class="flex items-center gap-2 pr-2">
        <span class="text-muted-foreground">Cols</span>
        <Updown
          minimum={1}
          value={node.width}
          onUp={() => {
            node.width++;
          }}
          onDown={xShrink}
        />
      </div>
      <div class="flex items-center gap-2 pr-2">
        <span class="text-muted-foreground">Rows</span>
        <Updown
          minimum={1}
          value={node.height}
          onUp={() => {
            node.height++;
          }}
          onDown={yShrink}
        />
      </div>
    {/snippet}
  </NodeHeader>
  <div
    class="grid gap-2"
    style="grid-template-columns: repeat({node.width}, auto); grid-template-rows: repeat({node.height}, auto);"
  >
    {#each elements() as element (element.id)}
      {@const c = element.cell}
      {@const isReady =
        c.node !== undefined &&
        !ctx.isDragged &&
        ctx.selectedNode?.id === c.node.id}
      {@const rl = isReady && isAvailable(Rect.Left(c))}
      {@const rr = isReady && isAvailable(Rect.Right(c))}
      {@const rt = isReady && isAvailable(Rect.Top(c))}
      {@const rb = isReady && isAvailable(Rect.Bottom(c))}
      {@const sx = isReady && c.w > 1}
      {@const sy = isReady && c.h > 1}
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
          showRequired
          bind:node={
            () => node.cells[element.index]?.node,
            (v) => {
              if (v !== undefined) {
                node.cells.push({ ...c, node: v });
              } else {
                deallocateId(element.id);
                node.cells.splice(element.index, 1);
              }
            }
          }
        >
          {#snippet placeholder()}
            Empty cell
          {/snippet}
        </SingleDropZone>
      </div>
    {/each}
  </div>
  <NodeIssues class="pt-3" {node} />
</NodeContainer>
