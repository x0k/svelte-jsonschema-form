import { sveltekitPackage, svelteKitSubPath, svelteKitRfSubPath } from "meta";

import { createValidator, type Context } from "./model.js";
import { renderImports, transforms } from "./sv-utils.js";

export function sveltekitTs(ctx: Context) {
  const {
    file,
    isKit,
    options: { sveltekit },
    directory,
    language,
    sv,
    ts,
    isTs,
    lib,
  } = ctx;
  if (!isKit || sveltekit === "no") {
    return;
  }

  const validator = createValidator(ctx);
  const validatorImports = renderImports(
    validator.imports.concat(validator.schemaImports),
  );

  const setup = (
    {
      formActions: {
        filename: `+page.server`,
        code: `${ts(`import type { Actions } from "@sveltejs/kit";
import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createAction } from "${svelteKitSubPath("server")}";
${validatorImports};
import * as defaults from "${lib("sjsf/defaults")}";

export const load = async () => {
  return {
    postForm: {
      ${!validator.schemaValidator ? "schema," : ""}
      initialValue: { title: "New post", content: "" },
    }${ts(` satisfies InitialFormData<${validator.inputType}>`)},
  };
};

export const actions = {
  default: createAction(
    {
      ...defaults,
      name: "postForm",
      sendData: true,
      ${validator.options}
    },
    (data${isTs && !validator.schemaValidator ? `: ${validator.inputType}` : ""}) => {
      console.log(data)
      return { post: { ...data, id: "new-post" } };
    },
  ),
}${ts(" satisfies Actions")};
`,
      },
      remoteFunctions: {
        filename: `data.remote`,
        code: `${ts(`import type { InitialFormData } from "${sveltekitPackage.name}";\n`)}import { createServerValidator } from "${svelteKitRfSubPath("server")}";

import { form, query } from "$app/server";
${validatorImports};
import * as defaults from "${lib("sjsf/defaults")}";

export const getInitialData = query(async () => {
  return {
    ${!validator.schemaValidator ? "schema, " : ""}
    initialValue: { title: "New post", content: "" },
  }${ts(` satisfies InitialFormData<${validator.inputType}>`)};
});

export const createPost = form(
  createServerValidator${isTs && !validator.schemaValidator ? `<${validator.inputType}>` : ""}({
    ...defaults,
    ${validator.options}
  }),
  ({ data }) => {
    console.log(data);
    return { ...data, id: "new-post" };
  },
);
`,
      },
    } satisfies Record<typeof sveltekit, { filename: string; code: string }>
  )[sveltekit];

  sv.file(
    `${directory.kitRoutes}/demo/sjsf/${setup.filename}.${language}`,
    transforms.script(({ ast, comments, js }) => {
      js.common.appendFromString(ast, {
        comments,
        code: setup.code,
      });
    }),
  );

  if (sveltekit === "remoteFunctions") {
    sv.file(
      file.viteConfig,
      transforms.script(({ ast, js, comments }) => {
        const viteConfig = js.vite.getConfig(ast);

        const optimizeDeps = js.vite.configProperty(ast, viteConfig, {
          name: "optimizeDeps",
          fallback: js.object.create({}),
        });

        let exclude = js.object.property(optimizeDeps, {
          name: "exclude",
          fallback: js.array.create(),
        });

        if (exclude.type !== "ArrayExpression") {
          const prev = exclude;
          exclude = js.array.create();
          js.array.append(exclude, prev);
          js.object.overrideProperties(optimizeDeps, {
            exclude,
          });
        }

        comments.add(exclude, {
          type: "Line",
          value: " https://github.com/sveltejs/kit/issues/14788",
        });

        js.array.append(exclude, "@sjsf/form");
        js.array.append(exclude, "@sjsf/sveltekit/rf/client");
      }),
    );

    sv.file(
      file.svelteConfig,
      transforms.script(({ ast, js }) => {
        const { value: svelteConfig } = js.exports.createDefault(ast, {
          fallback: js.object.create({}),
        });
        js.object.overrideProperties(svelteConfig, {
          compilerOptions: {
            experimental: {
              async: true,
            },
          },
          kit: {
            experimental: {
              remoteFunctions: true,
            },
          },
        });
      }),
    );
  }
}
