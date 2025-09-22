import { getContext, setContext } from "svelte";

import { noop } from "@/lib/function.js";
import {
  getDefaultValueForType,
  getSimpleSchemaType,
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
  getFieldsValidationMode,
  ON_ARRAY_CHANGE,
  retrieveSchema,
  retrieveUiOption,
  retrieveUiSchema,
  uiTitleOption,
  validateField,
  type Config,
  type FieldError,
  type FormState,
  type FieldValue,
  type KeyedFieldValues,
  type PossibleError,
  type UiOption,
  setFieldState,
  FIELD_CHANGED,
} from "@/form/index.js";

import { titleWithIndex, type ItemTitle } from "./model.js";

export interface ArrayContext<V extends Validator> {
  config: () => Config;
  addable: () => boolean;
  removable: () => boolean;
  orderable: () => boolean;
  copyable: () => boolean;
  errors: () => FieldError<PossibleError<V>>[];
  itemTitle: ItemTitle;
  uiOption: UiOption;
  length: () => number;
  set: (index: number, value: SchemaValue | undefined) => void;
  canAdd: () => boolean;
  canCopy: (index: number) => boolean;
  canRemove: (index: number) => boolean;
  canMoveUp: (index: number) => boolean;
  canMoveDown: (index: number) => boolean;
  key: (index: number) => number;
  itemConfig: (
    config: Config,
    item: SchemaValue | undefined,
    index: number
  ) => Config;
  pushItem: () => void;
  moveItemUp: (index: number) => void;
  moveItemDown: (index: number) => void;
  copyItem: (index: number) => void;
  removeItem: (index: number) => void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<V extends Validator>(): ArrayContext<V> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<V extends Validator>(ctx: ArrayContext<V>) {
  setContext(ARRAY_CONTEXT, ctx);
}

interface ItemsOptions<T, V extends Validator> {
  ctx: FormState<T, V>;
  config: () => Config;
  value: () => SchemaArrayValue | null | undefined;
  keyedArray: () => KeyedFieldValues;
  itemSchema: () => Schema | undefined;
}

function createItems<T, V extends Validator>({
  ctx,
  config,
  itemSchema,
  keyedArray,
  value,
}: ItemsOptions<T, V>) {
  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config(), opt);
  function onChange() {
    setFieldState(ctx, config().id, FIELD_CHANGED);
    const m = getFieldsValidationMode(ctx);
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), value());
  }

  const keyed = $derived.by(keyedArray);

  const errors = $derived(getErrors(ctx, config().id));

  const addable = $derived(uiOption("addable") ?? true);
  const orderable = $derived(uiOption("orderable") ?? true);
  const removable = $derived(uiOption("removable") ?? true);
  const copyable = $derived(uiOption("copyable") ?? false);
  const itemTitle = $derived(uiOption("itemTitle") ?? titleWithIndex);

  return {
    config,
    uiOption,
    itemTitle(title, index, c, v) {
      return itemTitle(title, index, c, v);
    },
    addable: () => addable,
    orderable: () => orderable,
    removable: () => removable,
    copyable: () => copyable,
    errors: () => errors,
    key: (index) => keyed.key(index),
    pushItem: () => {
      const schema = itemSchema();
      if (schema === undefined) {
        return;
      }
      keyed.push(
        getDefaultFieldState(ctx, schema, undefined) ??
          getDefaultValueForType(getSimpleSchemaType(schema))
      );
      onChange();
    },
    moveItemUp(index) {
      keyed.swap(index, index - 1);
      onChange();
    },
    moveItemDown(index) {
      keyed.swap(index, index + 1);
      onChange();
    },
    copyItem(index) {
      keyed.insert(index, $state.snapshot(value()![index]));
      onChange();
    },
    removeItem(index) {
      keyed.remove(index);
      onChange();
    },
  } satisfies Partial<ArrayContext<V>>;
}

function createCanAdd(
  config: () => Config,
  length: () => number,
  addable: () => boolean
) {
  let maxItems;
  return () =>
    addable() &&
    ((maxItems = config().schema.maxItems),
    maxItems === undefined || length() < maxItems);
}

export interface ArrayContextOptions<T, V extends Validator> {
  ctx: FormState<T, V>;
  config: () => Config;
  value: () => SchemaArrayValue | null | undefined;
  keyedArray: () => KeyedFieldValues;
}

export function createArrayContext<T, V extends Validator>({
  ctx,
  config,
  value,
  keyedArray,
}: ArrayContextOptions<T, V>): ArrayContext<V> {
  const arr = $derived.by(value);

  const itemSchema: Schema = $derived.by(() => {
    const {
      schema: { items },
    } = config();
    return isSchemaObjectValue(items) ? items : {};
  });

  const items = createItems({
    ctx,
    config,
    value,
    keyedArray,
    itemSchema: () => itemSchema,
  });

  const itemUiSchema = $derived.by(() => {
    const {
      uiSchema: { items },
    } = config();
    return retrieveUiSchema(ctx, !Array.isArray(items) ? items : undefined);
  });

  const itemUiTitle = $derived(uiTitleOption(ctx, itemUiSchema));

  const length = () => arr?.length ?? 0;

  const canAdd = $derived.by(createCanAdd(config, length, items.addable));

  return {
    ...items,
    length,
    set(index, itemValue) {
      arr![index] = itemValue;
    },
    canAdd() {
      return canAdd;
    },
    canCopy() {
      return items.copyable() && canAdd;
    },
    canRemove: items.removable,
    canMoveUp(index) {
      return items.orderable() && index > 0;
    },
    canMoveDown(index) {
      return items.orderable() && index < arr!.length - 1;
    },
    itemConfig(config, item, index) {
      const schema = retrieveSchema(ctx, itemSchema, item);
      return {
        id: createChildId(config.id, index, ctx),
        title: items.itemTitle(
          itemUiTitle ?? schema.title ?? config.title,
          index,
          0,
          item
        ),
        schema,
        uiSchema: itemUiSchema,
        required: !isSchemaNullable(schema),
      };
    },
  };
}

export function createTupleContext<T, V extends Validator>({
  ctx,
  config,
  value,
  keyedArray,
}: ArrayContextOptions<T, V>): ArrayContext<V> {
  const arr = $derived.by(value);

  const itemsSchema = $derived.by(() => {
    const { items } = config().schema;
    return Array.isArray(items)
      ? items.map((item, i) => {
          if (typeof item === "boolean") {
            throw new Error(
              "Invalid schema: items must be an array of schemas"
            );
          }
          return retrieveSchema(ctx, item, arr?.[i]);
        })
      : [];
  });
  const isAdditional = (index: number) => index >= itemsSchema.length;

  const schemaAdditionalItems = $derived.by(() => {
    const { additionalItems } = config().schema;
    return isSchemaObjectValue(additionalItems) ? additionalItems : undefined;
  });

  const keyed = $derived.by(keyedArray);

  const items = createItems({
    ctx,
    config,
    value,
    keyedArray: () => keyed,
    itemSchema: () => schemaAdditionalItems,
  });

  const arrLen = $derived(Math.max(arr?.length ?? 0, itemsSchema.length));

  const length = () => arrLen;

  const canAdd = $derived.by(
    createCanAdd(
      config,
      length,
      () => items.addable() && schemaAdditionalItems !== undefined
    )
  );

  function initTuple(onInit: (arr: SchemaArrayValue) => void = noop) {
    const arr = new Array<FieldValue>(arrLen);
    onInit(arr);
    keyed.splice(0, 0, ...arr);
  }

  return {
    ...items,
    length,
    pushItem() {
      if (!arr) {
        initTuple();
      }
      items.pushItem();
    },
    set(index, itemValue) {
      if (arr) {
        arr[index] = itemValue;
      } else {
        initTuple((items) => {
          items[index] = itemValue;
        });
      }
    },
    canAdd() {
      return canAdd;
    },
    canCopy(index) {
      return items.copyable() && canAdd && isAdditional(index);
    },
    canRemove(index) {
      return items.removable() && isAdditional(index);
    },
    canMoveUp(index) {
      return items.orderable() && index > itemsSchema.length;
    },
    canMoveDown(index) {
      return items.orderable() && index < arrLen - 1 && isAdditional(index);
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
        title: items.itemTitle(
          uiTitleOption(ctx, uiSchema) ?? schema.title ?? config.title,
          index,
          itemsSchema.length,
          item
        ),
        schema,
        uiSchema,
        required: !isSchemaNullable(schema),
      };
    },
  };
}
