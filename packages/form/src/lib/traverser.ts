export interface Visitor<Node, Context, R> {
  onEnter?: (node: Node, ctx: Context) => Generator<R>;
  onLeave?: (node: Node, ctx: Context) => Generator<R>;
}
