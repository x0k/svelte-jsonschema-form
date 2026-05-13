import {
  fragmentSchema,
  fromValidators,
} from "@sjsf/form/validators/precompile";
import standaloneCode from "ajv/dist/standalone/index.js";
import { Ajv } from "ajv";
import {
  formValueValidatorTests,
  importModule,
  validatorTests,
  createPrecompiledValidatorFactory,
} from "validator-testing";
import { build } from "esbuild";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "../model.js";
import {
  createFormValidatorFactory,
  type ValidateFunctions,
} from "./validator.js";

const createFormValidator = createPrecompiledValidatorFactory(
  async (options) => {
    const schemas = fragmentSchema(options.patch);
    const ajv = new Ajv({
      ...DEFAULT_AJV_CONFIG,
      schemas,
      code: {
        source: true,
        esm: true,
      },
    });
    const modules =
      // @ts-expect-error incompatible module resolution strategy
      standaloneCode(addFormComponents(ajv));

    // https://github.com/ajv-validator/ajv/issues/2209#issuecomment-2580172967
    const { outputFiles } = await build({
      minify: true,
      bundle: true,
      write: false,
      format: "esm",
      platform: "browser",
      target: ["es2020"],
      sourcemap: false,
      stdin: {
        contents: modules,
        resolveDir: process.cwd(),
        sourcefile: "input.js",
        loader: "js",
      },
    });
    const code = outputFiles[0]!.text;

    const validateFunctions = await importModule<ValidateFunctions>(code);
    const factory = createFormValidatorFactory({
      validatorRetriever: fromValidators(validateFunctions),
    });
    return factory(options);
  },
);

validatorTests(createFormValidator);
formValueValidatorTests(createFormValidator);
