import { flushSync, getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";

import {
  createNode,
  isSelectableNodeType,
  NodeType,
  type AbstractNode,
  type Node,
  type ObjectNode,
  type SelectableNode,
} from "$lib/builder/index.js";

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

export interface DndData {
  node: Node;
}

export interface DroppableOptions<T extends NodeType> {
  accept: (node: Node) => node is Extract<Node, AbstractNode<T>>;
  onDrop: (node: Extract<Node, AbstractNode<T>>) => void;
}

export interface DraggableOptions {
  node: Node;
  beforeDrop?: () => void;
  onDragStart?: () => void;
}

export interface NodeRef {
  current: () => SelectableNode | undefined;
  update: (n: SelectableNode) => void;
}

const noopNodeRef: NodeRef = {
  current() {
    return undefined;
  },
  update() {},
};

const obj = createNode(NodeType.Object) as ObjectNode;
obj.properties.push(createNode(NodeType.String));

export class BuilderContext {
  #dnd = new DragDropManager<DndData>();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #onDragStartHandlers = new Map<UniqueId, () => void>();
  #beforeDropHandlers = new Map<UniqueId, () => void>();
  #dropHandlers = new Map<UniqueId, (node: Node) => void>();

  rootNode = $state<SelectableNode>(obj);

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

  updateSelectedNode(node: SelectableNode) {
    this.#selectedNodeRef.update(node);
  }

  clearSelection() {
    this.#selectedNodeRef = noopNodeRef;
  }

  constructor() {
    onDestroy(() => {
      this.#dnd.destroy();
    });
    this.#dnd.monitor.addEventListener("beforedragstart", (event) => {
      const sId = event.operation.source?.id;
      this.#sourceId = sId;
      if (sId !== undefined) {
        this.#onDragStartHandlers.get(sId)?.();
      }
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
        const handler = this.#dropHandlers.get(tId);
        flushSync(() => {
          handler?.(data.node);
        });
      }
    );
  }

  createDroppable<T extends NodeType>(
    nodeCtx: NodeContext,
    options: DroppableOptions<T>
  ) {
    const id = crypto.randomUUID();
    const droppable = new Droppable<DndData>(
      {
        id,
        accept(source) {
          return options.accept(source.data.node);
        },
      },
      this.#dnd
    );
    $effect(() => {
      droppable.disabled = nodeCtx.isDragged;
    });
    this.#dropHandlers.set(id, (node: Node) => {
      if (options.accept(node)) {
        options.onDrop(node);
      }
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
        feedback: "clone",
        id,
      },
      this.#dnd
    );
    if (options.onDragStart) {
      this.#onDragStartHandlers.set(id, options.onDragStart);
    }
    if (options.beforeDrop) {
      this.#beforeDropHandlers.set(id, options.beforeDrop);
    }
    onDestroy(() => {
      this.#onDragStartHandlers.delete(id);
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

export const selectableNode = (node: Node): node is SelectableNode =>
  isSelectableNodeType(node.type);
const onlyNode =
  <T extends NodeType>(type: T) =>
  (node: Node): node is Extract<Node, AbstractNode<T>> =>
    node.type === type;

export const onlyEnumItemNode = onlyNode(NodeType.EnumItem);
