import { flushSync, getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";
import { mergeSchemas } from "@sjsf/form/core";
import type { UiSchema } from "@sjsf/form";

import {
  createNode,
  createObjectProperty,
  NodeType,
  type Node,
  type ObjectNode,
  type CustomizableNode,
  createObjectPropertyDependency,
  createPredicate,
  createOperatorNode,
  OperatorType,
  type MultiEnumNode,
  createEnumItemNode,
  NODE_OPTIONS_SCHEMAS,
  NODE_OPTIONS_UI_SCHEMAS,
  CUSTOMIZABLE_TYPES,
  detectApplicableOperators,
} from "$lib/builder/index.js";
import { mergeUiSchemas, Theme } from "$lib/sjsf/theme.js";

import type { NodeContext } from "./node-context.js";
import {
  THEME_MISSING_FIELDS,
  THEME_SCHEMAS,
  THEME_UI_SCHEMAS,
} from "./theme-schemas.js";

const BUILDER_CONTEXT = Symbol("builder-context");

export function setBuilderContext(ctx: BuilderContext) {
  setContext(BUILDER_CONTEXT, ctx);
}

export function getBuilderContext(): BuilderContext {
  return getContext(BUILDER_CONTEXT);
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

export interface ReadonlyNodeRef {
  current: Node | undefined;
}

const noopNodeRef: NodeRef = {
  current() {
    return undefined;
  },
  update() {},
};
const noopReadonlyNodeRef: ReadonlyNodeRef = {
  current: undefined,
};

const obj = createNode(NodeType.Object) as ObjectNode;
const menum = createNode(NodeType.MultiEnum) as MultiEnumNode;
menum.items.push(createEnumItemNode("foo", "foo"));
menum.items.push(createEnumItemNode("bar", "bar"));
const prop = createObjectProperty(menum);
const dep = createObjectPropertyDependency();
const pred = createPredicate();
const op = createOperatorNode(OperatorType.In);
pred.operator = op;
dep.predicate = pred;
prop.dependencies.push(dep);
prop.complementary = undefined;
obj.properties.push(prop);

export class BuilderContext {
  #dnd = new DragDropManager<DndData>();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

  #onDragStartHandlers = new Map<UniqueId, () => void>();
  #beforeDropHandlers = new Map<UniqueId, () => void>();
  #dropHandlers = new Map<UniqueId, (node: Node) => void>();
  #draggedNode = $state.raw<Node>();

  rootNode = $state<CustomizableNode>(obj);

  #selectedNodeRef = $state.raw(noopNodeRef);
  readonly selectedNode = $derived.by(() => {
    try {
      return this.#selectedNodeRef.current();
    } catch {
      return undefined;
    }
  });
  #showRequired = $state.raw(true);

  #affectedNodeRef = $state.raw(noopReadonlyNodeRef);
  readonly affectedNode = $derived.by(() => {
    try {
      return this.#affectedNodeRef.current;
    } catch {
      return undefined;
    }
  });

  theme = $state(Theme.Shadcn4);

  readonly availableCustomizableNodeTypes = $derived.by(() => {
    const missing = THEME_MISSING_FIELDS[this.theme];
    return missing.size === 0
      ? CUSTOMIZABLE_TYPES
      : CUSTOMIZABLE_TYPES.filter((t) => !missing.has(t));
  });

  get isDragged() {
    return this.#sourceId !== undefined;
  }

  selectNode(nodeRef: NodeRef, showRequired: boolean) {
    this.#selectedNodeRef = nodeRef;
    this.#showRequired = showRequired;
  }

  updateSelectedNode(node: CustomizableNode) {
    this.#selectedNodeRef.update(node);
  }

  selectAffectedNode(nodeRef: ReadonlyNodeRef) {
    this.#affectedNodeRef = nodeRef;
  }

  clearSelection() {
    this.#selectedNodeRef = noopNodeRef;
    this.#affectedNodeRef = noopReadonlyNodeRef;
  }

  constructor() {
    onDestroy(() => {
      this.#dnd.destroy();
    });
    this.#dnd.monitor.addEventListener(
      "beforedragstart",
      ({ operation: { source } }) => {
        if (source === null) {
          return;
        }
        const { id, data } = source;
        this.#sourceId = id;
        if (id !== undefined) {
          this.#onDragStartHandlers.get(id)?.();
          this.#draggedNode = data.node;
        }
      }
    );
    this.#dnd.monitor.addEventListener("dragover", (event) => {
      this.#targetId = event.operation.target?.id;
    });
    this.#dnd.monitor.addEventListener(
      "dragend",
      ({ operation: { target, source } }) => {
        this.#sourceId = undefined;
        this.#targetId = undefined;
        this.#draggedNode = undefined;
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
      get isReady() {
        return (
          self.#draggedNode === undefined || options.accept(self.#draggedNode)
        );
      },
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

  nodeSchema(node: CustomizableNode) {
    const original = NODE_OPTIONS_SCHEMAS[node.type];
    const augmentation = THEME_SCHEMAS[this.theme][node.type];
    return augmentation ? mergeSchemas(original, augmentation) : original;
  }

  nodeUiSchema(node: CustomizableNode) {
    const next = mergeUiSchemas(NODE_OPTIONS_UI_SCHEMAS[node.type], {
      required: {
        "ui:options": {
          layouts: {
            "object-property": {
              hidden: !this.#showRequired,
            },
          },
        },
      },
    });
    const augmentation = THEME_UI_SCHEMAS[this.theme][node.type];
    return augmentation ? mergeUiSchemas(next, augmentation as UiSchema) : next;
  }
}

export type BuilderDraggable = ReturnType<BuilderContext["createDraggable"]>;
export type BuilderDroppable = ReturnType<BuilderContext["createDroppable"]>;
