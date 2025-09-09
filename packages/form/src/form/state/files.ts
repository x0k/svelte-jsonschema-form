import type { Validator } from "@/core/index.js";

import { FORM_DATA_URL_TO_BLOB } from "../internals.js";
import type { FormState } from "./state.js";

export async function addFile<T, V extends Validator>(
  ctx: FormState<T, V>,
  signal: AbortSignal,
  data: DataTransfer,
  value: string
) {
  // TODO: cache this operation
  const { name, blob } = await ctx[FORM_DATA_URL_TO_BLOB](signal, value);
  data.items.add(new File([blob], name, { type: blob.type }));
}

export function addFiles<T, V extends Validator>(
  ctx: FormState<T, V>,
  signal: AbortSignal,
  data: DataTransfer,
  values: string[]
) {
  const promises: Promise<void>[] = [];
  for (const value of values) {
    promises.push(addFile(ctx, signal, data, value));
  }
  return Promise.all(promises);
}
