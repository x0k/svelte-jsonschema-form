import { getContext, setContext } from 'svelte';

const NODE_CONTEXT = Symbol("node-context");

export interface NodeContext {
  isDragged: boolean;
}

export function setNodeContext(ctx: NodeContext) {
    setContext(NODE_CONTEXT, ctx);
}

export function getNodeContext(): NodeContext {
  return getContext(NODE_CONTEXT);
}