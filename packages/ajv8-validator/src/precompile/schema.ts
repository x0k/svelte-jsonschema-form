import { getValueByKeys, insertValue } from "@sjsf/form/lib/trie";
import {
  makeSchemaDefinitionTraverser,
  refToPath,
  SCHEMA_KEYS,
  transformSchemaDefinition,
  type SchemaDefinition,
  type SchemaKey,
  type SchemaTraverserContext,
} from "@sjsf/form/core";
import type { FieldsValidationMode, Schema } from "@sjsf/form/index.js";

import {
  createIdFactory,
  DEFAULT_AUGMENT_SUFFIX,
  isCombinationBranch,
  isValidatableNode,
  type SubSchemas,
} from "./model.js";

export interface InsertSubSchemaIdsOptions {
  fieldsValidationMode?: FieldsValidationMode;
  /**
   * Created id should be valid ESM export name
   */
  createId?: (schema: Schema, ctx: SchemaTraverserContext<SchemaKey>) => string;
}

// TODO: Support ref for ref
export function insertSubSchemaIds(
  schema: Schema,
  {
    createId = createIdFactory(),
    fieldsValidationMode = 0,
  }: InsertSubSchemaIdsOptions = {}
) {
  let subSchemas: SubSchemas;
  Array.from(
    makeSchemaDefinitionTraverser(SCHEMA_KEYS, {
      *onEnter(node, ctx) {
        const combinationBranch = isCombinationBranch(ctx);
        if (
          typeof node === "boolean" ||
          !(
            combinationBranch ||
            isValidatableNode(fieldsValidationMode, ctx, node)
          )
        ) {
          return;
        }
        const path =
          node.$ref !== undefined ? refToPath(node.$ref) : ctx.path.slice();
        const prev = getValueByKeys(subSchemas, path);
        if (
          prev === undefined ||
          (!prev.combinationBranch && combinationBranch)
        ) {
          subSchemas = insertValue(subSchemas, path, {
            id: prev?.id ?? createId(node, ctx),
            combinationBranch,
          });
        }
      },
    })(schema)
  );
  return {
    subSchemas,
    schema: transformSchemaDefinition(schema, (copy: SchemaDefinition, ctx) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const meta = getValueByKeys(subSchemas, ctx.path);
      if (meta !== undefined) {
        copy.$id = meta.id;
      }
      return copy;
    }) as Schema,
  };
}

export interface FragmentSchemaOptions {
  schema: Schema;
  subSchemas: SubSchemas;
  augmentSuffix?: string;
}

function omitRequired({ required, ...rest }: Schema): Schema {
  return rest;
}

export function fragmentSchema({
  schema,
  subSchemas,
  augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
}: FragmentSchemaOptions): Schema[] {
  const schemas: Schema[] = [];
  const rootId = schema.$id!;
  schemas.push(
    transformSchemaDefinition(schema, (copy: SchemaDefinition, ctx) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const meta = getValueByKeys(subSchemas, ctx.path);
      if (meta !== undefined && meta.id !== rootId) {
        schemas.push(copy);
        const refSchema = {
          $ref: `${meta.id}#`,
        };
        if (meta.combinationBranch && copy.properties !== undefined) {
          const len = copy.required?.length ?? 0;
          schemas.push({
            $id: meta.id + augmentSuffix,
            allOf: [
              len > 0 ? omitRequired(copy) : refSchema,
              {
                anyOf: Object.keys(copy.properties).map((key) => ({
                  required: [key],
                })),
              },
            ],
          });
        }
        return refSchema;
      }
      if (copy.$ref !== undefined) {
        copy.$ref = `${rootId}${copy.$ref}`;
      }
      return copy;
    }) as Schema
  );
  return schemas;
}
