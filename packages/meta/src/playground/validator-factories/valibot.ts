import { create } from "@sjsf/form";
import { adaptAsync } from "@sjsf/valibot-validator";

import type { ValidatorFactory } from "../validator-factory.ts";

export default ((options) => async (valibotSchema) => {
  const { schema, validator } = adaptAsync(
    valibotSchema as Parameters<typeof adaptAsync>[0]
  );
  return { schema, validator: create(validator, options) };
}) as ValidatorFactory;
