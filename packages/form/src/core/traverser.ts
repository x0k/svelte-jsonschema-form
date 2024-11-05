export interface Visitor<Node, Context> {
  onEnter?: (node: Node, ctx: Context) => void;
  onLeave?: (node: Node, ctx: Context) => void;
}
