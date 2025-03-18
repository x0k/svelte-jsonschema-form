import type { ZodSchema } from "zod";
import type { Schema, UiSchemaRoot, Config } from "@sjsf/form";
import type { Validator } from "@sjsf/zod-validator";

interface ValidatorOptions<Async extends boolean> {
  async: Async;
  schema: ZodSchema;
  /** @default {} */
  uiSchema?: UiSchemaRoot;
  /** @default DEFAULT_ID_PREFIX */
  idPrefix?: string;
  /** @default DEFAULT_ID_SEPARATOR */
  idSeparator?: string;
  /** @default makeZodSchemaFactory() */
  zodSchemaFactory?: (schema: Schema, rootSchema: Schema) => ZodSchema;
  /** @default makeFieldZodSchemaFactory() */
  fieldZodSchemaFactory?: (config: Config) => ZodSchema;
}

type ValidatorFactoryOptions<Async extends boolean> = Omit<
  ValidatorOptions<Async>,
  "async"
> & {
  /** @default false */
  async?: Async;
};

function createValidator<Async extends boolean = false>(
  options?: ValidatorFactoryOptions<Async>
): Validator<Async>;
