import type { FormValue, Schema } from "@sjsf/form";

export interface MergerPageState {
  schema: Schema;
  deep: boolean;
  intersectJson: boolean;
  deduplicateJsonSchemas: boolean;
  output: Schema | FormValue;
}
