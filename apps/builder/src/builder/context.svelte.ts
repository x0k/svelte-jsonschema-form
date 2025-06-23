import { getContext, onDestroy, setContext } from "svelte";
import { DragDropManager, Droppable } from "@dnd-kit/dom";

const BUILDER_CONTEXT = Symbol("builder-context");

interface BuilderContext {
  readonly dnd: DragDropManager;
  readonly targetId: UniqueId | undefined;
}

export function setBuilderContext(ctx: BuilderContext) {
  setContext(BUILDER_CONTEXT, ctx);
}

export function getBuilderContext(): BuilderContext {
  return getContext(BUILDER_CONTEXT);
}

type UniqueId = string | number;

export function createBuilderContext(): BuilderContext {
  const dnd = new DragDropManager();
  let targetId = $state<UniqueId>();
  dnd.monitor.addEventListener("dragover", (event) => {
    targetId = event.operation.target?.id;
  });
  dnd.monitor.addEventListener("dragend", () => {
    targetId = undefined;
  });
  return {
    dnd,
    get targetId() {
      return targetId;
    },
  };
}

export function getDndManager(ctx: BuilderContext): DragDropManager {
  return ctx.dnd;
}

export function createDroppable(ctx: BuilderContext) {
  const id = crypto.randomUUID();
  const droppable = new Droppable({ id }, ctx.dnd);
  onDestroy(() => droppable.destroy());
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
