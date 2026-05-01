import { formPackage, svelteKitRfSubPath, svelteKitSubPath } from "meta";

import { neverError, createValidator, type Context } from "./model.js";
import {
  addToDemoPage,
  transforms,
  type NamedImportOptions,
  type NamespaceImportOptions,
} from "./sv-utils.js";

function createForm(ctx: Context): {
  formPackageImports: string[];
  additionalImports: (NamedImportOptions | NamespaceImportOptions)[];
  init: string;
  attributes: string;
} {
  const {
    options: { sveltekit },
  } = ctx;
  const validator = createValidator(ctx);
  if (sveltekit === "formActions") {
    return {
      formPackageImports: ["BasicForm"],
      additionalImports: [
        ...validator.imports,
        {
          imports: ["createMeta", "setupSvelteKitForm"],
          from: svelteKitSubPath("client"),
        },
        {
          imports: ["ActionData", "PageData"],
          from: "./$types",
          isType: true,
        },
      ],
      init: `const meta = createMeta<ActionData, PageData>().postForm;
const { form } = setupSvelteKitForm(meta, {
  ...defaults,${validator.sendSchema ? "" : validator.options}
  onSuccess: (result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  },
})`,
      attributes: 'method="POST"',
    };
  } else if (sveltekit === "remoteFunctions") {
    return {
      formPackageImports: ["BasicForm", "createForm"],
      additionalImports: [
        {
          imports: ["connect"],
          from: svelteKitRfSubPath("client"),
        },
        {
          imports: ["createPost", "getInitialData"],
          from: "./data.remote",
        },
      ],
      init: `const initData = await getInitialData();
const form = createForm(
  await connect(
    createPost.enhance(async ({ submit }) => {
      if (await submit()) {
        console.log(createPost.result);
        form.reset();
      }
    }),
    {
      ...defaults,${validator.options}
      ...initialData,
      fields: createPost.fields,
    },
  ),
)`,
      attributes: "",
    };
  } else if (sveltekit !== "no") {
    throw neverError(sveltekit, "unexpected sveltekit integration option");
  }
  return {
    formPackageImports: ["BasicForm", "createForm"],
    additionalImports: [],
    init: `const form = createForm({
  ...defaults,${validator.options}
  onSubmit: console.log,
})`,
    attributes: "",
  };
}

export function pageSvelte(ctx: Context) {
  const { sv, directory, language, isKit } = ctx;
  if (isKit) {
    sv.file(
      `${directory.kitRoutes}/demo/+page.svelte`,
      addToDemoPage("sjsf", language),
    );
  }

  sv.file(
    `${directory.kitRoutes}${isKit ? "/demo/sjsf/+page.svelte" : "sjsf.svelte"}`,
    transforms.svelteScript({ language }, ({ ast, js, svelte }) => {
      const form = createForm(ctx);

      js.imports.addNamed(ast.instance.content, {
        imports: form.formPackageImports,
        from: formPackage.name,
      });

      for (const i of form.additionalImports) {
        if ("as" in i) {
          js.imports.addNamespace(ast.instance.content, i);
        } else {
          js.imports.addNamed(ast.instance.content, i);
        }
      }

      js.common.appendFromString(ast.instance.content, { code: form.init });

      svelte.addFragment(ast, `<BasicForm {form} ${form.attributes}/>`);
    }),
  );
}
