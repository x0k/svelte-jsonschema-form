import { flushSync, getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";

import {
  createNode,
  createObjectProperty,
  isCustomizableNodeType,
  NodeType,
  type AbstractNode,
  type Node,
  type ObjectNode,
  type ObjectPropertyNode,
  type CustomizableNode,
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

export interface DroppableOptions<N extends Node> {
  accept: (node: Node) => node is N;
  onDrop: (node: N) => void;
}

export interface DraggableOptions {
  node: Node;
  unmount: () => void;
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

const obj = createNode(NodeType.Object) as ObjectNode;
obj.properties.push(createObjectProperty(createNode(NodeType.String)));

export class BuilderContext {
  #dnd = new DragDropManager<DndData>();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #onDragStartHandlers = new Map<UniqueId, () => void>();
  #beforeDropHandlers = new Map<UniqueId, () => void>();
  #dropHandlers = new Map<UniqueId, (node: Node) => void>();

  rootNode = $state<CustomizableNode>(obj);

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

  updateSelectedNode(node: CustomizableNode) {
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

  createDroppable<N extends Node>(
    nodeCtx: NodeContext,
    options: DroppableOptions<N>
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
    let nodeSnapshot: Node;
    const draggable = new Draggable<DndData>(
      {
        data: {
          get node() {
            return nodeSnapshot;
          },
        },
        feedback: "clone",
        id,
      },
      this.#dnd
    );
    this.#onDragStartHandlers.set(id, () => {
      nodeSnapshot = $state.snapshot(options.node);
    });
    this.#beforeDropHandlers.set(id, options.unmount);
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

export const anyNode = (node: Node): node is Node => true;

export const isCustomizableNode = (node: Node): node is CustomizableNode =>
  isCustomizableNodeType(node.type);

const onlyNode =
  <T extends NodeType>(type: T) =>
  (node: Node): node is Extract<Node, AbstractNode<T>> =>
    node.type === type;

export const isPredicateNode = onlyNode(NodeType.Predicate);

export const isOperatorNode = onlyNode(NodeType.Operator);

export const isObjectPropertyNode = onlyNode(NodeType.ObjectProperty);

export const isObjectPropertyDependencyNode = onlyNode(
  NodeType.ObjectPropertyDependency
);

export const isCustomizableOrPropertyNode = (
  node: Node
): node is CustomizableNode | ObjectPropertyNode =>
  isCustomizableNode(node) || isObjectPropertyNode(node);

export const isEnumItemNode = onlyNode(NodeType.EnumItem);
