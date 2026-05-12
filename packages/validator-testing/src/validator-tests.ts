import type { MaybePromise } from "@sjsf/form/lib/types";
import {
  create,
  isAsyncFormValueValidator,
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type AsyncFormValueValidator,
  type Creatable,
  type FormIdBuilder,
  type FormValue,
  type FormValueValidator,
  type Schema,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type Validator,
  type ValidatorFactoryOptions,
} from "@sjsf/form";
import { createFormIdBuilder } from "@sjsf/form/id-builders/modern";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { expect, it, describe } from "vitest";
import {
  insertSubSchemaIds,
  createIdFactory as defaultCreateIdFactory,
  type IdFactory,
} from "@sjsf/form/validators/precompile";

const fieldsValidationMode =
  ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE;

export interface InitializerOptions {
  createIdFactory?: () => IdFactory;
}

function createInitializer<V extends Validator>(
  createValidator: Creatable<V | Promise<V>, ValidatorFactoryOptions>,
  { createIdFactory = defaultCreateIdFactory }: InitializerOptions = {},
) {
  return async ({
    schema,
    idBuilder = createFormIdBuilder(),
    uiSchema = {},
    uiOptionsRegistry = {},
  }: {
    schema: Schema;
    uiSchema?: UiSchemaRoot;
    idBuilder?: FormIdBuilder;
    uiOptionsRegistry?: UiOptionsRegistry;
  }) => {
    const validator = await create(createValidator, {
      idBuilder,
      merger: () => merger,
      schema,
      uiOptionsRegistry,
      uiSchema,
    });
    const merger = createFormMerger({
      schema,
      validator,
    });
    return {
      validator,
      idBuilder,
      merger,
      schema: insertSubSchemaIds(schema, {
        fieldsValidationMode,
        createId: createIdFactory(),
      }).schema,
    };
  };
}

export function validatorTests(
  createValidator: Creatable<MaybePromise<Validator>, ValidatorFactoryOptions>,
  options?: InitializerOptions,
) {
  const init = createInitializer(createValidator, options);
  describe("Validator", () => {
    it("Should compile schemas with identical ids", async () => {
      const { validator, schema } = await init({
        schema: { $id: "foo", type: "string" },
      });
      const schema2 = structuredClone(schema);
      validator.isValid(schema, schema, undefined);
      validator.isValid(schema2, schema2, undefined);
    });

    it("Should compile schemas with subSchemas with identical ids", async () => {
      const { validator, schema } = await init({
        schema: {
          $id: "foo",
          properties: { foo: { $id: "bar" } },
        },
      });
      const schema2 = structuredClone(schema);
      validator.isValid(schema, schema, undefined);
      validator.isValid(schema2, schema2, undefined);
    });
  });
}

export function formValueValidatorTests<T>(
  createFormValueValidator: Creatable<
    MaybePromise<
      (FormValueValidator<T> | AsyncFormValueValidator<T>) & Validator
    >,
    ValidatorFactoryOptions
  >,
  options?: InitializerOptions,
) {
  const init = createInitializer(createFormValueValidator, options);
  async function createValidator(params: Parameters<typeof init>[0]) {
    const { validator } = await init(params);
    return isAsyncFormValueValidator(validator)
      ? (signal: AbortSignal, schema: Schema, value: FormValue) =>
          validator.validateFormValueAsync(signal, schema, value)
      : (_: AbortSignal, schema: Schema, value: FormValue) =>
          Promise.resolve(validator.validateFormValue(schema, value));
  }

  describe("Form value validator", () => {
    it("Should correctly infer path", async ({ signal }) => {
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
          minLength: 10,
        },
      };
      const validate = await createValidator({ schema });

      const { errors = [] } = await validate(signal, schema, ["foo"]);
      const error = errors.find(
        ({ path }) => path.length === 1 && path[0] === 0,
      );
      expect(error).toBeDefined();
    });

    it("Should handle undefined", async ({ signal }) => {
      const schema: Schema = {
        title: "A registration form",
        description: "A simple form example.",
        type: "object",
        required: ["firstName", "items"],
        properties: {
          firstName: {
            type: "string",
            title: "First name",
            default: "Chuck",
          },
          items: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
      };
      const value = {
        firstName: undefined,
        items: [undefined, "value"],
      };
      const validate = await createValidator({ schema });
      const { errors = [] } = await validate(signal, schema, value);
      expect(errors.length).toBeGreaterThan(1);
    });
  });
}
