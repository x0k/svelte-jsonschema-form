import { getContext, onDestroy, setContext } from "svelte";
import { SvelteMap } from "svelte/reactivity";
import {
  DragDropManager,
  Draggable,
  Droppable,
  type DroppableInput,
} from "@dnd-kit/dom";

import { type Node, type NodeId } from "$lib/builder/index.js";

const BUILDER_CONTEXT = Symbol("builder-context");

type UniqueId = string | number;

interface DndData {
  node: Node;
}

export function setBuilderContext(ctx: BuilderContext) {
  setContext(BUILDER_CONTEXT, ctx);
}

export function getBuilderContext(): BuilderContext {
  return getContext(BUILDER_CONTEXT);
}

export class BuilderContext {
  #dnd = new DragDropManager();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #dropHandlers = new Map<UniqueId, (node: Node) => void>();

  #nodes = new SvelteMap<NodeId, Node>();
  #rootNodeId = $state.raw<NodeId>();
  #selectedNodeId = $state.raw<NodeId>();

  constructor() {
    onDestroy(() => this.#dnd.destroy());
    this.#dnd.monitor.addEventListener("dragstart", (event) => {
      this.#sourceId = event.operation.source?.id;
    });
    this.#dnd.monitor.addEventListener("dragover", (event) => {
      this.#targetId = event.operation.target?.id;
    });
    this.#dnd.monitor.addEventListener(
      "dragend",
      ({ operation: { target, source } }) => {
        this.#sourceId = undefined;
        this.#targetId = undefined;
        const tId = target?.id;
        if (tId === undefined || source === null) {
          return;
        }
        this.#dropHandlers.get(tId)?.(source.data.node);
      }
    );
  }

  get selectedNode() {
    return this.#selectedNodeId && this.#nodes.get(this.#selectedNodeId);
  }

  set selectedNode(v) {
    this.#selectedNodeId = v?.id;
  }

  createDroppable(options: DroppableOptions) {
    const id = crypto.randomUUID();
    const droppable = new Droppable<DndData>(
      { ...options.options, id },
      this.#dnd
    );
    this.#dropHandlers.set(id, options.onDrop);
    onDestroy(() => {
      this.#dropHandlers.delete(id);
      droppable.destroy();
    });
    const self = this;
    return {
      get isOver() {
        return self.#targetId === id;
      },
      attach(element: HTMLElement) {
        droppable.element = element;
        return () => {
          droppable.element = undefined;
        };
      },
    };
  }

  createDraggable(options: DraggableOptions) {
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
      this.#dnd
    );
    onDestroy(() => draggable.destroy());
    const self = this;
    return {
      get isDragged() {
        return self.#sourceId === id;
      },
      attach(element: HTMLElement) {
        draggable.element = element;
        return () => {
          draggable.element = undefined;
        };
      },
    };
  }
}

export interface DroppableOptions {
  onDrop: (node: Node) => void;
  options?: Partial<DroppableInput<DndData>>;
}

export interface DraggableOptions {
  node: Node;
}

export function createDraggable(
  ctx: BuilderContext,
  options: DraggableOptions
) {}
