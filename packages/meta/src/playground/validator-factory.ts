import {
  create,
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type FormValidator,
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

import { isDraft2020, type PlaygroundValidator } from "./model.ts";

export interface ValidatorFactoryOptions {
  validator: PlaygroundValidator;
  schema: Schema;
  uiSchema?: UiSchema;
  merger: () => Merger;
}

export type CreatableValidator = <T>(
  options: ValidatorFactoryOptions
) => FormValidator<T>;

export type ValidatorFactory = <T>(
  options: ValidatorFactoryOptions
) => Promise<{
  schema: Schema;
  validator: FormValidator<T>;
}>;

interface ValidatorModule {
  draft07: CreatableValidator;
  draft2020: CreatableValidator;
}

export const DRAFT_07: Schema = {
  $schema: "http://json-schema.org/draft-07/schema",
};

export const DRAFT_2020: Schema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
};

export function toDraft07(loader: () => Promise<ValidatorModule>) {
  return async <T>(options: ValidatorFactoryOptions) => {
    const { draft07 } = await loader();
    return {
      schema: options.schema,
      validator: draft07<T>(options),
    };
  };
}

export function toDraft2020(loader: () => Promise<ValidatorModule>) {
  return async <T>(options: ValidatorFactoryOptions) => {
    const { draft2020 } = await loader();
    return {
      schema: isDraft2020(options.schema)
        ? convert(options.schema as Parameters<typeof convert>[0])
        : options.schema,
      validator: draft2020<T>(options),
    };
  };
}

export function toFactory(
  loader: () => Promise<{ default: ValidatorFactory }>
) {
  return async <T>(options: ValidatorFactoryOptions) =>
    (await loader()).default<T>(options);
}

const ON_EVERYTHING =
  ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE;

export type CompilableValidator<T> = (
  options: ValidatorFactoryOptions
) => FormValidator<T>;

export type CompileValidator = <T>(
  schemas: Schema[]
) => Promise<CompilableValidator<T>>;

interface CompilableValidatorModule {
  draft07: CompileValidator;
  createIdFactory?: () => IdFactory;
}

export function toPrecompiledDraft07(
  loader: () => Promise<CompilableValidatorModule>
): ValidatorFactory {
  return async <T>(options: ValidatorFactoryOptions) => {
    const { draft07, createIdFactory = defaultCreateIdFactory } =
      await loader();
    const patch = insertSubSchemaIds(options.schema, {
      createId: createIdFactory(),
      fieldsValidationMode: ON_EVERYTHING,
    });
    const factory = await draft07<T>(fragmentSchema(patch));
    return {
      schema: patch.schema,
      validator: create(factory, options),
    };
  };
}
