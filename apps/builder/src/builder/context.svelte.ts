import { getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";

import { type Node } from "$lib/builder/index.js";

const BUILDER_CONTEXT = Symbol("builder-context");

type UniqueId = string | number;

interface DndData {
  node: Node;
}

interface BuilderContext {
  readonly dnd: DragDropManager<DndData>;
  readonly sourceId: UniqueId | undefined;
  readonly targetId: UniqueId | undefined;
  readonly dropHandlers: Map<UniqueId, (node: Node) => void>;
  rootNode: Node | undefined;
}

export function setBuilderContext(ctx: BuilderContext) {
  setContext(BUILDER_CONTEXT, ctx);
}

export function getBuilderContext(): BuilderContext {
  return getContext(BUILDER_CONTEXT);
}

interface BuilderContextOptions {}

export function createBuilderContext(
  options: BuilderContextOptions
): BuilderContext {
  const dnd = new DragDropManager<DndData>();
  onDestroy(() => dnd.destroy());
  let sourceId = $state<UniqueId>();
  let targetId = $state<UniqueId>();
  const dropHandlers = new Map<UniqueId, (node: Node) => void>();
  dnd.monitor.addEventListener("dragstart", (event) => {
    sourceId = event.operation.source?.id;
  });
  dnd.monitor.addEventListener("dragover", (event) => {
    targetId = event.operation.target?.id;
  });
  dnd.monitor.addEventListener(
    "dragend",
    ({ operation: { target, source } }) => {
      sourceId = undefined;
      targetId = undefined;
      const tId = target?.id;
      if (tId === undefined || source === null) {
        return;
      }
      dropHandlers.get(tId)?.(source.data.node);
    }
  );
  let rootNode = $state<Node>();
  return {
    dnd,
    dropHandlers: dropHandlers,
    get sourceId() {
      return sourceId;
    },
    get targetId() {
      return targetId;
    },
    get rootNode() {
      return rootNode;
    },
    set rootNode(v) {
      rootNode = v;
    },
  };
}

export interface DroppableOptions {
  onDrop: (node: Node) => void;
}

export function createDroppable(
  ctx: BuilderContext,
  options: DroppableOptions
) {
  const id = crypto.randomUUID();
  const droppable = new Droppable<DndData>({ id }, ctx.dnd);
  ctx.dropHandlers.set(id, options.onDrop);
  onDestroy(() => {
    ctx.dropHandlers.delete(id);
    droppable.destroy();
  });
  return {
    get isOver() {
      return ctx.targetId === id;
    },
    attach(element: HTMLElement) {
      droppable.element = element;
      return () => {
        droppable.element = undefined;
      };
    },
  };
}

export interface DraggableOptions {
  node: Node;
}

export function createDraggable(
  ctx: BuilderContext,
  options: DraggableOptions
) {
  const id = crypto.randomUUID();
  const draggable = new Draggable<DndData>(
    {
      id,
      feedback: "clone",
      data: {
        get node() {
          return options.node;
        },
      },
    },
    ctx.dnd
  );
  onDestroy(() => draggable.destroy());
  return {
    get isDragged() {
      return ctx.sourceId === id;
    },
    attach(element: HTMLElement) {
      draggable.element = element;
      return () => {
        draggable.element = undefined;
      };
    },
  };
}
