import { flushSync, getContext, onDestroy, setContext } from "svelte";
import { mergeSchemas } from "@sjsf/form/core";
import type {
  FormValue,
  Schema,
  UiSchema,
  FoundationalComponentType,
} from "@sjsf/form";
import { DragDropManager, Draggable, Droppable } from "@dnd-kit/dom";

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
  type NodeId,
  type OperatorNode,
  summarizeOperator,
  OK_STATUS,
  ERROR_STATUS,
  WARNING_STATUS,
  validateNode,
  type ValidatorRegistries,
  buildSchema,
  type SchemaBuilderRegistries,
  buildUiSchema,
} from "$lib/builder/index.js";
import { mergeUiSchemas, Theme } from "$lib/sjsf/theme.js";
import { validator } from "$lib/form/defaults.js";
import { Resolver } from "$lib/sjsf/resolver.js";
import { Icons } from "$lib/sjsf/icons.js";

import {
  type Route,
  DEFAULT_COMPONENTS,
  DEFAULT_WIDGETS,
  RouteName,
} from "./model.js";
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

export interface NodeIssue {
  nodeId: NodeId;
  message: string;
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

  rootNode = $state<CustomizableNode | undefined>(obj);

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

  theme = $state.raw(Theme.Shadcn4);
  resolver = $state.raw(Resolver.Basic);
  icons = $state.raw(Icons.None);

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

  ignoreWarnings = $state(false);

  private _errorsCount = $state(0);
  get errorsCount() {
    return this._errorsCount;
  }
  private _errors = $state.raw<Partial<Record<NodeId, NodeIssue[]>>>({});
  get errors() {
    return this._errors;
  }

  private _warningsCount = $state(0);
  get warningsCount() {
    return this._warningsCount;
  }
  private _warnings = $state.raw<Partial<Record<NodeId, NodeIssue[]>>>({});
  get warnings() {
    return this._warnings;
  }

  private setIssues(key: "errors" | "warnings", issues: NodeIssue[]) {
    this[`_${key}Count`] = issues.length;
    this[`_${key}`] = Object.groupBy(issues, (i) => i.nodeId);
  }

  route = $state.raw<Route>({ name: RouteName.Editor });

  #buildOutput = $state.raw<
    | {
        schema: Schema;
        propertyNames: Map<NodeId, string>;
      }
    | undefined
  >(undefined);

  readonly schema = $derived(this.#buildOutput?.schema ?? {});
  readonly uiSchema = $derived.by(
    () =>
      this.rootNode &&
      this.#buildOutput &&
      buildUiSchema(
        {
          propertyNames: this.#buildOutput.propertyNames,
          uiComponents: (node) => {
            const components = Object.assign(
              {} satisfies UiSchema["ui:components"],
              DEFAULT_COMPONENTS[this.resolver][node.type](node as never)
            );
            const defaultWidget = DEFAULT_WIDGETS[
              node.type
            ] as FoundationalComponentType;
            if (node.options.widget !== defaultWidget) {
              //@ts-expect-error
              components[defaultWidget] = node.options.widget;
            }
            return components;
          },
        },
        this.rootNode
      )
  );

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

  summarizeOperator(operator: OperatorNode, node: Node | undefined) {
    return summarizeOperator(
      {
        operatorStatus: (operator) =>
          (this._errors[operator.id] === undefined ? OK_STATUS : ERROR_STATUS) |
          (this._warnings[operator.id] === undefined
            ? OK_STATUS
            : WARNING_STATUS),
      },
      operator,
      node
    );
  }

  validate() {
    if (this.rootNode === undefined) {
      return false;
    }
    const registries: {
      [K in keyof ValidatorRegistries]: Array<ValidatorRegistries[K]>;
    } = {
      complementary: [],
      affectedNode: [],
      enumValueType: [],
    };
    const errors: NodeIssue[] = [];
    const warnings: NodeIssue[] = [];
    const self = this;
    validateNode(
      {
        validateCustomizableNodeOptions(node) {
          const schema = self.nodeSchema(node);
          const optionsErrors = validator.validateFormValue(
            schema,
            node.options as FormValue
          );
          if (optionsErrors.length > 0) {
            errors.push({ nodeId: node.id, message: "Invalid filed options" });
          }
        },
        addError(node, message) {
          //@ts-expect-error
          errors.push({ nodeId: node.id, message, node });
        },
        addWarning(node, message) {
          warnings.push({ nodeId: node.id, message });
        },
        push(registry, value) {
          registries[registry].push(value);
          return {
            [Symbol.dispose]: () => {
              registries[registry].pop();
            },
          };
        },
        peek(registry) {
          return registries[registry].at(-1);
        },
      },
      this.rootNode
    );
    this.setIssues("errors", errors);
    this.setIssues("warnings", warnings);
    return (
      errors.length === 0 && (this.ignoreWarnings || warnings.length === 0)
    );
  }

  build() {
    if (this.rootNode === undefined) {
      throw new Error("Root node is undefined");
    }
    const registries: {
      [K in keyof SchemaBuilderRegistries]: Array<SchemaBuilderRegistries[K]>;
    } = {
      scope: [],
      affectedNode: [],
    };
    const propertyNames = new Map<NodeId, string>();
    const schema = buildSchema(
      {
        propertyNames,
        push(registry, value) {
          registries[registry].push(value);
          return {
            [Symbol.dispose]() {
              registries[registry].pop();
            },
          };
        },
        peek(registry) {
          return registries[registry].at(-1);
        },
      },
      this.rootNode
    );
    this.#buildOutput = {
      propertyNames,
      schema,
    };
  }
}

export type BuilderDraggable = ReturnType<BuilderContext["createDraggable"]>;
export type BuilderDroppable = ReturnType<BuilderContext["createDroppable"]>;
