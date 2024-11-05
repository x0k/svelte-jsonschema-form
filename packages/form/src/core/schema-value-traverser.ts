import { isObject } from '@/lib/object.js';

import type { SchemaValue } from "./schema.js";
import type { Visitor } from "./traverser.js";
import type { Path } from './path.js';

export type SchemaValueTraverserContextType = "root" | "array" | "record";

export interface AbstractSchemaValueTraverserContext<
  T extends SchemaValueTraverserContextType,
> {
  type: T;
  path: Path
}

export interface RootSchemaValueTraverserContext
  extends AbstractSchemaValueTraverserContext<"root"> {}
export interface ArraySchemaValueTraverserContext
  extends AbstractSchemaValueTraverserContext<"array"> {
  index: number;
}
export interface RecordSchemaValueTraverserContext
  extends AbstractSchemaValueTraverserContext<"record"> {
  key: string;
}

export type SchemaValueTraverserContext =
  | RootSchemaValueTraverserContext
  | ArraySchemaValueTraverserContext
  | RecordSchemaValueTraverserContext;

export type SchemaValueVisitor = Visitor<
  SchemaValue,
  SchemaValueTraverserContext
>;

export function traverseSchemaValue(
  value: SchemaValue,
  visitor: SchemaValueVisitor,
  ctx: SchemaValueTraverserContext = { type: "root", path: [] }
) {
  visitor.onEnter?.(value, ctx);
  if (Array.isArray(value)) {
    const c: ArraySchemaValueTraverserContext = {
      type: "array",
      index: 0,
      path: ctx.path.concat(0)
    };
    for (let index = 0; index < value.length; index++) {
      c.index = index;
      c.path[c.path.length - 1] = index;
      traverseSchemaValue(value[index]!, visitor, c);
    }
  } else if (isObject(value)) {
    const c: RecordSchemaValueTraverserContext = {
      type: "record",
      key: "",
      path: ctx.path.concat("")
    }
    for (const key of Object.keys(value)) {
      c.key = key;
      c.path[c.path.length - 1] = key;
      traverseSchemaValue(value[key]!, visitor, c);
    }
  }
  visitor.onLeave?.(value, ctx);
}
