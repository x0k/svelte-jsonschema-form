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
import { omitExtraData } from "@sjsf/form/omit-extra-data";
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
  /** @default false */
  useOriginalSchema?: boolean;
}

export interface ExtraValidatorFactoryOptions extends ValidatorFactoryOptions {
  patch: ReturnType<typeof insertSubSchemaIds>;
}

function createInitializer<V extends Validator>(
  createValidator: Creatable<V | Promise<V>, ExtraValidatorFactoryOptions>,
  {
    createIdFactory = defaultCreateIdFactory,
    useOriginalSchema = false,
  }: InitializerOptions = {},
) {
  return async ({
    schema: originalSchema,
    idBuilder = createFormIdBuilder(),
    uiSchema = {},
    uiOptionsRegistry = {},
  }: {
    schema: Schema;
    uiSchema?: UiSchemaRoot;
    idBuilder?: FormIdBuilder;
    uiOptionsRegistry?: UiOptionsRegistry;
  }) => {
    const patch = insertSubSchemaIds(originalSchema, {
      fieldsValidationMode,
      createId: createIdFactory(),
    });
    const schema = useOriginalSchema ? originalSchema : patch.schema;
    const validator = await create(createValidator, {
      idBuilder,
      merger: () => merger,
      schema,
      uiOptionsRegistry,
      uiSchema,
      patch,
    });
    const merger = createFormMerger({
      schema,
      validator,
    });
    return {
      validator,
      idBuilder,
      merger,
      schema,
    };
  };
}

export interface ValidatorTestOptions extends InitializerOptions {
  /** @default false */
  skipOmitExtraDataTests?: boolean;
}

export function validatorTests(
  createValidator: Creatable<
    MaybePromise<Validator>,
    ExtraValidatorFactoryOptions
  >,
  options?: ValidatorTestOptions,
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

  describe.skipIf(options?.skipOmitExtraDataTests)("omitExtraData", () => {
    it("Should pick correct oneOf branch when additionalProperties is augmented", async () => {
      // Both branches have additionalProperties: false, which forces
      // allowAdditionalProperties() augmentation inside handleOneOf so that
      // getClosestMatchingOption / validator.isValid can still match on value shape.
      const { validator, merger, schema } = await init({
        schema: {
          oneOf: [
            {
              type: "object",
              properties: {
                kind: { type: "string", enum: ["cat"] },
                lives: { type: "number" },
              },
              required: ["kind"],
              additionalProperties: false,
            },
            {
              type: "object",
              properties: {
                kind: { type: "string", enum: ["dog"] },
                breed: { type: "string" },
              },
              required: ["kind"],
              additionalProperties: false,
            },
          ],
        },
      });

      // Extra key "noise" must be stripped; only the matching branch's
      // known properties should survive.
      const value = {
        kind: "dog",
        breed: "labrador",
        noise: "should be removed",
      };

      const result = omitExtraData(validator, merger, schema, value);

      expect(result).toEqual({ kind: "dog", breed: "labrador" });
    });

    it("Should strip fields from both branches independently", async () => {
      const { validator, merger, schema } = await init({
        schema: {
          oneOf: [
            {
              type: "object",
              properties: {
                kind: { type: "string", enum: ["a"] },
                x: { type: "number" },
              },
              required: ["kind"],
              additionalProperties: false,
            },
            {
              type: "object",
              properties: {
                kind: { type: "string", enum: ["b"] },
                y: { type: "string" },
              },
              required: ["kind"],
              additionalProperties: false,
            },
          ],
        },
      });

      // Branch "a" matched — "y" and "extra" must both be gone
      const result = omitExtraData(validator, merger, schema, {
        kind: "a",
        x: 42,
        y: "belongs to branch b, not a",
        extra: "also unwanted",
      });

      expect(result).toEqual({ kind: "a", x: 42 });
    });

    it("Should return original value for value that matches no branch", async () => {
      const { validator, merger, schema } = await init({
        schema: {
          oneOf: [
            {
              type: "object",
              properties: { kind: { type: "string", enum: ["a"] } },
              required: ["kind"],
              additionalProperties: false,
            },
          ],
        },
      });

      // getClosestMatchingOption falls back to index 0, but the branch
      // schema type is "object" while source is a string → omit returns undefined
      const result = omitExtraData(validator, merger, schema, {});

      expect(result).toEqual({});
    });
  });
}

export interface FormValueValidatorTestsOptions extends InitializerOptions {}

export function formValueValidatorTests<T>(
  createFormValueValidator: Creatable<
    MaybePromise<
      (FormValueValidator<T> | AsyncFormValueValidator<T>) & Validator
    >,
    ExtraValidatorFactoryOptions
  >,
  options: FormValueValidatorTestsOptions = {},
) {
  const init = createInitializer(createFormValueValidator, options);
  async function createValidator(params: Parameters<typeof init>[0]) {
    const { validator, schema } = await init(params);
    return isAsyncFormValueValidator(validator)
      ? (signal: AbortSignal, originalSchema: Schema, value: FormValue) =>
          validator.validateFormValueAsync(
            signal,
            options.useOriginalSchema ? originalSchema : schema,
            value,
          )
      : (_: AbortSignal, originalSchema: Schema, value: FormValue) =>
          Promise.resolve(
            validator.validateFormValue(
              options.useOriginalSchema ? originalSchema : schema,
              value,
            ),
          );
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
