import { validator } from "@exodus/schemasafe";
import {
  ON_ARRAY_CHANGE,
  ON_BLUR,
  ON_CHANGE,
  ON_INPUT,
  ON_OBJECT_CHANGE,
  type Config,
  type FormValue,
  type Schema,
} from "@sjsf/form";
import { createMerger } from "@sjsf/form/mergers/modern";
import {
  fragmentSchema,
  fromValidators,
  insertSubSchemaIds,
} from "@sjsf/form/validators/precompile";
import { importModule } from "validator-testing";
import { beforeAll, describe, expect, it } from "vitest";

import { DEFAULT_VALIDATOR_OPTIONS } from "./model.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./precompile/validator.js";
import { createFormValidator } from "./validator.js";

const fieldsValidationMode =
  ON_INPUT | ON_CHANGE | ON_BLUR | ON_ARRAY_CHANGE | ON_OBJECT_CHANGE;

const combinationSchema: Schema = {
  type: "object",
  required: ["missing"],
  properties: {
    single: {
      oneOf: [{ $ref: "#/definitions/one" }, { $ref: "#/definitions/two" }],
    },
    any: {
      anyOf: [{ $ref: "#/definitions/one" }, { $ref: "#/definitions/two" }],
    },
    nested: { $ref: "#/definitions/nested" },
  },
  definitions: {
    one: {
      type: "object",
      properties: {
        choice: { const: "one" },
      },
    },
    two: {
      type: "object",
      properties: {
        choice: { const: "two" },
      },
    },
    nested: {
      oneOf: [{ const: "one" }, { const: "two" }],
    },
  },
};

const repeatedCombinationSchema: Schema = {
  type: "object",
  properties: {
    items: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "object",
            properties: { value: { const: 1 } },
          },
          {
            type: "object",
            properties: { value: { const: 2 } },
          },
        ],
      },
    },
  },
};

const discriminatorSchema: Schema = {
  type: "object",
  properties: {
    pet: {
      type: "object",
      required: ["kind"],
      discriminator: { propertyName: "kind" },
      oneOf: [
        {
          type: "object",
          required: ["kind", "meows"],
          properties: {
            kind: { const: "cat" },
            meows: { const: true },
          },
        },
        {
          type: "object",
          required: ["kind", "barks"],
          properties: {
            kind: { const: "dog" },
            barks: { const: true },
          },
        },
      ],
    },
  },
};

const tupleCombinationSchema: Schema = {
  type: "object",
  required: ["missing"],
  properties: {
    tuple: {
      type: "array",
      items: [
        {
          anyOf: [{ $ref: "#/definitions/one" }, { $ref: "#/definitions/two" }],
        },
        { type: "string" },
      ],
    },
  },
  definitions: {
    one: { const: 1 },
    two: { const: 2 },
  },
};

const nestedCombinationSchema: Schema = {
  type: "object",
  required: ["missing"],
  properties: {
    outer: {
      oneOf: [
        {
          oneOf: [{ const: 1 }, { const: 2 }],
          maximum: 0,
        },
        { const: 9 },
      ],
    },
  },
};

async function createPrecompiledValidator(schema: Schema) {
  const patch = insertSubSchemaIds(schema, { fieldsValidationMode });
  const schemas = fragmentSchema(patch);
  const validate = validator(
    // @ts-expect-error Typings for `multi` version are missing
    schemas,
    {
      ...DEFAULT_VALIDATOR_OPTIONS,
      schemas: new Map(schemas.map((s) => [s.$id, s])),
      multi: true,
    }
  );
  const code = `export const [${schemas.map((s) => s.$id).join(", ")}] = ${validate.toModule()}`;
  const validateFunctions = await importModule<ValidateFunctions>(code);
  return createFormValidatorFactory({
    validatorRetriever: fromValidators(validateFunctions),
  })({ merger: () => createMerger() });
}

function createValidators(schema: Schema) {
  return {
    regular: {
      schema,
      validator: createFormValidator({ merger: () => createMerger() }),
    },
    precompiled: createPrecompiledValidator(schema).then((validator) => ({
      schema: insertSubSchemaIds(schema, { fieldsValidationMode }).schema,
      validator,
    })),
  };
}

function getErrors(
  result: ReturnType<
    ReturnType<typeof createFormValidator>["validateFormValue"]
  >
) {
  return result.errors ?? [];
}

describe("stale anyOf/oneOf errors", () => {
  let validators: {
    regular: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
    precompiled: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
  };

  beforeAll(async () => {
    const { regular, precompiled } = createValidators(combinationSchema);
    validators = {
      regular,
      precompiled: await precompiled,
    };
  });

  it.each(["regular", "precompiled"] as const)(
    "Should ignore leaked errors when validation succeeds (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, {
        missing: true,
        single: { choice: "one" },
        any: { choice: "two" },
        nested: "two",
      });
      expect(getErrors(result)).toEqual([]);
    }
  );

  it.each(["regular", "precompiled"] as const)(
    "Should keep unrelated errors and drop successful branch errors (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, {
        single: { choice: "one" },
        any: { choice: "two" },
        nested: "two",
      });
      expect(getErrors(result).map((error) => error.path)).toEqual([
        ["missing"],
      ]);
    }
  );

  it.each(["regular", "precompiled"] as const)(
    "Should keep branch errors when the combination fails (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, {
        single: { choice: "bad" },
        any: { choice: "bad" },
        nested: "bad",
      });
      const errors = getErrors(result);
      expect(errors).toContainEqual({
        path: ["missing"],
        message: "required (missing)",
      });
      expect(
        errors.some(
          (error) =>
            error.path.length === 1 &&
            error.path[0] === "single" &&
            error.message.startsWith("oneOf")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.path.length === 1 &&
            error.path[0] === "any" &&
            error.message.startsWith("anyOf")
        )
      ).toBe(true);
      expect(
        errors.some(
          (error) =>
            error.path.length === 1 &&
            error.path[0] === "nested" &&
            error.message.startsWith("oneOf")
        )
      ).toBe(true);
      expect(errors.filter((error) => error.path[1] === "choice")).toHaveLength(
        4
      );
    }
  );
});

describe("repeated combinations", () => {
  let validators: {
    regular: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
    precompiled: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
  };

  beforeAll(async () => {
    const { regular, precompiled } = createValidators(
      repeatedCombinationSchema
    );
    validators = {
      regular,
      precompiled: await precompiled,
    };
  });

  it.each(["regular", "precompiled"] as const)(
    "Should not keep errors from a matching item when another item fails (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, {
        items: [{ value: 3 }, { value: 2 }],
      });
      const errors = getErrors(result);
      expect(
        errors.some(
          (error) =>
            error.path[0] === "items" &&
            error.path[1] === 0 &&
            error.message.startsWith("oneOf")
        )
      ).toBe(true);
      expect(
        errors.filter(
          (error) => error.path[0] === "items" && error.path[1] === 1
        )
      ).toHaveLength(0);
    }
  );
});

describe("field value errors", () => {
  it("Should drop errors from a successful branch", () => {
    const validator = createFormValidator({ merger: () => createMerger() });
    const schema: Schema = {
      oneOf: [{ const: 1 }, { const: 2 }],
    };
    const errors = validator.validateFieldValue(
      {
        path: [] as unknown as Config["path"],
        title: "",
        schema,
        uiSchema: {},
        required: true,
      } satisfies Config,
      1
    );
    expect(errors).toEqual([]);
  });
});

describe("discriminator errors", () => {
  it("Should keep errors from the selected branch", () => {
    const validator = createFormValidator({ merger: () => createMerger() });
    const value: FormValue = { pet: { kind: "cat" } };
    const errors = getErrors(
      validator.validateFormValue(discriminatorSchema, value)
    );
    expect(errors).toContainEqual({
      path: ["pet", "meows"],
      message: "required (kind,meows)",
    });
  });
});

describe("tuple combinations", () => {
  let validators: {
    regular: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
    precompiled: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
  };

  beforeAll(async () => {
    const { regular, precompiled } = createValidators(tupleCombinationSchema);
    validators = {
      regular,
      precompiled: await precompiled,
    };
  });

  it.each(["regular", "precompiled"] as const)(
    "Should drop errors from a successful tuple item combination (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, {
        tuple: [2, "a"],
      });
      expect(getErrors(result).map((error) => error.path)).toEqual([
        ["missing"],
      ]);
    }
  );
});

describe("nested combinations", () => {
  let validators: {
    regular: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
    precompiled: {
      schema: Schema;
      validator: ReturnType<typeof createFormValidator>;
    };
  };

  beforeAll(async () => {
    const { regular, precompiled } = createValidators(nestedCombinationSchema);
    validators = {
      regular,
      precompiled: await precompiled,
    };
  });

  it.each(["regular", "precompiled"] as const)(
    "Should drop stale errors from a successful nested combination (%s)",
    (name) => {
      const { schema, validator } = validators[name];
      const result = validator.validateFormValue(schema, { outer: 2 });
      const errors = getErrors(result);
      expect(
        errors.filter((error) => error.path[0] === "missing")
      ).toHaveLength(1);
      expect(
        errors.filter(
          (error) =>
            error.path[0] === "outer" && error.message.startsWith("const")
        )
      ).toHaveLength(1);
      expect(
        errors.filter(
          (error) =>
            error.path[0] === "outer" && error.message.startsWith("maximum")
        )
      ).toHaveLength(1);
      expect(
        errors.filter(
          (error) =>
            error.path[0] === "outer" && error.message.startsWith("oneOf")
        )
      ).toHaveLength(1);
    }
  );
});
