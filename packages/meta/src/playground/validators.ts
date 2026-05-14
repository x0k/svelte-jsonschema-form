import {
  isJsonSchemaValidator,
  isPrecompiledOnlyValidator,
  validators,
} from "../validators.ts";

function* playgroundValidators() {
  for (const v of validators()) {
    if (!isJsonSchemaValidator(v) || isPrecompiledOnlyValidator(v)) {
      continue;
    }
    yield v;
    yield `${v}_2020` as const;
  }
}
const PLAYGROUND_VALIDATORS = Array.from(playgroundValidators());

export type PlaygroundValidator = (typeof PLAYGROUND_VALIDATORS)[number];
