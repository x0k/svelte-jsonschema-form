import { ClonedGhost, DndContext } from "svelte-tiler/shared/dnd.svelte";
import type { Constraint } from "svelte-tiler/shared/constraints";
import { TilerContext, type Tile, type Tiles } from "svelte-tiler";

import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
import * as Split from "svelte-tiler/tiles/split.svelte";
import * as Tabs from "svelte-tiler/tiles/tabs.svelte";
import type { Direction } from "svelte-tiler/shared/spatial";

export function createTilerContext() {
  return new TilerContext({
    dnd: new DndContext({
      feedback: (e, el) => new ClonedGhost(el, e).attach(document.body),
    }),
    definitions: { leaf: Leaf, split: Split, tabs: Tabs },
  });
}

export const gapPx = 8;
export const constraints: Constraint[] = [
  { type: "minSize", unit: "px", value: 70 },
];

interface SplitOptions {
  type: Direction;
  parent: Tile | undefined;
  pivot: Tiles["tabs"];
  offset: number;
  adjacent: Tiles["tabs"];
}

export function createApplySplit(ctx: TilerContext) {
  return ({ parent, type, pivot, adjacent, offset }: SplitOptions) => {
    if (parent?.type === "split" && parent.direction === type) {
      const index =
        parent.children.findIndex((c) => c.id === pivot.id) + offset;
      ctx.insertIntoTile(parent.id, "split", index, {
        children: [adjacent],
        constraints: [constraints],
      });
      return;
    }
    const tiles = new Array<Split.SplitTileOptions>(2);
    tiles[1 - offset] = { tile: pivot, constraints };
    tiles[offset] = { tile: adjacent, constraints };
    ctx.replace(
      pivot,
      Split.create({
        direction: type,
        children: tiles,
        gapPx,
      }),
    );
  };
}
