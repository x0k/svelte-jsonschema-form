import { getContext, setContext } from "svelte";

import { createKeyedArray } from "@/lib/keyed-array.svelte.js";
import {
  isSchemaNullable,
  isSchemaObjectValue,
  type Schema,
  type SchemaArrayValue,
  type SchemaValue,
  type Validator,
} from "@/core/index.js";
import {
  AFTER_SUBMITTED,
  createChildId,
  getDefaultFieldState,
  getErrors,
  getUiOptions,
  ON_ARRAY_CHANGE,
  retrieveSchema,
  retrieveUiSchema,
  validateField,
  type Config,
  type FieldError,
  type FormInternalContext,
  type PossibleError,
} from "@/form/index.js";

import {
  getArrayItemName,
  getFixedArrayItemTitle,
  getNormalArrayItemTitle,
} from "./get-array-item-name.js";

export interface ArrayContext<V extends Validator> {
  readonly config: Config;
  readonly addable: boolean;
  readonly removable: boolean;
  readonly orderable: boolean;
  readonly copyable: boolean;
  readonly errors: FieldError<PossibleError<V>>[];
  canAdd(): boolean;
  canCopy(index: number): boolean;
  canRemove(index: number): boolean;
  canMoveUp(index: number): boolean;
  canMoveDown(index: number): boolean;
  key(index: number): number;
  itemConfig(
    config: Config,
    item: SchemaValue | undefined,
    index: number
  ): Config;
  pushItem(): void;
  moveItemUp(index: number): void;
  moveItemDown(index: number): void;
  copyItem(index: number): void;
  removeItem(index: number): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<V extends Validator>(): ArrayContext<V> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<V extends Validator>(ctx: ArrayContext<V>) {
  setContext(ARRAY_CONTEXT, ctx);
}

function createItemsAPI<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: () => Config,
  value: () => SchemaArrayValue | undefined,
  itemSchema: () => Schema | undefined
) {
  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), value());
  }

  const keyedArray = createKeyedArray(() => value() ?? []);

  const errors = $derived(getErrors(ctx, config().id));

  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(config().uiOptions ?? {});

  return {
    get config() {
      return config();
    },
    get addable() {
      return addable;
    },
    get orderable() {
      return orderable;
    },
    get removable() {
      return removable;
    },
    get copyable() {
      return copyable;
    },
    get errors() {
      return errors;
    },
    key(index) {
      return keyedArray.key(index);
    },
    pushItem() {
      const schema = itemSchema();
      if (schema === undefined) {
        return;
      }
      keyedArray.push(getDefaultFieldState(ctx, schema, undefined));
      validate();
    },
    moveItemUp(index) {
      keyedArray.swap(index, index - 1);
      validate();
    },
    moveItemDown(index) {
      keyedArray.swap(index, index + 1);
      validate();
    },
    copyItem(index) {
      keyedArray.insert(index, $state.snapshot(value()![index]));
      validate();
    },
    removeItem(index) {
      keyedArray.remove(index);
      validate();
    },
  } satisfies Partial<ArrayContext<V>>;
}

function createCanAdd(
  config: () => Config,
  value: () => SchemaArrayValue | undefined,
  addable: () => boolean
) {
  let val, maxItems;
  return () =>
    addable() &&
    ((val = value()), Array.isArray(val)) &&
    ((maxItems = config().schema.maxItems),
    maxItems === undefined || val.length < maxItems);
}

export function createArrayContext<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: () => Config,
  value: () => SchemaArrayValue | undefined,
  // NOTE: It looks like the `undefined` value is always replaced by an array
  // when calculating default values, so this is unnecessary
  _: (v: SchemaArrayValue) => void
): ArrayContext<V> {
  const itemSchema: Schema = $derived.by(() => {
    const {
      schema: { items },
    } = config();
    return isSchemaObjectValue(items) ? items : {};
  });
  const itemUiSchema = $derived.by(() => {
    const {
      uiSchema: { items },
    } = config();
    return retrieveUiSchema(ctx, !Array.isArray(items) ? items : undefined);
  });
  const itemUiOptions = $derived(getUiOptions(ctx, itemUiSchema));

  const api = createItemsAPI(ctx, config, value, () => itemSchema);

  const canAdd = $derived.by(createCanAdd(config, value, () => api.addable));

  return Object.assign(api, {
    canAdd() {
      return canAdd;
    },
    canCopy() {
      return api.copyable && canAdd;
    },
    canRemove() {
      return api.removable;
    },
    canMoveUp(index) {
      return api.orderable && index > 0;
    },
    canMoveDown(index) {
      return api.orderable && index < value()!.length - 1;
    },
    itemConfig(config, item, index) {
      const schema = retrieveSchema(ctx, itemSchema, item);
      return {
        id: createChildId(config.id, index, ctx),
        name: getArrayItemName(config, index),
        title: getNormalArrayItemTitle(config, index),
        schema,
        uiSchema: itemUiSchema,
        uiOptions: itemUiOptions,
        required: !isSchemaNullable(schema),
      };
    },
  } satisfies Partial<ArrayContext<V>>);
}

export function createTupleContext<V extends Validator>(
  ctx: FormInternalContext<V>,
  config: () => Config,
  value: () => SchemaArrayValue | undefined,
  setValue: (v: SchemaArrayValue) => void
): ArrayContext<V> {
  const itemsSchema = $derived.by(() => {
    const conf = config();
    return Array.isArray(conf.schema.items)
      ? conf.schema.items.map((item, i) => {
          if (typeof item === "boolean") {
            throw new Error(
              "Invalid schema: items must be an array of schemas"
            );
          }
          return retrieveSchema(ctx, item, value()?.[i]);
        })
      : [];
  });
  const isAdditional = (index: number) => index >= itemsSchema.length;
  $effect(() => {
    const val = value();
    if (val === undefined) {
      setValue(new Array(itemsSchema.length));
      return;
    }
    if (val.length < itemsSchema.length) {
      val.push(...new Array(itemsSchema.length - value.length));
    }
  });

  const schemaAdditionalItems = $derived.by(() => {
    const conf = config();
    return isSchemaObjectValue(conf.schema?.additionalItems)
      ? conf.schema.additionalItems
      : undefined;
  });

  const api = createItemsAPI(ctx, config, value, () => schemaAdditionalItems);

  const canAdd = $derived.by(
    createCanAdd(
      config,
      value,
      () => api.addable && schemaAdditionalItems !== undefined
    )
  );

  return Object.assign(api, {
    canAdd() {
      return canAdd;
    },
    canCopy(index) {
      return api.copyable && canAdd && isAdditional(index);
    },
    canRemove(index) {
      return api.removable && isAdditional(index);
    },
    canMoveUp(index) {
      return api.orderable && index > itemsSchema.length;
    },
    canMoveDown(index) {
      return (
        api.orderable && index < value()!.length - 1 && isAdditional(index)
      );
    },
    itemConfig(config, item, index) {
      const additional = isAdditional(index);
      const schema = retrieveSchema(
        ctx,
        (additional ? schemaAdditionalItems : itemsSchema[index])!,
        item
      );
      const uiSchema = retrieveUiSchema(
        ctx,
        additional
          ? config.uiSchema.additionalItems
          : Array.isArray(config.uiSchema.items)
          ? config.uiSchema.items[index]
          : config.uiSchema.items
      );
      return {
        id: createChildId(config.id, index, ctx),
        name: getArrayItemName(config, index),
        title: getFixedArrayItemTitle(ctx, config, index),
        schema,
        uiSchema,
        uiOptions: getUiOptions(ctx, uiSchema),
        required: !isSchemaNullable(schema),
      };
    },
  } satisfies Partial<ArrayContext<V>>);
}
