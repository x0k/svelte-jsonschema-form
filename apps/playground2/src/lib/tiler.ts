import { TilerContext, type Tile, type Tiles } from "svelte-tiler";
import type { Constraint } from "svelte-tiler/shared/constraints";
import { ClonedGhost, DndContext } from "svelte-tiler/shared/dnd.svelte";
import type { Direction } from "svelte-tiler/shared/spatial";
import * as Leaf from "svelte-tiler/tiles/leaf.svelte";
import * as Split from "svelte-tiler/tiles/split.svelte";
import * as Tabs from "svelte-tiler/tiles/tabs.svelte";

export function createTilerContext() {
  return new TilerContext({
    dnd: new DndContext({
      plugins: [new ClonedGhost()],
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
      })
    );
  };
}

export type LayoutState = { layout: Tile; version: number };

export interface LayoutStorOptions {
  key: string;
  defaultLayout: () => Tile;
  migrations: Array<(layout: Tile) => Tile>;
}

export function createLayoutStore({
  key,
  defaultLayout,
  migrations,
}: LayoutStorOptions) {
  const VERSION = migrations.length;

  function migrate({ layout, version }: LayoutState) {
    while (VERSION > version) {
      layout = migrations[version++]!(layout);
    }
    return layout;
  }

  return {
    load() {
      const saved = localStorage.getItem(key);
      const data: LayoutState | Tile = saved
        ? JSON.parse(saved)
        : defaultLayout;
      return migrate("version" in data ? data : { layout: data, version: 0 });
    },
    save(layout: Tile) {
      localStorage.setItem(
        key,
        JSON.stringify({
          layout,
          version: VERSION,
        })
      );
    },
  };
}

export function transformLayout(transform: (shallowCopy: Tile) => Tile) {
  return function apply(tile: Tile): Tile {
    const children = tile.children.map(apply);
    return transform({ ...tile, children });
  };
}
