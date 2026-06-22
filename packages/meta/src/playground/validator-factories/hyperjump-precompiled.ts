import {
  registerSchema,
  unregisterSchema,
  type SchemaObject,
} from "@hyperjump/json-schema/draft-07";
import {
  getSchema,
  Validation,
  type AST,
} from "@hyperjump/json-schema/experimental";
import { localization } from "@sjsf-lab/hyperjump-validator/localizations/en-us";
import {
  fromAst,
  createFormValidatorFactory as hyperjumpFactory,
} from "@sjsf-lab/hyperjump-validator/precompile";
import { type Schema } from "@sjsf/form";

import { DRAFT_07 } from "../validator-factory.ts";
import type { CompileValidator } from "../validator-factory.ts";

export const createIdFactory = () => {
  let id = 0;
  return () => `https://example.com/v${id++}`;
};

export const draft07: CompileValidator = async (schemas: Schema[]) => {
  for (const schema of schemas) {
    registerSchema({
      ...DRAFT_07,
      ...schema,
    } as SchemaObject);
  }
  try {
    const ast = { metaData: {}, plugins: new Set() } as unknown as AST;
    for (const schema of schemas) {
      const s = await getSchema(schema.$id!);
      await Validation.compile(s, ast, s);
    }
    return hyperjumpFactory({
      localization,
      validatorRetriever: fromAst(ast),
    });
  } finally {
    for (const s of schemas) {
      unregisterSchema(s.$id!);
    }
  }
};
