import {
  create,
  isAsyncFormValueValidator,
  isFormValueValidator,
  type AsyncFormValueValidator,
  type Creatable,
  type FormValidator,
  type FormValueValidator,
  type ValidatorFactoryOptions,
} from "@/form/index.js";

import { omitExtraData } from "../omit-extra-data.js";

export function withOmitExtraData<V extends FormValidator<any>>(
  validator: Creatable<V, ValidatorFactoryOptions>
) {
  return (options: ValidatorFactoryOptions): V => {
    const v = create(validator, options);
    if (isAsyncFormValueValidator(v)) {
      return {
        ...v,
        validateFormValueAsync(signal, formValue) {
          const cleanData = omitExtraData(
            v,
            options.merger(),
            options.schema,
            formValue
          );
          return v.validateFormValueAsync(signal, cleanData);
        },
      } satisfies AsyncFormValueValidator<any>;
    }
    if (isFormValueValidator(v)) {
      return {
        ...v,
        validateFormValue(formValue) {
          const cleanData = omitExtraData(
            v,
            options.merger(),
            options.schema,
            formValue
          );
          return v.validateFormValue(cleanData);
        },
      } satisfies FormValueValidator<any>;
    }
    return v;
  };
}
