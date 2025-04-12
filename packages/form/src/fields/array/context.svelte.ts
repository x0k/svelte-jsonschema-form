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
  readonly addable: boolean
  readonly orderable: boolean;
  readonly errors: FieldError<PossibleError<V>>[];
  canCopy(index: number): boolean;
  canRemove(index: number): boolean;
  canMoveUp(index: number): boolean;
  canMoveDown(arrLen: number, index: number): boolean;
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

export function createArrayContext<V extends Validator>(
  ctx: FormInternalContext<V>,
  isTuple: boolean,
  config: () => Config,
  value: () => SchemaArrayValue | undefined,
  setValue: (v: SchemaArrayValue) => void
): ArrayContext<V> {
  const normalItemSchema: Schema = $derived.by(() => {
    const conf = config();
    return isSchemaObjectValue(conf.schema.items) ? conf.schema.items : {};
  });
  const normalItemUiSchema = $derived.by(() => {
    const conf = config();
    return conf.uiSchema.items !== undefined &&
      !Array.isArray(conf.uiSchema.items)
      ? conf.uiSchema.items
      : {};
  });
  const normalItemUiOptions = $derived(getUiOptions(ctx, normalItemUiSchema));

  const fixedItemSchemas = $derived.by(() => {
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
  const isAdditional = (index: number) => index >= fixedItemSchemas.length;
  if (isTuple) {
    $effect(() => {
      const val = value();
      if (val === undefined) {
        setValue(new Array(fixedItemSchemas.length));
        return;
      }
      if (val.length < fixedItemSchemas.length) {
        val.push(...new Array(fixedItemSchemas.length - value.length));
      }
    });
  }

  const schemaAdditionalItems: Schema | false = $derived.by(() => {
    const conf = config();
    return isSchemaObjectValue(conf.schema?.additionalItems)
      ? conf.schema.additionalItems
      : false;
  });

  const {
    addable = true,
    orderable = true,
    removable = true,
    copyable = false,
  } = $derived(config().uiOptions ?? {});

  let val, maxItems;
  const canAdd = $derived.by(() => {
    if (isTuple && schemaAdditionalItems === false) {
      return false;
    }
    return (
      addable &&
      ((val = value()), Array.isArray(val)) &&
      ((maxItems = config().schema.maxItems),
      maxItems === undefined || val.length < maxItems)
    );
  });
  const errors = $derived(getErrors(ctx, config().id));

  function validate() {
    const m = ctx.fieldsValidationMode;
    if (!(m & ON_ARRAY_CHANGE) || (m & AFTER_SUBMITTED && !ctx.isSubmitted)) {
      return;
    }
    validateField(ctx, config(), value());
  }

  const keyedArray = createKeyedArray(() => value() ?? []);

  // NOTE: Defining this component as a generic will break packaging
  // dependant packages
  return {
    get addable() {
      return canAdd
    },
    get orderable() {
      return orderable;
    },
    get errors() {
      return errors;
    },
    key(index) {
      return keyedArray.key(index);
    },
    canCopy: isTuple
      ? (index) => copyable && canAdd && isAdditional(index)
      : () => copyable && canAdd,
    canRemove: isTuple
      ? (index) => removable && isAdditional(index)
      : () => removable,
    canMoveUp(index) {
      return orderable && index > (isTuple ? fixedItemSchemas.length : 0);
    },
    canMoveDown(arrLen, index) {
      return (
        orderable &&
        index < arrLen - 1 &&
        (isTuple ? isAdditional(index) : true)
      );
    },
    itemConfig: isTuple
      ? (config, item, index) => {
          const additional = isAdditional(index);
          const schema =
            additional && schemaAdditionalItems
              ? retrieveSchema(ctx, schemaAdditionalItems, item)
              : fixedItemSchemas[index]!;
          const uiSchema =
            (additional
              ? config.uiSchema.additionalItems
              : Array.isArray(config.uiSchema.items)
              ? config.uiSchema.items[index]
              : config.uiSchema.items) ?? {};
          return {
            id: createChildId(config.id, index, ctx),
            name: getArrayItemName(config, index),
            title: getFixedArrayItemTitle(config, index),
            schema,
            uiSchema,
            uiOptions: getUiOptions(ctx, uiSchema),
            required: !isSchemaNullable(schema),
          };
        }
      : (config, item, index) => {
          const schema = retrieveSchema(ctx, normalItemSchema, item);
          return {
            id: createChildId(config.id, index, ctx),
            name: getArrayItemName(config, index),
            title: getNormalArrayItemTitle(config, index),
            schema,
            uiSchema: normalItemUiSchema,
            uiOptions: normalItemUiOptions,
            required: !isSchemaNullable(schema),
          };
        },
    pushItem() {
      const itemSchema = isTuple ? schemaAdditionalItems : normalItemSchema;
      if (itemSchema === false) {
        return;
      }
      keyedArray.push(getDefaultFieldState(ctx, itemSchema, undefined));
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
  };
}
