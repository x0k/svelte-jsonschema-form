import {
  createAugmentSchema,
  createConditionSchema,
  isPrimitiveSchemaType,
  isSchemaDeepEqual,
  isSchemaWithProperties,
  pathFromRef,
  pickSchemaType,
  type Path,
  type SchemaDefinition,
  type SchemaType,
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
import {
  makeSchemaDefinitionTraverser,
  ALL_SUB_SCHEMA_KEYS,
  type AnySubSchemaKey,
  type SchemaTraverserContext,
  transformSchemaDefinition,
  isSchemaObject,
} from "@/lib/json-schema/index.js";
import { getValueByKeys, insertValue, type Trie } from "@/lib/trie.js";
import { allowAdditionalProperties } from "@/omit-extra-data.js";

export interface SchemaMeta {
  id: string;
  combinationBranch: boolean;
}

export type SubSchemas = Trie<Path[number], SchemaMeta>;

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
  let type: SchemaType[] | SchemaType | undefined = node.type;
  if (type === undefined) {
    return Boolean(validationMode & OBJECT_VALIDATION);
  }
  if (Array.isArray(type)) {
    type = pickSchemaType(type);
  }
  if (isPrimitiveSchemaType(type) || type === "unknown") {
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

export type IdFactory = (
  schema: Schema,
  ctx: SchemaTraverserContext<AnySubSchemaKey>
) => string;

export interface InsertSubSchemaIdsOptions {
  /** @default 0 */
  fieldsValidationMode?: FieldsValidationMode;
  /**
   * Created id should be valid ESM export name
   */
  createId?: IdFactory;
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
          node.$ref !== undefined ? pathFromRef(node.$ref) : ctx.path.slice();
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

export type IdAugmentationType = "combination" | "condition";

export type IdAugmentations = Record<
  IdAugmentationType,
  (id: string) => string
>;

export interface FragmentSchemaOptions {
  schema: Schema;
  subSchemas: SubSchemas;
  idAugmentations?: Partial<IdAugmentations>;
}

export const DEFAULT_ID_AUGMENTATIONS: IdAugmentations = {
  combination: (id) => id + "ag",
  condition: (id) => id + "cond",
};

export function fragmentSchema({
  schema,
  subSchemas,
  idAugmentations,
}: FragmentSchemaOptions): Schema[] {
  const augmentations: IdAugmentations = {
    ...DEFAULT_ID_AUGMENTATIONS,
    ...idAugmentations,
  };
  const schemas: Schema[] = [];
  const rootId = schema.$id!;
  schemas.push(
    transformSchemaDefinition(schema, (copy: SchemaDefinition, ctx) => {
      if (typeof copy === "boolean") {
        return copy;
      }
      // Capture condition schemas when visiting oneOf options inside dependencies
      // Must happen before the meta check since the oneOf option IS a combination branch
      // Path pattern: [..., "dependencies", <depKey>, "oneOf", <index>]
      if (
        ctx.type === "array" &&
        ctx.key === "oneOf" &&
        ctx.path.length >= 4 &&
        ctx.path[ctx.path.length - 4] === "dependencies"
      ) {
        const depKey = ctx.path[ctx.path.length - 3];
        if (typeof depKey === "string") {
          const option = ctx.parent.oneOf?.[ctx.index];
          if (isSchemaObject(option) && isSchemaWithProperties(option)) {
            const propSchema = option.properties[depKey];
            if (isSchemaObject(propSchema) && propSchema.$id !== undefined) {
              const conditionSchema = createConditionSchema(depKey, propSchema);
              conditionSchema.$id = augmentations.condition(propSchema.$id);
              schemas.push(conditionSchema);
            }
          }
        }
      }
      const meta = getValueByKeys(subSchemas, ctx.path);
      if (meta !== undefined && meta.id !== rootId) {
        schemas.push(copy);
        const refSchema: Schema = {
          $ref: `${meta.id}#`,
        };
        if (meta.combinationBranch) {
          if (isSchemaWithProperties(copy)) {
            const augmentedSchema: Schema = createAugmentSchema(copy);
            augmentedSchema.$id = augmentations.combination(meta.id);
            const { allOf } = augmentedSchema;
            if (allOf?.[0] === undefined) {
              throw new Error(
                "Schema augmentation algorithm was changed, but not synchronized with this function, please report this error"
              );
            }
            if (typeof allOf[0] !== "boolean") {
              if (copy.additionalProperties === false) {
                allOf[0] = allowAdditionalProperties(allOf[0]);
              } else if (isSchemaDeepEqual(allOf[0], copy)) {
                // first slot of `allOf` is identical to copy and can be replaced with ref
                allOf[0] = refSchema;
              }
              // avoid usage of same $id
              delete allOf[0].$id;
            }
            schemas.push(augmentedSchema);
          }
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

export interface ValidatorsRegistry<F> {
  get(id: string): F | undefined;
}

export interface ValidatorRetrieverOptions<F> {
  registry: ValidatorsRegistry<F>;
  idAugmentations?: Partial<IdAugmentations>;
}

export function createValidatorRetriever<F>({
  registry,
  idAugmentations,
}: ValidatorRetrieverOptions<F>) {
  const augmentations: IdAugmentations = {
    ...DEFAULT_ID_AUGMENTATIONS,
    ...idAugmentations,
  };
  return (schema: Schema) => {
    let { $id: id } = schema;
    if (id === undefined) {
      // combination pattern: allOf[0].$id
      const firstAllOfItem = schema.allOf?.[0];
      if (
        typeof firstAllOfItem === "object" &&
        firstAllOfItem.$id !== undefined
      ) {
        id = augmentations.combination(firstAllOfItem.$id);
      }
      // condition pattern: single property with $id
      else if (schema.type === "object" && schema.properties !== undefined) {
        const keys = Object.keys(schema.properties);
        if (keys.length === 1) {
          const propSchema = schema.properties[keys[0]!];
          if (isSchemaObject(propSchema) && propSchema.$id !== undefined) {
            id = augmentations.condition(propSchema.$id);
          }
        }
      }
      if (id === undefined) {
        throw new Error("Schema id not found");
      }
    }
    const validator = registry.get(id);
    if (validator === undefined) {
      throw new Error(`Validator with id "${id}" not found`);
    }
    return validator;
  };
}

// createValidatorResolver ?
// validatorRetrieverFromRecord ?
export function fromValidators<F>(
  validators: Record<string, F>,
  options?: Partial<Omit<ValidatorRetrieverOptions<F>, "registry">>
) {
  return createValidatorRetriever({
    registry: {
      get: (id) => validators[id],
    },
    ...options,
  });
}

export interface ConditionSchemaEntry {
  dependencyKey: string;
  propertyId: string;
}

/**
 * Yields entries for each property within `dependencies` that uses a `oneOf`
 * condition schema. Each entry maps a dependency key to the `$id` of the
 * property schema inside the matching `oneOf` branch.
 */
export function* conditionSchemaEntries({
  dependencies,
}: Schema): Generator<ConditionSchemaEntry> {
  if (
    dependencies === undefined ||
    Array.isArray(dependencies) ||
    typeof dependencies !== "object"
  ) {
    return;
  }
  for (const [depKey, depValue] of Object.entries(dependencies)) {
    if (
      Array.isArray(depValue) ||
      typeof depValue !== "object" ||
      !Array.isArray(depValue.oneOf)
    ) {
      continue;
    }
    for (const option of depValue.oneOf) {
      if (typeof option !== "object" || option.properties === undefined) {
        continue;
      }
      const propDef = option.properties[depKey];
      if (typeof propDef !== "object" || propDef.$id === undefined) {
        continue;
      }
      yield { dependencyKey: depKey, propertyId: propDef.$id };
    }
  }
}
