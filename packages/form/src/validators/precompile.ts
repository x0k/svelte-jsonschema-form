import { getValueByKeys, insertValue, type Trie } from "@/lib/trie.js";
import {
  makeSchemaDefinitionTraverser,
  ALL_SUB_SCHEMA_KEYS,
  type AnySubSchemaKey,
  type SchemaTraverserContext,
  transformSchemaDefinition,
} from "@/lib/json-schema/index.js";
import {
  createAugmentSchema,
  isPrimitiveSchemaType,
  isSchemaWithProperties,
  pickSchemaType,
  refToPath,
  type Path,
  type SchemaDefinition,
} from "@/core/index.js";
import {
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type FieldsValidationMode,
  type Schema,
} from "@/form/main.js";

export interface SchemaMeta {
  id: string;
  combinationBranch: boolean;
}

export type SubSchemas = Trie<Path[number], SchemaMeta>;

export const DEFAULT_AUGMENT_SUFFIX = "ag";

export function createIdFactory() {
  let id = 0;
  return () => `v${id++}`;
}

const INPUTS_VALIDATION = ON_INPUT | ON_CHANGE | ON_BLUR;
const ARRAY_VALIDATION = ON_ARRAY_CHANGE;
const OBJECT_VALIDATION = ON_OBJECT_CHANGE;
const FIELDS_VALIDATION =
  INPUTS_VALIDATION | ARRAY_VALIDATION | OBJECT_VALIDATION;

export function isCombinationBranch(
  ctx: SchemaTraverserContext<AnySubSchemaKey>
) {
  return ctx.type === "array" && (ctx.key === "anyOf" || ctx.key === "oneOf");
}

export function isValidatableNode(
  validationMode: FieldsValidationMode,
  ctx: SchemaTraverserContext<AnySubSchemaKey>,
  node: Schema
): boolean {
  if (ctx.type === "root" || (ctx.type === "sub" && ctx.key === "if")) {
    return true;
  }
  if (node.$ref !== undefined || !(validationMode & FIELDS_VALIDATION)) {
    return false;
  }
  let { type } = node;
  if (type === undefined) {
    return Boolean(validationMode & OBJECT_VALIDATION);
  }
  if (Array.isArray(type)) {
    type = pickSchemaType(type);
  }
  if (isPrimitiveSchemaType(type)) {
    return Boolean(validationMode & INPUTS_VALIDATION);
  }
  if (type === "object") {
    return (
      Boolean(validationMode & OBJECT_VALIDATION) &&
      typeof node.additionalProperties === "object"
    );
  }
  return (
    Boolean(validationMode & ARRAY_VALIDATION) &&
    (Array.isArray(node.items)
      ? typeof node.additionalItems === "object"
      : true)
  );
}

export interface InsertSubSchemaIdsOptions {
  fieldsValidationMode?: FieldsValidationMode;
  /**
   * Created id should be valid ESM export name
   */
  createId?: (
    schema: Schema,
    ctx: SchemaTraverserContext<AnySubSchemaKey>
  ) => string;
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
    makeSchemaDefinitionTraverser(ALL_SUB_SCHEMA_KEYS, {
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
        const refSchema: Schema = {
          $ref: `${meta.id}#`,
        };
        if (meta.combinationBranch && isSchemaWithProperties(copy)) {
          const augmentedSchema: Schema = createAugmentSchema(copy);
          augmentedSchema.$id = meta.id + augmentSuffix;
          if (!copy.required?.length) {
            if (augmentedSchema.allOf?.[0] === undefined) {
              throw new Error(
                "Schema augmentation algorithm was changed, but not synchronized with this function, please report this error"
              );
            }
            augmentedSchema.allOf[0] = refSchema;
          }
          schemas.push(augmentedSchema);
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
