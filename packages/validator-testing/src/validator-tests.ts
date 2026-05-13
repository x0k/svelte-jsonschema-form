import type { MaybePromise } from "@sjsf/form/lib/types";
import {
  getClosestMatchingOption,
  getFirstMatchingOption,
} from "@sjsf/form/core";
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
import {
  insertSubSchemaIds,
  createIdFactory as defaultCreateIdFactory,
  type IdFactory,
} from "@sjsf/form/validators/precompile";
import { expect, it, describe } from "vitest";

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
  skipIntegrationTests?: boolean;
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

  describe.skipIf(options?.skipIntegrationTests)("integration", () => {
    describe("getFirstMatchingOption — createAugmentSchema path", () => {
      // isOptionMatching takes the memoizedAugmentSchema branch when:
      //   isSchemaWithProperties(option) === true && discriminatorField === undefined

      it("Should match branch by present property when required is stripped", async () => {
        // Without augmentation, required: ["kind"] would reject a value
        // missing other required fields. createAugmentSchema strips required
        // and replaces it with anyOf[{ required: [key] }...], so a value
        // with ANY known property satisfies the branch.
        const { validator, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  kind: { type: "string", enum: ["cat"] },
                  lives: { type: "number" },
                },
                required: ["kind", "lives"],
              },
              {
                type: "object",
                properties: {
                  kind: { type: "string", enum: ["dog"] },
                  breed: { type: "string" },
                },
                required: ["kind", "breed"],
              },
            ],
          },
        });
        const options = schema.oneOf as Schema[];

        // Value only has "kind" — original required would reject both branches,
        // but augmented anyOf([{required:["kind"]},{required:["lives"]}]) accepts.
        const index = getFirstMatchingOption(
          validator,
          { kind: "cat" },
          options,
          schema,
        );
        expect(index).toBe(0);
      });

      it("Should return 0 when formData is undefined", async () => {
        const { validator, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: { a: { type: "string" } },
                required: ["a"],
              },
              {
                type: "object",
                properties: { b: { type: "number" } },
                required: ["b"],
              },
            ],
          },
        });
        const index = getFirstMatchingOption(
          validator,
          undefined,
          schema.oneOf as Schema[],
          schema,
        );
        expect(index).toBe(0);
      });

      it("Should pick first matching branch among multiple property-bearing schemas", async () => {
        const { validator, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: { x: { type: "number" } },
                required: ["x"],
              },
              {
                type: "object",
                properties: { y: { type: "string" } },
                required: ["y"],
              },
              {
                type: "object",
                properties: { z: { type: "boolean" } },
                required: ["z"],
              },
            ],
          },
        });
        const index = getFirstMatchingOption(
          validator,
          { y: "hello" },
          schema.oneOf as Schema[],
          schema,
        );
        expect(index).toBe(1);
      });
    });

    describe("getClosestMatchingOption — scoring and augmentation", () => {
      it("Should score branches and pick best matching one", async () => {
        // Both branches are valid (augmented required passes),
        // but branch 1 has more matching typed properties → higher score.
        const { validator, merger, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: { kind: { type: "string" } },
                required: ["kind"],
              },
              {
                type: "object",
                properties: {
                  kind: { type: "string" },
                  count: { type: "number" },
                  label: { type: "string" },
                },
                required: ["kind"],
              },
            ],
          },
        });
        const index = getClosestMatchingOption(
          validator,
          merger,
          schema,
          { kind: "x", count: 3, label: "foo" },
          schema.oneOf as Schema[],
        );
        expect(index).toBe(1);
      });

      it("Should fall back to selectedOption when all scores are equal", async () => {
        const { validator, merger, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: { a: { type: "string" } },
                required: ["a"],
              },
              {
                type: "object",
                properties: { b: { type: "string" } },
                required: ["b"],
              },
            ],
          },
        });

        // Both branches score equally for a value that matches neither specifically.
        const index = getClosestMatchingOption(
          validator,
          merger,
          schema,
          {},
          schema.oneOf as Schema[],
          1, // selectedOption
        );
        expect(index).toBe(1);
      });

      it("Should use discriminator field to short-circuit augmentation", async () => {
        const { validator, merger, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: {
                  kind: { type: "string", const: "circle" },
                  radius: { type: "number" },
                },
                required: ["kind"],
              },
              {
                type: "object",
                properties: {
                  kind: { type: "string", const: "rect" },
                  width: { type: "number" },
                },
                required: ["kind"],
              },
            ],
          },
        });
        // With a discriminator, isOptionMatching validates only the
        // discriminator property schema — createAugmentSchema is NOT called.
        const index = getClosestMatchingOption(
          validator,
          merger,
          schema,
          { kind: "rect", width: 100 },
          schema.oneOf as Schema[],
          0,
          "kind",
        );
        expect(index).toBe(1);
      });
    });

    describe("omitExtraData", () => {
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

      it("Should not strip extra keys when additionalProperties is not false", async () => {
        // allowAdditionalProperties augmentation is skipped for this branch,
        // confirming the condition `additionalProperties === false` is the trigger.
        const { validator, merger, schema } = await init({
          schema: {
            oneOf: [
              {
                type: "object",
                properties: { kind: { type: "string", enum: ["a"] } },
                required: ["kind"],
                additionalProperties: true,
              },
            ],
          },
        });
        const result = omitExtraData(validator, merger, schema, {
          kind: "a",
          extra: "keep me",
        });
        // "extra" survives because the branch allows additional properties
        expect(result).toEqual({ kind: "a", extra: "keep me" });
      });
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
