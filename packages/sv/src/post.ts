import { extraPackage, formPackage, isJsonSchemaValidator } from "meta";

import type { Context } from "./model.js";
import { transforms } from "./sv-utils.js";

export function postTs({ isTs, sv, directory, language, options }: Context) {
  const { validator } = options;
  sv.file(
    `${directory.lib}/post.${language}`,
    transforms.script(({ ast, js, comments }) => {
      if (isJsonSchemaValidator(validator) || validator === "noop") {
        if (isTs) {
          js.imports.addNamed(ast, {
            isType: true,
            imports: ["FormSchema"],
            from: extraPackage("jsonSchemaToTs").name,
          });
          js.imports.addNamed(ast, {
            isType: true,
            imports: ["Schema"],
            from: formPackage.name,
          });
        }

        const schemaExpression = js.common.parseExpression(`{
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
}${isTs ? "as const satisfies Schema" : ""}`);
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
      }
    }),
  );
}
