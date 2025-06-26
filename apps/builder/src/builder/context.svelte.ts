import { flushSync, getContext, onDestroy, setContext } from "svelte";
import {
  DragDropManager,
  Draggable,
  Droppable,
  type FeedbackType,
} from "@dnd-kit/dom";

import type { Node } from "$lib/builder/index.js";

const BUILDER_CONTEXT = Symbol("builder-context");

const NODE_CONTEXT = Symbol("node-context");

export function setBuilderContext(ctx: BuilderContext) {
  setContext(BUILDER_CONTEXT, ctx);
}

export function getBuilderContext(): BuilderContext {
  return getContext(BUILDER_CONTEXT);
}

export interface NodeContext {
  isDragged: boolean;
}

export function setNodeContext(ctx: NodeContext) {
  setContext(NODE_CONTEXT, ctx);
}

export function getNodeContext(): NodeContext {
  return getContext(NODE_CONTEXT);
}

type UniqueId = string | number;

interface DndData {
  node: Node;
}

export interface DroppableOptions {
  onDrop: (node: Node) => void;
}

export interface DraggableOptions {
  node: Node;
  feedback: FeedbackType;
  beforeDrop?: () => void;
}

const noNode = () => undefined;

export class BuilderContext {
  #dnd = new DragDropManager();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #beforeDropHandlers = new Map<UniqueId, () => void>();
  #dropHandlers = new Map<UniqueId, (node: Node) => void>();

  rootNode = $state<Node>();

  #selectedNodeAccessor = $state.raw<() => Node | undefined>(noNode);
  readonly selectedNode = $derived.by(() => {
    try {
      return this.#selectedNodeAccessor();
    } catch {
      return undefined;
    }
  });

  selectNode(v: () => Node | undefined) {
    this.#selectedNodeAccessor = this.#selectedNodeAccessor === v ? noNode : v;
  }

  constructor() {
    onDestroy(() => this.#dnd.destroy());
    this.#dnd.monitor.addEventListener("beforedragstart", (event) => {
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
        const { id: sId, data } = source;
        this.#beforeDropHandlers.get(sId)?.();
        flushSync(() => {
          this.#dropHandlers.get(tId)?.(data.node);
        });
      }
    );
  }

  createDroppable(nodeCtx: NodeContext, options: DroppableOptions) {
    const id = crypto.randomUUID();
    const droppable = new Droppable<DndData>({ id }, this.#dnd);
    this.#dropHandlers.set(id, options.onDrop);
    $effect(() => {
      droppable.disabled = nodeCtx.isDragged;
    });
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
        data: {
          get node() {
            return options.node;
          },
        },
        feedback: options.feedback,
        id,
      },
      this.#dnd
    );
    if (options.beforeDrop) {
      this.#beforeDropHandlers.set(id, options.beforeDrop);
    }
    onDestroy(() => {
      this.#beforeDropHandlers.delete(id);
      draggable.destroy();
    });
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
      attachHandle(element: HTMLElement) {
        draggable.handle = element;
        return () => {
          draggable.handle = undefined;
        };
      },
    };
  }
}
