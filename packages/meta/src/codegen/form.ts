import { neverError } from "../errors.ts";
import { svelteKitRfSubPath, svelteKitSubPath } from "../sveltekit.ts";

import type { NamedImportOptions, NamespaceImportOptions } from "./lib.ts";
import type { CodegenSvelteKitIntegration } from "./model.ts";
import { createValidator, type ValidatorOptions } from "./validator.ts";

export interface FormOptions extends ValidatorOptions {
  sveltekit: CodegenSvelteKitIntegration;
}

export function createForm(ctx: FormOptions): {
  formPackageImports: string[];
  additionalImports: (NamedImportOptions | NamespaceImportOptions)[];
  init: string;
  attributes: string;
} {
  const { sveltekit, isTs } = ctx;
  const validator = createValidator(ctx);
  const validatorOptionsWithoutSchema = validator.options.replace(
    // Remove the `schema` property (e.g. `schema: post.schema,`) when the schema
    // is already provided via SvelteKit meta/initialData.
    // The `\S+` ensures we match the full value, avoiding false matches inside `adapt()`.
    /\bschema\s*:\s*\S+\s*,?\s*/,
    "",
  );
  const isInputTypeRequired = isTs && !validator.schemaValidator;
  const inputType = isInputTypeRequired ? `<${validator.inputType}>` : "";
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
  ${validatorOptionsWithoutSchema}
})`,
      attributes: 'method="POST"',
    };
  } else if (sveltekit === "remoteFunctions") {
    return {
      formPackageImports: ["BasicForm", "createForm"],
      additionalImports: [
        ...validator.imports,
        ...(isInputTypeRequired ? validator.schemaImports : []),
        {
          imports: ["connect"],
          from: svelteKitRfSubPath("client"),
        },
        {
          imports: ["createPost", "getInitialData"],
          from: "./data.remote",
        },
      ],
      init: `const initialData = await getInitialData();
const form = createForm${inputType}(
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
      ${validatorOptionsWithoutSchema}
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
    additionalImports: validator.imports.concat(validator.schemaImports),
    init: `const form = createForm${inputType}({
  ...defaults,
  onSubmit: console.log,
  ${validator.options}
})`,
    attributes: "",
  };
}
