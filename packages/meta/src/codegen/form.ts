import type { DeepPartial } from "@sjsf/form/lib/types";
import { isRecordEmpty } from "@sjsf/form/lib/object";

import { neverError } from "../errors.ts";
import { svelteKitRfSubPath, svelteKitSubPath } from "../sveltekit.ts";

import type { NamedImportOptions, NamespaceImportOptions } from "./lib.ts";
import type { CodegenSvelteKitIntegration } from "./model.ts";
import { validatorProp, type ValidatorDefinition } from "./validator.ts";
import type { MergerOptions } from "./defaults.ts";
import { formMergerSubPath } from "../form.ts";
import { internalValidatorSubPath } from "../validators.ts";

export interface FormOptions {
  isTs: boolean;
  modelName: string;
  sveltekit: CodegenSvelteKitIntegration;
  disabled: boolean;
  validator: ValidatorDefinition;
  merger: DeepPartial<MergerOptions>;
  omitExtraData: boolean;
}

export interface FormDefinition {
  formPackageImports: string[];
  additionalImports: (NamedImportOptions | NamespaceImportOptions)[];
  init: string;
  attributes: string;
}

function buildMergerConfigFields(config: DeepPartial<MergerOptions>): string {
  const fields: string[] = [];
  if (config.allOf !== undefined) {
    fields.push(`allOf: "${config.allOf}"`);
  }
  if (config.arrayMinItems !== undefined) {
    const arrayMinItems: string[] = [];
    if (config.arrayMinItems.populate !== undefined) {
      arrayMinItems.push(`populate: "${config.arrayMinItems.populate}"`);
    }
    if (config.arrayMinItems.mergeExtraDefaults !== undefined) {
      arrayMinItems.push(
        `mergeExtraDefaults: ${config.arrayMinItems.mergeExtraDefaults}`,
      );
    }
    fields.push(`arrayMinItems: { ${arrayMinItems.join(", ")} }`);
  }
  if (config.constAsDefaults !== undefined) {
    fields.push(`constAsDefaults: "${config.constAsDefaults}"`);
  }
  if (config.emptyObjectFields !== undefined) {
    fields.push(`emptyObjectFields: "${config.emptyObjectFields}"`);
  }
  if (config.mergeDefaultsIntoFormData !== undefined) {
    fields.push(
      `mergeDefaultsIntoFormData: "${config.mergeDefaultsIntoFormData}"`,
    );
  }
  return fields.join(",\n    ");
}

export function createForm({
  sveltekit,
  isTs,
  disabled,
  modelName,
  validator,
  merger,
  omitExtraData,
}: FormOptions): FormDefinition {
  const validatorProps = validatorProp(validator);
  const isInputTypeRequired = isTs && !validator.canInferFormType;
  const inputType = isInputTypeRequired ? `<${modelName}.Model>` : "";

  const additionalImports: (NamedImportOptions | NamespaceImportOptions)[] = [];
  const pageOverrideLines: string[] = [];

  if (!isRecordEmpty(merger)) {
    additionalImports.push({
      imports: ["createFormMerger"],
      from: formMergerSubPath("modern"),
    });
    const fields = buildMergerConfigFields(merger);
    pageOverrideLines.push(
      `merger: (options) => createFormMerger({\n    ...options,\n    ${fields}\n  }),`,
    );
  }

  if (omitExtraData) {
    additionalImports.push({
      imports: ["withOmitExtraData"],
      from: internalValidatorSubPath("omit-extra-data"),
    });
    pageOverrideLines.push(`validator: withOmitExtraData(defaults.validator),`);
  }

  const bodyLines: string[] = [];
  if (pageOverrideLines.length > 0) {
    bodyLines.push(...pageOverrideLines);
  }
  if (validatorProps.length > 0) {
    bodyLines.push(validatorProps);
  }
  const bodyBlock = bodyLines.map((l) => `  ${l}`).join("\n");

  if (sveltekit === "formActions") {
    return {
      formPackageImports: ["BasicForm"],
      additionalImports: [
        ...validator.imports,
        ...additionalImports,
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
${bodyBlock}
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
        ...validator.imports,
        ...additionalImports,
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
${bodyBlock}
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
    additionalImports: validator.imports
      .concat(validator.schemaImports)
      .concat(additionalImports),
    init: `const form = createForm${inputType}({
  ...defaults,
  ...${modelName},
${bodyBlock}
  onSubmit: console.log,
  ${disabled !== false ? `disabled: ${disabled},\n  ` : ""}
})`,
    attributes: "",
  };
}
