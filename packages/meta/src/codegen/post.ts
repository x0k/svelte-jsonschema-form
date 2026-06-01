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

export interface PostOptions {
  validator: CodegenNonPrecompiledValidator;
  isTs: boolean;
  ts: ConditionalPrinter;
  schema: Schema;
}

// TODO: Convert schema to Zod, Valibot, Standard Schema validators
export function createPost({ validator, isTs, schema, ts }: PostOptions) {
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
          code: "export type Post = FromSchema<typeof schema>;",
        });
      }
    } else if (validator === "zod4") {
      js.imports.addNamespace(ast, { from: "zod", as: "z" });

      const postExpression = js.common.parseExpression(`z
  .object({
    title: z.string().meta({ title: "Title" }),
    content: z.string().min(10).meta({ title: "Content" }),
  })
  .meta({ title: "Post" })`);
      const postDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "post",
        value: postExpression,
      });
      js.exports.createNamed(ast, {
        name: "post",
        fallback: postDeclaration,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: "export type Post = z.infer<typeof post>;",
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
      title: "Basic form",
    }),
  )`);
      const postDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "post",
        value: postExpression,
      });
      js.exports.createNamed(ast, {
        name: "post",
        fallback: postDeclaration,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: "export type Post = v.InferInput<typeof post>;",
        });
      }
    } else if (validator === "standard-schema") {
      if (isTs) {
        js.imports.addNamed(ast, {
          imports: ["StandardSchemaV1", "StandardJSONSchemaV1"],
          from: "@standard-schema/spec",
          isType: true,
        });
      }

      const postExpression = js.common.parseExpression(`({
  "~standard": {
    version: 1,
    vendor: "sjsf",
    validate(value) {
      return value &&
        typeof value === "object" &&
        "title" in value &&
        typeof value.title === "string" &&
        "content" in value &&
        typeof value.content === "string" &&
        value.content.length > 10
        ? {
            value,
          }
        : {
            issues: [
              {
                message: "Invalid",
                path: [],
              },
            ],
          };
    },
    jsonSchema: {
      input: () => (${JSON.stringify(schema)}),
      output() {
        throw new Error("not implemented");
      },
    },
  },
}${ts(" as const satisfies StandardSchemaV1 & StandardJSONSchemaV1")})`);
      const postDeclaration = js.variables.declaration(ast, {
        kind: "const",
        name: "post",
        value: postExpression,
      });
      comments.add(postDeclaration, {
        type: "Line",
        value: "Replace with the actual schema",
      });
      js.exports.createNamed(ast, {
        name: "post",
        fallback: postDeclaration,
      });

      if (isTs) {
        js.common.appendFromString(ast, {
          code: "export type Post = StandardSchemaV1.InferInput<typeof post>;",
        });
      }
    } else {
      throw neverError(validator, "unexpected validator");
    }
  });
}
