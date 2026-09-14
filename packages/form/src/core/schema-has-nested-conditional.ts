// This check was ported from https://github.com/rjsf-team/react-jsonschema-form/blob/main/packages/utils/src/schemaHasNestedConditional.ts
// Licensed under the Apache License, Version 2.0.

import {
  ALL_SUB_SCHEMA_KEYS,
  isSchemaObject,
  makeSchemaDefinitionTraverser,
} from "@/lib/json-schema/index.js";

import { DEPENDENCIES_KEY, IF_KEY, type SchemaDefinition } from "./schema.js";

/** Checks whether the given `schema` contains a `dependencies` or `if` keyword anywhere below its
 * top level, e.g. inside a nested object's `properties`, a `$ref` target under `definitions`/`$defs`,
 * an array's tuple `items`, or a `patternProperties` entry. `retrieveSchema()` only resolves the
 * `dependencies`/`if` declared directly on the schema it is given, so a root-level retrieved schema never
 * reflects a conditional branch switch that happens deeper in the tree. The form uses this to detect when
 * a comparison of root-level retrieved schemas can't be trusted to decide whether sanitization is needed.
 *
 * Implementation note: instead of resolving `$ref`s explicitly (like upstream does), this walks the whole
 * schema with `makeSchemaDefinitionTraverser`. A local ref target always lives inside the root schema tree
 * (under `definitions`/`$defs` or another traversed location), so it is visited at its storage location
 * without any ref following, cycle guards, or unresolvable-ref handling. The trade-off is conservativeness:
 * a conditional in an unreferenced definition (or inside `not`/`contains`/an `if` expression, which
 * `retrieveSchema()` never resolves) also counts as nested. That only causes an extra best-effort
 * sanitization pass, never a missed one.
 *
 * @param schema - The schema to search; its own top-level `dependencies`/`if` don't count as nested
 * @returns - True if a `dependencies` or `if` keyword exists below the top level of the schema
 */
export function schemaHasNestedConditional(schema: SchemaDefinition): boolean {
  const traverse = makeSchemaDefinitionTraverser(ALL_SUB_SCHEMA_KEYS, {
    *onEnter(node, ctx) {
      if (
        ctx.type !== "root" &&
        isSchemaObject(node) &&
        (DEPENDENCIES_KEY in node || IF_KEY in node)
      ) {
        yield true;
      }
    },
  });
  return !traverse(schema).next().done;
}
