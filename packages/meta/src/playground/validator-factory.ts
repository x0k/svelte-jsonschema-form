import {
  create,
  isAsyncFormValueValidator,
  isFormValueValidator,
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type AsyncFormValueValidator,
  type FormValidator,
  type FormValueValidator,
  type Schema,
  type UiSchema,
} from "@sjsf/form";
import { convert } from "@sjsf/form/converters/draft-2020-12";
import type { Merger } from "@sjsf/form/core";
import {
  insertSubSchemaIds,
  createIdFactory as defaultCreateIdFactory,
  fragmentSchema,
  type IdFactory,
} from "@sjsf/form/validators/precompile";

import { isDraft2020 } from "./model.ts";

interface ValidatorFactoryOptions {
  uiSchema?: UiSchema;
  merger: () => Merger;
}

export type CreatableValidator = <T>(
  options: ValidatorFactoryOptions
) => FormValidator<T>;

export type ValidatorFactory = <T>(options: ValidatorFactoryOptions) => (
  schema: object
) => Promise<{
  schema: Schema;
  validator: FormValidator<T>;
}>;

interface AbstractValidatorModule<T> {
  draft07: T;
  draft2020: T;
}

type ValidatorModule = AbstractValidatorModule<CreatableValidator>;

export type CompilableValidator<T> = (
  options: ValidatorFactoryOptions
) => FormValidator<T>;

export type CompileValidator = <T>(
  schemas: Schema[]
) => Promise<CompilableValidator<T>>;

type CompilableValidatorModule = AbstractValidatorModule<CompileValidator> & {
  createIdFactory?: () => IdFactory;
};

export function toDraft07(loader: () => Promise<ValidatorModule>) {
  return <T>(options: ValidatorFactoryOptions) => {
    let validator: FormValidator<T>;
    return async (schema: object) => {
      validator ??= (await loader()).draft07(options);
      return {
        schema,
        validator,
      };
    };
  };
}

export const DRAFT_07: Schema = {
  $schema: "http://json-schema.org/draft-07/schema",
};

export const DRAFT_2020: Schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
};

function replaceSchema<T>(
  validator: FormValidator<T>,
  originalSchema: Schema
): FormValidator<T> {
  if (isAsyncFormValueValidator<FormValidator<T>, T>(validator)) {
    return {
      ...validator,
      validateFormValueAsync(signal, _rootSchema, formValue) {
        return validator.validateFormValueAsync(
          signal,
          originalSchema,
          formValue
        );
      },
    } satisfies AsyncFormValueValidator<T>;
  }
  if (isFormValueValidator(validator)) {
    return {
      ...validator,
      validateFormValue(_rootSchema, formValue) {
        return validator.validateFormValue(originalSchema, formValue);
      },
    } satisfies FormValueValidator<T>;
  }
  return validator;
}

export function toDraft2020(loader: () => Promise<ValidatorModule>) {
  return <T>(options: ValidatorFactoryOptions) => {
    let validator: FormValidator<T>;
    return async (originalSchema: object) => {
      validator ??= (await loader()).draft2020(options);
      return isDraft2020(originalSchema)
        ? {
            schema: convert(originalSchema as Parameters<typeof convert>[0]),
            validator: replaceSchema(validator, originalSchema),
          }
        : {
            schema: originalSchema,
            validator,
          };
    };
  };
}

export function toFactory(
  loader: () => Promise<{ default: ValidatorFactory }>
) {
  return <T>(options: ValidatorFactoryOptions) => {
    let fn: (
      schema: object
    ) => Promise<{ schema: Schema; validator: FormValidator<T> }>;
    return async (schema: object) => {
      fn ??= (await loader()).default(options);
      return fn(schema);
    };
  };
}

const ON_EVERYTHING =
  ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE;

function createToPrecompiledFactory(
  draft: keyof AbstractValidatorModule<unknown>
) {
  return (loader: () => Promise<CompilableValidatorModule>) => {
    return <T>(options: ValidatorFactoryOptions) => {
      let m: CompilableValidatorModule;
      return async (schema: object) => {
        m ??= await loader();
        const { [draft]: compile, createIdFactory = defaultCreateIdFactory } =
          m;
        const patch = insertSubSchemaIds(schema, {
          createId: createIdFactory(),
          fieldsValidationMode: ON_EVERYTHING,
        });
        const factory = await compile<T>(fragmentSchema(patch));
        return {
          schema: patch.schema,
          validator: create(factory, options),
        };
      };
    };
  };
}

export const toPrecompiledDraft07 = createToPrecompiledFactory("draft07");

export const toPrecompiledDraft2020 = createToPrecompiledFactory("draft2020");
