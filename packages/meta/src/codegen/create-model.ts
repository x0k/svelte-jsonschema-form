import type { UiSchemaRoot, FormValue } from "@sjsf/form";
import { isRecordEmpty } from "@sjsf/form/lib/object";
import { transforms, type AstTypes } from "@sveltejs/sv-utils";

import { neverError } from "../errors.ts";
import { formPackage } from "../form.ts";
import { extraPackage } from "../package.ts";
import { isJsonSchemaValidator } from "../validators.ts";
import {
  fieldsValidationModeFlags,
  type CodegenNonPrecompiledValidator,
  type ConditionalPrinter,
  type FieldsValidationMode,
} from "./model.ts";
import { extractSchemaCode } from "./schema.ts";

export interface ModelOptions {
  validator: CodegenNonPrecompiledValidator;
  isTs: boolean;
  ts: ConditionalPrinter;
  schema: string;
  uiSchema: UiSchemaRoot;
  initialValue: FormValue;
  fieldsValidationMode: FieldsValidationMode;
}

export async function createModel({
  validator,
  isTs,
  schema,
  ts,
  uiSchema,
  initialValue,
  fieldsValidationMode,
}: ModelOptions) {
  return transforms.script(({ ast, js, comments }) => {
    if (isJsonSchemaValidator(validator.name) || validator.name === "noop") {
      if (isTs) {
        js.imports.addNamed(ast, {
          isType: true,
          imports: ["FromSchema"],
          from: extraPackage("jsonSchemaToTs").name,
        });
        js.imports.addNamed(ast, {
          isType: true,
          imports: ["Schema"],
          from: formPackage.name,
        });
      }
      const schemaExpression: AstTypes.Expression = js.common.parseFromString(
        `(${schema}${ts(" as const satisfies Schema")})`
      );
      const schemaDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "schema",
        value: schemaExpression,
      });
      if (!isTs) {
        js.common.addJsDocTypeComment(schemaDeclaration, comments, {
          type: `import(${formPackage.name}).Schema`,
        });
      }
      js.exports.createNamed(ast, {
        name: "schema",
        fallback: schemaDeclaration,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: `export type Model = FromSchema<typeof schema>;`,
        });
      }
    } else if (validator.name === "zod4") {
      const { code: userCode, expression } = extractSchemaCode(schema);
      if (userCode) {
        js.common.appendFromString(ast, { code: userCode });
      }
      const schemaExpression = js.common.parseExpression(expression);
      const modelDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "schema",
        value: schemaExpression,
      });
      js.exports.createNamed(ast, {
        name: "schema",
        fallback: modelDeclaration,
      });
      if (isTs) {
        js.common.appendFromString(ast, {
          code: `export type Model = z.infer<typeof schema>;`,
        });
      }
    } else if (validator.name === "valibot") {
      const { code: userCode, expression } = extractSchemaCode(schema);
      if (userCode) {
        js.common.appendFromString(ast, { code: userCode });
      }
      const schemaExpression = js.common.parseExpression(expression);
      const modelDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "schema",
        value: schemaExpression,
      });
      js.exports.createNamed(ast, {
        name: "schema",
        fallback: modelDeclaration,
      });
      if (isTs) {
        js.common.appendFromString(ast, {
          code: `export type Model = v.InferInput<typeof schema>;`,
        });
      }
    } else if (validator.name === "standard-schema") {
      if (isTs) {
        js.imports.addNamed(ast, {
          isType: true,
          imports: ["FromSchema"],
          from: extraPackage("jsonSchemaToTs").name,
        });
        js.imports.addNamed(ast, {
          isType: true,
          imports: ["Schema"],
          from: formPackage.name,
        });
        js.imports.addNamed(ast, {
          imports: ["StandardSchemaV1", "StandardJSONSchemaV1"],
          from: "@standard-schema/spec",
          isType: true,
        });
      }

      js.common.appendFromString(ast, {
        code: isTs
          ? `const internalSchema = (${schema}) as const satisfies Schema;`
          : `/** @type {import("${formPackage.name}").Schema} */\nconst internalSchema = (${schema});`,
        comments,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: `type InternalModel = FromSchema<typeof internalSchema>;`,
          comments,
        });
      }

      js.common.appendFromString(ast, {
        code: `// TODO: Replace demo schema with real Standard Schema (arktype, typebox, valibot, zod, etc.)
export const schema${ts(": StandardSchemaV1<InternalModel> & StandardJSONSchemaV1")} = {
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value) {
      return typeof value === "object" && value !== null
        ? { value${ts(": value as InternalModel")} }
        : { issues: [{ message: "Invalid", path: [] }] };
    },
    jsonSchema: {
      input: () => internalSchema,
      output() {
        throw new Error("not implemented");
      },
    },
  },
};`,
        comments,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: `export type Model = StandardSchemaV1.InferInput<typeof schema>;`,
          comments,
        });
      }
    } else {
      throw neverError(validator.name, "unexpected validator");
    }

    if (!isRecordEmpty(uiSchema)) {
      if (isTs) {
        js.imports.addNamed(ast, {
          isType: true,
          imports: ["UiSchemaRoot"],
          from: formPackage.name,
        });
      }
      const expression: AstTypes.Expression = js.common.parseFromString(
        `(${JSON.stringify(uiSchema)}${ts(" as const satisfies UiSchemaRoot")})`
      );
      const declaration = js.variables.declaration(ast, {
        kind: "const",
        name: "uiSchema",
        value: expression,
      });
      js.exports.createNamed(ast, {
        name: "uiSchema",
        fallback: declaration,
      });
    }

    if (initialValue !== undefined) {
      const expression: AstTypes.Expression = js.common.parseFromString(
        `(${JSON.stringify(initialValue)})`
      );
      const declaration = js.variables.declaration(ast, {
        kind: "const",
        name: "initialValue",
        value: expression,
      });
      js.exports.createNamed(ast, {
        name: "initialValue",
        fallback: declaration,
      });
    }

    if (fieldsValidationMode > 0) {
      const flags = fieldsValidationModeFlags(fieldsValidationMode);
      js.imports.addNamed(ast, {
        imports: flags,
        from: formPackage.name,
      });
      const fieldsValidationModeDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "fieldsValidationMode",
        value: js.common.parseFromString(flags.join(" | ")),
      });
      js.exports.createNamed(ast, {
        name: "fieldsValidationMode",
        fallback: fieldsValidationModeDeclaration,
      });
    }
  });
}
