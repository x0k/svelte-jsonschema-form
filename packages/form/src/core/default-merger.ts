import mergeAllOf, { type Options } from "json-schema-merge-allof";

import type { Merger } from "./merger.js";
import type { Schema, SchemaValue } from "./schema.js";
import type { Validator } from "./validator.js";
import { getDefaultFormState2 } from "./default-state.js";

export class DefaultMerger implements Merger {
  constructor(
    protected readonly validator: Validator,
    protected readonly rootSchema: Schema
  ) {}

  mergeAllOf(schema: Schema): Schema {
    return mergeAllOf(schema, {
      deep: false,
    } as Options) as Schema;
  }

  mergeFormDataAndSchemaDefaults(
    formData: SchemaValue | undefined,
    schema: Schema
  ): SchemaValue | undefined {
    return getDefaultFormState2(
      this.validator,
      this,
      schema,
      formData,
      this.rootSchema
    );
  }
}
