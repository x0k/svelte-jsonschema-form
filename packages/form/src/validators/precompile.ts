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
import { allowAdditionalProperties } from "@/omit-extra-data.js";

export interface SchemaMeta {
  id: string;
  combinationBranch: boolean;
}

export type SubSchemas = Trie<Path[number], SchemaMeta>;

/** @deprecated */
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

export type IdAugmentationType = "combination" | "open";

type IdAugmentations = Record<IdAugmentationType, (id: string) => string>;

export interface FragmentSchemaOptions {
  schema: Schema;
  subSchemas: SubSchemas;
  /** @deprecated use `idAugmentations` property instead */
  augmentSuffix?: string;
  /** New IDs should be valid ECMAScript identifiers (if possible) */
  idAugmentations?: Partial<IdAugmentations>;
  /** @default false */
  omitExtraDataSupport?: boolean;
}

const DEFAULT_ID_AUGMENTATIONS: IdAugmentations = {
  combination: (id) => id + DEFAULT_AUGMENT_SUFFIX,
  open: (id) => `${id}_open`,
};

export function fragmentSchema({
  schema,
  subSchemas,
  augmentSuffix = DEFAULT_AUGMENT_SUFFIX,
  idAugmentations,
  omitExtraDataSupport = false,
}: FragmentSchemaOptions): Schema[] {
  const augmentations: IdAugmentations = {
    ...DEFAULT_ID_AUGMENTATIONS,
    combination: (id) => id + augmentSuffix,
    ...idAugmentations,
  };
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
            // first slot of `allOf` is identical to copy and can be replaced with ref
            if (!copy.required?.length) {
              allOf[0] = refSchema;
            } else if (typeof allOf[0] !== "boolean") {
              // avoid usage of same $id
              delete allOf[0].$id;
            }
            schemas.push(augmentedSchema);
          }
          if (omitExtraDataSupport && copy.additionalProperties === false) {
            const augmentedSchema = allowAdditionalProperties(copy);
            augmentedSchema.$id = augmentations.open(meta.id);
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

export interface ValidatorRetrieverOption<F> {
  registry: ValidatorsRegistry<F>;
  idAugmentations?: Partial<IdAugmentations>;
}

export function createValidatorRetriever<F>({
  registry,
  idAugmentations,
}: ValidatorRetrieverOption<F>) {
  const augmentations: IdAugmentations = {
    ...DEFAULT_ID_AUGMENTATIONS,
    ...idAugmentations,
  };
  return ({ $id: id, allOf, additionalProperties }: Schema) => {
    if (id === undefined) {
      const firstAllOfItem = allOf?.[0];
      if (
        typeof firstAllOfItem === "object" &&
        firstAllOfItem.$id !== undefined
      ) {
        id = augmentations.combination(firstAllOfItem.$id);
      } else {
        throw new Error("Schema id not found");
      }
    } else if (additionalProperties === true) {
      const validator = registry.get(augmentations.open(id));
      if (validator !== undefined) {
        return validator;
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
  options?: Partial<Omit<ValidatorRetrieverOption<F>, "registry">>
) {
  return createValidatorRetriever({
    registry: {
      get: (id) => validators[id],
    },
    ...options,
  });
}
