import type { GridCell, NodeId } from "$lib/builder/index.js";

export type CheckRect = [x: number, x1: number, y: number, y1: number];

export const Rect = {
  Left: (c) => [c.x - 1, c.x, c.y, c.y + c.h],
  Top: (c) => [c.x, c.x + c.w, c.y - 1, c.y],
  Right: (c) => [c.x + c.w, c.x + c.w + 1, c.y, c.y + c.h],
  Bottom: (c) => [c.x, c.x + c.w, c.y + c.h, c.y + c.h + 1],
} as const satisfies Record<
  string,
  (cell: Omit<GridCell, "node">) => CheckRect
>;

export interface ToShrinkOrMove {
  toShrink: Set<NodeId>;
  toMove: Set<NodeId>;
}
export function createShrinkOrMove(): ToShrinkOrMove {
  return {
    toMove: new Set(),
    toShrink: new Set(),
  };
}

export function isFailed(data: ToShrinkOrMove) {
  return data.toMove.size === 0 && data.toShrink.size === 0;
}

export function mergeShrinkOrMove(
  a: ToShrinkOrMove,
  b: ToShrinkOrMove
): ToShrinkOrMove {
  return {
    toShrink: a.toShrink.union(b.toShrink),
    toMove: a.toMove.union(b.toMove),
  };
}
