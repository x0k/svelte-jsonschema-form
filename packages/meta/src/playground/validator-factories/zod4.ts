import { create } from "@sjsf/form";
import { adaptAsync } from "@sjsf/zod4-validator/classic";

import type { ValidatorFactory } from "../validator-factory.ts";

export default ((options) => async (zodSchema) => {
  const { schema, validator } = adaptAsync(
    zodSchema as Parameters<typeof adaptAsync>[0]
  );
  return { schema, validator: create(validator, options) };
}) as ValidatorFactory;
