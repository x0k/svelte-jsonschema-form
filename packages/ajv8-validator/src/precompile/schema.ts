import {
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type FieldsValidationMode,
  type Schema,
} from "@sjsf/form";
import {
  isPrimitiveSchemaType,
  makeSchemaDefinitionTraverser,
  pickSchemaType,
  SCHEMA_KEYS,
  transformSchemaDefinition,
  type SchemaDefinition,
  type SchemaKey,
  type SchemaTraverserContext,
} from "@sjsf/form/core";

export interface InsertSubSchemaIdsOptions {
  fieldsValidationMode?: FieldsValidationMode;
  /**
   * Created id should be valid ESM export name
   */
  createId?: (schema: Schema, ctx: SchemaTraverserContext<SchemaKey>) => string;
}

function createIdFactory() {
  let id = 0;
  return () => `sjsf__${id++}`;
}

const INPUTS_VALIDATION = ON_INPUT | ON_CHANGE | ON_BLUR;
const ARRAY_VALIDATION = ON_ARRAY_CHANGE;
const OBJECT_VALIDATION = ON_OBJECT_CHANGE;
const FIELDS_VALIDATION =
  INPUTS_VALIDATION | ARRAY_VALIDATION | OBJECT_VALIDATION;

function isValidatableNode(
  validationMode: FieldsValidationMode,
  ctx: SchemaTraverserContext<SchemaKey>,
  node: Schema
): boolean {
  if (
    ctx.type === "root" ||
    (ctx.type === "sub" && ctx.key === "if") ||
    (ctx.type === "array" && (ctx.key === "anyOf" || ctx.key === "oneOf"))
  ) {
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

function toPath(ctx: SchemaTraverserContext<SchemaKey>) {
  return `#/${ctx.path.join("/")}`;
}

// TODO: Support ref for ref
export function insertSubSchemaIds(
  schema: Schema,
  {
    createId = createIdFactory(),
    fieldsValidationMode = 0,
  }: InsertSubSchemaIdsOptions = {}
): { schema: Schema; ids: Map<string, string> } {
  const ids = new Map<string, string>();
  Array.from(
    makeSchemaDefinitionTraverser(SCHEMA_KEYS, {
      *onEnter(node, ctx) {
        if (
          typeof node === "boolean" ||
          !isValidatableNode(fieldsValidationMode, ctx, node)
        ) {
          return;
        }
        ids.set(
          node.$ref !== undefined ? node.$ref : toPath(ctx),
          createId(node, ctx)
        );
      },
    })(schema)
  );
  return {
    ids,
    schema: transformSchemaDefinition(schema, (copy: SchemaDefinition, ctx) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const id = ids.get(toPath(ctx));
      if (id !== undefined) {
        copy.$id = id;
      }
      return copy;
    }) as Schema,
  };
}

export function fragmentSchema(
  schema: Schema,
  ids: Map<string, string>,
): Schema[] {
  const schemas: Schema[] = [];
  const rootId = schema.$id!;
  schemas.push(
    transformSchemaDefinition(schema, (copy: SchemaDefinition, ctx) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      const id = ids.get(toPath(ctx));
      if (id !== undefined && id !== rootId) {
        schemas.push(copy);
        return {
          $ref: `${id}#`,
        };
      }
      if (copy.$ref !== undefined) {
        copy.$ref = `${rootId}${copy.$ref}`;
      }
      return copy;
    }) as Schema
  );
  return schemas;
}
