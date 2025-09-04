import { getContext, setContext } from "svelte";

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
  ON_ARRAY_CHANGE,
  retrieveSchema,
  retrieveUiOption,
  retrieveUiSchema,
  uiTitleOption,
  validateField,
  type Config,
  type FieldError,
  type FormInternalContext,
  type KeyedFieldValues,
  type PossibleError,
  type UiOption,
} from "@/form/index.js";

import { titleWithIndex, type ItemTitle } from "./model.js";

export interface ArrayContext<V extends Validator> {
  readonly config: Config;
  readonly addable: boolean;
  readonly removable: boolean;
  readonly orderable: boolean;
  readonly copyable: boolean;
  readonly itemTitle: ItemTitle;
  readonly errors: FieldError<PossibleError<V>>[];
  readonly uiOption: UiOption;
  length(): number;
  set(index: number, value: SchemaValue | undefined): void;
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
  validate(): void;
}

const ARRAY_CONTEXT = Symbol("array-context");

export function getArrayContext<V extends Validator>(): ArrayContext<V> {
  return getContext(ARRAY_CONTEXT);
}

export function setArrayContext<V extends Validator>(ctx: ArrayContext<V>) {
  setContext(ARRAY_CONTEXT, ctx);
}

interface ItemsOptions<V extends Validator> {
  ctx: FormInternalContext<V>;
  config: () => Config;
  value: () => SchemaArrayValue | undefined;
  keyedArray: () => KeyedFieldValues;
  itemSchema: () => Schema | undefined;
}

function createItems<V extends Validator>({
  ctx,
  config,
  itemSchema,
  keyedArray,
  value,
}: ItemsOptions<V>) {
  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), value());
  }
  const uiOption: UiOption = (opt) => retrieveUiOption(ctx, config(), opt);

  const keyed = $derived.by(keyedArray);

  const errors = $derived(getErrors(ctx, config().id));

  const addable = $derived(uiOption("addable") ?? true);
  const orderable = $derived(uiOption("orderable") ?? true);
  const removable = $derived(uiOption("removable") ?? true);
  const copyable = $derived(uiOption("copyable") ?? false);
  const itemTitle = $derived(uiOption("itemTitle") ?? titleWithIndex);

  return {
    uiOption,
    validate,
    get itemTitle() {
      return itemTitle;
    },
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
      return keyed.key(index);
    },
    pushItem() {
      const schema = itemSchema();
      if (schema === undefined) {
        return;
      }
      keyed.push(
        getDefaultFieldState(ctx, schema, undefined) ??
          getDefaultValueForType(getSimpleSchemaType(schema))
      );
      validate();
    },
    moveItemUp(index) {
      keyed.swap(index, index - 1);
      validate();
    },
    moveItemDown(index) {
      keyed.swap(index, index + 1);
      validate();
    },
    copyItem(index) {
      keyed.insert(index, $state.snapshot(value()![index]));
      validate();
    },
    removeItem(index) {
      keyed.remove(index);
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

export interface ArrayContextOptions<V extends Validator> {
  ctx: FormInternalContext<V>;
  config: () => Config;
  value: () => SchemaArrayValue | undefined;
  keyedArray: () => KeyedFieldValues;
}

export function createArrayContext<V extends Validator>({
  ctx,
  config,
  value,
  keyedArray,
}: ArrayContextOptions<V>): ArrayContext<V> {
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

  const canAdd = $derived.by(createCanAdd(config, value, () => items.addable));

  return Object.assign(items, {
    length() {
      return arr?.length ?? 0;
    },
    set(index, itemValue) {
      arr![index] = itemValue;
    },
    canAdd() {
      return canAdd;
    },
    canCopy() {
      return items.copyable && canAdd;
    },
    canRemove() {
      return items.removable;
    },
    canMoveUp(index) {
      return items.orderable && index > 0;
    },
    canMoveDown(index) {
      return items.orderable && index < arr!.length - 1;
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
  } satisfies Partial<ArrayContext<V>>);
}

export function createTupleContext<V extends Validator>({
  ctx,
  config,
  value,
  keyedArray,
}: ArrayContextOptions<V>): ArrayContext<V> {
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

  const canAdd = $derived.by(
    createCanAdd(
      config,
      value,
      () => items.addable && schemaAdditionalItems !== undefined
    )
  );

  const length = $derived(Math.max(arr?.length ?? 0, itemsSchema.length));

  return Object.assign(items, {
    length() {
      return length;
    },
    set(index, itemValue) {
      if (arr !== undefined) {
        arr[index] = itemValue;
      } else {
        const items = new Array(length);
        items[index] = itemValue;
        keyed.splice(0, 0, ...items);
      }
    },
    canAdd() {
      return canAdd;
    },
    canCopy(index) {
      return items.copyable && canAdd && isAdditional(index);
    },
    canRemove(index) {
      return items.removable && isAdditional(index);
    },
    canMoveUp(index) {
      return items.orderable && index > itemsSchema.length;
    },
    canMoveDown(index) {
      return items.orderable && index < arr!.length - 1 && isAdditional(index);
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
  } satisfies Partial<ArrayContext<V>>);
}
