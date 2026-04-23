import {
  create,
  isAsyncFormValueValidator,
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

function createInitializer<V extends Validator>(
  createValidator: Creatable<V, ValidatorFactoryOptions>,
) {
  return ({
    schema = {},
    idBuilder = createFormIdBuilder(),
    uiSchema = {},
    uiOptionsRegistry = {},
  }: {
    schema?: Schema;
    uiSchema?: UiSchemaRoot;
    idBuilder?: FormIdBuilder;
    uiOptionsRegistry?: UiOptionsRegistry;
  } = {}) => {
    const validator = create(createValidator, {
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
    return { validator, idBuilder, merger };
  };
}

export function validatorTests(
  createValidator: Creatable<Validator, ValidatorFactoryOptions>,
) {
  const init = createInitializer(createValidator);
  describe("Validator", () => {
    it("Should compile schemas with identical ids", () => {
      const { validator } = init();
      validator.isValid({ $id: "foo" }, {}, undefined);
      validator.isValid({ $id: "foo" }, {}, undefined);
    });

    it("Should compile schemas with subSchemas with identical ids", () => {
      const { validator } = init();
      validator.isValid(
        { $id: "foo", properties: { foo: { $id: "bar" } } },
        {},
        undefined,
      );
      validator.isValid(
        { $id: "foo", properties: { foo: { $id: "bar" } } },
        {},
        undefined,
      );
    });
  });
}

export function formValueValidatorTests<T>(
  createFormValueValidator: Creatable<
    (FormValueValidator<T> | AsyncFormValueValidator<T>) & Validator,
    ValidatorFactoryOptions
  >,
) {
  const init = createInitializer(createFormValueValidator);
  function createValidator(params: Parameters<typeof init>[0]) {
    const { validator } = init(params);
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
      const validate = createValidator({ schema });

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
      const validate = createValidator({ schema });
      const { errors = [] } = await validate(signal, schema, value);
      expect(errors.length).toBeGreaterThan(1);
    });
  });
}
