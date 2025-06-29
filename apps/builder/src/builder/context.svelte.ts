import { flushSync, getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";

import type { EnumItem, Node } from "$lib/builder/index.js";

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

export interface NodeDndData {
  node: Node;
}

export interface NodeDroppableOptions {
  onDrop: (node: Node) => void;
}

export interface NodeDraggableOptions {
  node: Node;
  beforeDrop?: () => void;
}

export interface EnumDndData {
  item: EnumItem;
}

export interface EnumDroppableOptions {
  onDrop: (item: EnumItem) => void;
}

export interface EnumDraggableOptions {
  item: EnumItem;
  beforeDrop?: () => void;
}

export interface NodeRef {
  current: () => Node | undefined;
  update: (n: Node) => void;
}

const noopNodeRef: NodeRef = {
  current() {
    return undefined;
  },
  update() {},
};

export class BuilderContext {
  #nodeDnd = new DragDropManager<NodeDndData>();
  #enumDnd = new DragDropManager<EnumDndData>();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #beforeDropHandlers = new Map<UniqueId, () => void>();
  #nodeDropHandlers = new Map<UniqueId, (node: Node) => void>();
  #enumDropHandlers = new Map<UniqueId, (enumItem: EnumItem) => void>();

  rootNode = $state<Node>();

  #selectedNodeRef = $state.raw(noopNodeRef);
  readonly selectedNode = $derived.by(() => {
    try {
      return this.#selectedNodeRef.current();
    } catch {
      return undefined;
    }
  });

  get isDragged() {
    return this.#sourceId !== undefined;
  }

  selectNode(nodeRef: NodeRef) {
    this.#selectedNodeRef = nodeRef;
  }

  updateSelectedNode(node: Node) {
    this.#selectedNodeRef.update(node);
  }

  clearSelection() {
    this.#selectedNodeRef = noopNodeRef;
  }

  constructor() {
    onDestroy(() => {
      this.#nodeDnd.destroy();
      this.#enumDnd.destroy();
    });
    this.#nodeDnd.monitor.addEventListener("beforedragstart", (event) => {
      this.#sourceId = event.operation.source?.id;
    });
    this.#nodeDnd.monitor.addEventListener("dragover", (event) => {
      this.#targetId = event.operation.target?.id;
    });
    this.#nodeDnd.monitor.addEventListener(
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
        const handler = this.#nodeDropHandlers.get(tId);
        flushSync(() => {
          handler?.(data.node);
        });
      }
    );
    this.#enumDnd.monitor.addEventListener("beforedragstart", (event) => [
      (this.#sourceId = event.operation.source?.id),
    ]);
    this.#enumDnd.monitor.addEventListener("dragover", (event) => {
      this.#targetId = event.operation.target?.id;
    });
    this.#enumDnd.monitor.addEventListener(
      "dragend",
      ({ operation: { source, target } }) => {
        this.#sourceId = undefined;
        this.#targetId = undefined;
        const tId = target?.id;
        if (tId === undefined || source === null) {
          return;
        }
        const { id: sId, data } = source;
        this.#beforeDropHandlers.get(sId)?.();
        const handler = this.#enumDropHandlers.get(tId);
        flushSync(() => {
          handler?.(data.item);
        });
      }
    );
  }

  createNodeDroppable(nodeCtx: NodeContext, options: NodeDroppableOptions) {
    const id = crypto.randomUUID();
    const droppable = new Droppable<NodeDndData>({ id }, this.#nodeDnd);
    this.#nodeDropHandlers.set(id, options.onDrop);
    $effect(() => {
      droppable.disabled = nodeCtx.isDragged;
    });
    return this.createDroppable(id, droppable, this.#nodeDropHandlers);
  }

  createDraggableNode(options: NodeDraggableOptions) {
    const id = crypto.randomUUID();
    const draggable = new Draggable<NodeDndData>(
      {
        data: {
          get node() {
            return options.node;
          },
        },
        feedback: "clone",
        id,
      },
      this.#nodeDnd
    );
    if (options.beforeDrop) {
      this.#beforeDropHandlers.set(id, options.beforeDrop);
    }
    return this.createDraggable(id, draggable);
  }

  createEnumItemDroppable(options: EnumDroppableOptions) {
    const id = crypto.randomUUID();
    const droppable = new Droppable<EnumDndData>({ id }, this.#enumDnd);
    this.#enumDropHandlers.set(id, options.onDrop);
    return this.createDroppable(id, droppable, this.#enumDropHandlers);
  }

  createDraggableEnumItem(options: EnumDraggableOptions) {
    const id = crypto.randomUUID();
    const draggable = new Draggable<EnumDndData>(
      {
        data: {
          get item() {
            return options.item;
          },
        },
        feedback: "clone",
        id,
      },
      this.#enumDnd
    );
    if (options.beforeDrop) {
      this.#beforeDropHandlers.set(id, options.beforeDrop);
    }
    return this.createDraggable(id, draggable);
  }

  private createDroppable(
    id: UniqueId,
    droppable: Droppable,
    handlers: Map<UniqueId, any>
  ) {
    onDestroy(() => {
      handlers.delete(id);
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

  private createDraggable(id: UniqueId, draggable: Draggable) {
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

export type BuilderDraggable = ReturnType<BuilderContext["createDraggable"]>;
export type BuilderDroppable = ReturnType<BuilderContext["createDroppable"]>;
