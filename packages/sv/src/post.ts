import { extraPackage, formPackage, isJsonSchemaValidator } from "meta";

import {
  isEndsWithPrecompiled,
  neverError,
  POST_JSON_SCHEMA_PATH,
  type Context,
} from "./model.js";
import { createAsConst, transforms, type AstTypes } from "./sv-utils.js";

const schema = {
  title: "Post",
  type: "object",
  properties: {
    title: {
      title: "Title",
      type: "string",
    },
    content: {
      title: "Content",
      type: "string",
      minLength: 50,
    },
  },
  required: ["title", "content"],
};

export function postTs({
  isTs,
  sv,
  directory,
  language,
  options,
  ts,
  lib,
}: Context) {
  const { validatorWithSuffix } = options;

  if (isEndsWithPrecompiled(validatorWithSuffix)) {
    sv.file(
      `${directory.lib}${POST_JSON_SCHEMA_PATH}`,
      transforms.json(({ data }) => {
        if (Object.keys(data).length === 0) {
          Object.assign(data, schema);
        }
      }),
    );
  } else {
    sv.file(
      lib(`post.${language}`),
      transforms.script(({ ast, js, comments }) => {
        if (
          isJsonSchemaValidator(validatorWithSuffix) ||
          validatorWithSuffix === "noop"
        ) {
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
          // TODO: export type CreatePost = FromSchema<typeof schema>;
        } else if (validatorWithSuffix === "zod4") {
          js.imports.addNamespace(ast, { from: "zod", as: "z" });

          const postExpression = js.common.parseExpression(`z
  .object({
    title: z.string().meta({ title: "Title" }),
    content: z.string().min(50).meta({ title: "Content" }),
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
          // TODO: export type Post = z.infer<typeof post>;
        } else if (validatorWithSuffix === "valibot") {
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
        v.minLength(50),
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
          // TODO: export type Post = v.InferInput<typeof post>;
        } else if (validatorWithSuffix === "standard-schema") {
          const postExpression = js.common.parseExpression(`{
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
        value.content.length > 50
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
}`);
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
        } else {
          throw neverError(validatorWithSuffix, "unexpected validator");
        }
      }),
    );
  }
}
