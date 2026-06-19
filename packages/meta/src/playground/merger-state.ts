import type { FormValue, Schema } from "@sjsf/form";

// NOTE: We use legacy types in combination with `| string`
// to maintain compatibility with old URLs.
// TODO: This should be removed in v4.
export interface MergerState {
  schema: Schema | string;
  deep: boolean;
  intersectJson: boolean;
  deduplicateJsonSchemas: boolean;
  output: Schema | FormValue | string;
}
