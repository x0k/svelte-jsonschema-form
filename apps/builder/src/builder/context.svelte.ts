import { getContext, onDestroy, setContext } from "svelte";
import {
  DragDropManager,
  Draggable,
  Droppable,
  type DroppableInput,
} from "@dnd-kit/dom";

import type { Node } from "$lib/builder/index.js";

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

export interface DroppableOptions {
  onDrop: (node: Node) => void;
  options?: Partial<DroppableInput<DndData>>;
}

export interface DraggableOptions {
  node: Node;
}

const noNode = () => undefined;

export class BuilderContext {
  #dnd = new DragDropManager();

  #sourceId = $state.raw<UniqueId>();
  #targetId = $state.raw<UniqueId>();

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
