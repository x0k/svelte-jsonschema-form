import {
  formPackage,
  svelteKitRfSubPath,
  svelteKitSubPath,
  type NonLegacyThemeOrSubTheme,
} from "meta";

import { neverError, createValidator, type Context } from "./model.js";
import {
  addToDemoPage,
  importsAddNamed,
  transforms,
  type NamedImportOptions,
  type NamespaceImportOptions,
} from "./sv-utils.js";

const PADDED_THEMES: NonLegacyThemeOrSubTheme[] = [
  "pico",
  "daisyui5",
  "flowbite3",
  "skeleton4",
  "shadcn4",
  "shadcn-extras",
  "beercss",
];

export function pageSvelte(ctx: Context) {
  const {
    sv,
    directory,
    language,
    isKit,
    lib,
    options: { themeOrSubTheme },
  } = ctx;
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

      importsAddNamed(ast.instance.content, {
        imports: form.formPackageImports,
        from: formPackage.name,
      });

      for (const i of form.additionalImports) {
        if ("as" in i) {
          js.imports.addNamespace(ast.instance.content, i);
        } else {
          importsAddNamed(ast.instance.content, i);
        }
      }

      js.imports.addNamespace(ast.instance.content, {
        as: "defaults",
        from: lib("sjsf/defaults"),
      });

      js.common.appendFromString(ast.instance.content, { code: form.init });

      if (PADDED_THEMES.includes(themeOrSubTheme)) {
        form.attributes += ' style="padding: 2rem;"';
      }

      svelte.addFragment(
        ast,
        `<BasicForm {form} novalidate ${form.attributes}/>`,
      );
    }),
  );
}

function createForm(ctx: Context): {
  formPackageImports: string[];
  additionalImports: (NamedImportOptions | NamespaceImportOptions)[];
  init: string;
  attributes: string;
} {
  const {
    options: { sveltekit },
    ts,
  } = ctx;
  const validator = createValidator(ctx);
  // const addOptions = sveltekit === "no" || validator.sendSchema === false;
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
  ...defaults,
  onSuccess: (result) => {
    if (result.type === "success") {
      console.log(result.data?.post);
    }
  },
  ${validator.sendSchema ? "" : validator.options}
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
      ...defaults,
      ...initialData,
      fields: createPost.fields,
      ${validator.options}
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
    additionalImports: validator.imports,
    init: `const form = createForm${ts(`<${validator.inputType}>`)}({
  ...defaults,
  onSubmit: console.log,
  ${validator.options}
})`,
    attributes: "",
  };
}
