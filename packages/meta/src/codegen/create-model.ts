import { transforms, type AstTypes } from "@sveltejs/sv-utils";
import type { Schema } from "@sjsf/form";

import { isJsonSchemaValidator } from "../validators.ts";
import { extraPackage } from "../package.ts";
import { formPackage } from "../form.ts";
import { neverError } from "../errors.ts";

import type {
  CodegenNonPrecompiledValidator,
  ConditionalPrinter,
} from "./model.ts";

export interface ModelOptions {
  validator: CodegenNonPrecompiledValidator;
  isTs: boolean;
  ts: ConditionalPrinter;
  schema: Schema;
  modelName: string;
}

function toTypeName(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// TODO: Convert schema to Zod, Valibot
export function createModel({
  validator,
  isTs,
  schema,
  ts,
  modelName,
}: ModelOptions) {
  const typeName = toTypeName(modelName);
  return transforms.script(({ ast, js, comments }) => {
    if (isJsonSchemaValidator(validator) || validator === "noop") {
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
      let schemaExpression: AstTypes.Expression = js.common.parseFromString(
        `(${JSON.stringify(schema)}${ts(" as const satisfies Schema")})`,
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
    } else if (validator === "zod4") {
      js.imports.addNamespace(ast, { from: "zod", as: "z" });

      const postExpression = js.common.parseExpression(`z
  .object({
    title: z.string().meta({ title: "Title" }),
    content: z.string().min(10).meta({ title: "Content" }),
  })
  .meta({ title: "${typeName}" })`);
      const modelDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "schema",
        value: postExpression,
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
    } else if (validator === "valibot") {
      js.imports.addNamespace(ast, { from: "valibot", as: "v" });

      const postExpression = js.common.parseExpression(`v.pipe(
    v.object({
      title: v.pipe(
        v.string(),
        v.metadata({
          title: "Title",
        }),
      ),
      content: v.pipe(
        v.string(),
        v.minLength(10),
        v.metadata({
          title: "Content",
        }),
      ),
    }),
    v.metadata({
      title: "${typeName}",
    }),
  )`);
      const modelDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "schema",
        value: postExpression,
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
    } else if (validator === "standard-schema") {
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

      const schemaJson = JSON.stringify(schema);
      js.common.appendFromString(ast, {
        code: isTs
          ? `const internalSchema = (${schemaJson}) as const satisfies Schema;`
          : `/** @type {import("${formPackage.name}").Schema} */\nconst internalSchema = (${schemaJson});`,
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
      throw neverError(validator, "unexpected validator");
    }
  });
}
