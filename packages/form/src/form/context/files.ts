import type { FormContext } from "./context.js";

export async function addFile<E>(
  ctx: FormContext<E>,
  signal: AbortSignal,
  data: DataTransfer,
  value: string
) {
  // TODO: cache this operation
  const { name, blob } = await ctx.dataUrlToBlob(signal, value);
  data.items.add(new File([blob], name, { type: blob.type }));
}

export function addFiles<E>(
  ctx: FormContext<E>,
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
