import type { FormContext } from '../context';
import type { InputAttributes } from '../ui-schema';

export function isDisabledOrReadonly(
  ctx: FormContext<unknown>,
  attributes: InputAttributes | undefined
) {
  return (
    attributes?.disabled || attributes?.readonly || ctx.disabled || ctx.readonly
  );
}