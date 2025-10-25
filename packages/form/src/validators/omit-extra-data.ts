import {
  create,
  type Creatable,
  type FormValueValidator,
  type Validator,
  type ValidatorFactoryOptions,
} from "@/form/index.js";

import { omitExtraData } from "../omit-extra-data.js";

export function withOmitExtraData<
  V extends FormValueValidator<any> & Validator,
>(validator: Creatable<V, ValidatorFactoryOptions>) {
  return (options: ValidatorFactoryOptions): V => {
    const v = create(validator, options);
    return {
      ...v,
      validateFormValue(rootSchema, formValue) {
        const cleanData = omitExtraData(
          v,
          options.merger(),
          options.schema,
          formValue
        );
        return v.validateFormValue(rootSchema, cleanData);
      },
    };
  };
}
