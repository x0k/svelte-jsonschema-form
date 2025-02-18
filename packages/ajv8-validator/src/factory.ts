import { type Options, Ajv } from "ajv";

import { addFormComponents, DEFAULT_AJV_CONFIG } from "./model.js";
import {
  AsyncValidator,
  Validator,
  type AsyncValidatorOptions,
  type ValidatorOptions,
} from "./validator-old.js";

export type FactoryOptions<O> = Omit<O, "ajv"> & {
  ajvOptions?: Options;
  ajv?: Ajv;
};

export function createValidator({
  ajvOptions = DEFAULT_AJV_CONFIG,
  ajv = addFormComponents(new Ajv(ajvOptions)),
  ...rest
}: FactoryOptions<ValidatorOptions> = {}) {
  return new Validator({
    ajv,
    ...rest,
  });
}

export function createAsyncValidator({
  ajvOptions = DEFAULT_AJV_CONFIG,
  ajv = addFormComponents(new Ajv(ajvOptions)),
  ...rest
}: FactoryOptions<AsyncValidatorOptions> = {}) {
  return new AsyncValidator({
    ajv,
    ...rest,
  });
}
