import {
  DEFAULT_ID_PREFIX,
  type FormIdBuilder,
  type FormValueValidator,
  type Id,
  type Schema,
  type UiOptionsRegistry,
  type UiSchemaRoot,
  type Validator,
  type ValidatorFactoryOptions,
} from "@sjsf/form";
import { createFormIdBuilder } from "@sjsf/form/id-builders/legacy";
import { createFormMerger } from "@sjsf/form/mergers/modern";
import { expect, it, describe } from "vitest";

function createInitializer<V extends Validator>(
  createValidator: (options: ValidatorFactoryOptions) => V
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
    const validator = createValidator({
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
  createValidator: (options: ValidatorFactoryOptions) => Validator
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
        undefined
      );
      validator.isValid(
        { $id: "foo", properties: { foo: { $id: "bar" } } },
        {},
        undefined
      );
    });
  });
}

export function formValueValidatorTests(
  createFormValueValidator: (
    options: ValidatorFactoryOptions
  ) => FormValueValidator<any> & Validator
) {
  const init = createInitializer(createFormValueValidator);

  describe("Form value validator", () => {
    it("Should correctly recreate instanceId", () => {
      const idBuilder: FormIdBuilder = {
        ...createFormIdBuilder(),
        fromPath(path) {
          let id = DEFAULT_ID_PREFIX;
          for (let p of path) {
            if (typeof p === "number") {
              id += "[" + p + "]";
            } else {
              id += "." + p;
            }
          }
          return id as Id;
        },
      };
      const schema: Schema = {
        type: "array",
        items: {
          type: "string",
          minLength: 10,
        },
      };
      const { validator } = init({ schema, idBuilder });

      const errors = validator.validateFormValue(schema, ["foo"]);
      const error = errors.find(
        (e) => e.instanceId === `${DEFAULT_ID_PREFIX}[0]`
      );
      expect(error).toBeDefined();
    });

    it("Should properly evaluate title from json schema with $ref`s", () => {
      const schema: Schema = {
        definitions: {
          node: {
            type: "object",
            properties: {
              name: {
                type: "string",
                title: "title",
              },
              children: {
                type: "array",
                items: {
                  $ref: "#/definitions/node",
                },
              },
            },
          },
        },
        type: "object",
        properties: {
          tree: {
            title: "Recursive references",
            $ref: "#/definitions/node",
          },
        },
      };
      const value = {
        tree: {
          children: [
            {
              children: [
                {
                  name: NaN,
                },
              ],
            },
          ],
        },
      };

      const { validator } = init({ schema });
      const errors = validator.validateFormValue(schema, value);
      expect(errors[errors.length - 1]?.propertyTitle).toBe("title");
    });

    it("Should handle undefined", () => {
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
      const { validator } = init({ schema });
      const errors = validator.validateFormValue(schema, value);
      expect(errors.length).toBeGreaterThan(1);
    });
  });
}
