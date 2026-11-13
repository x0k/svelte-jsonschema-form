import { createCoreContext } from "#core/index.js";
import {
  create,
  isAsyncFormValueValidator,
  isFormValueValidator,
  type AsyncFormValueValidator,
  type Creatable,
  type FormValidator,
  type FormValueValidator,
  type ValidatorFactoryOptions,
} from "#form/index.js";

import { omitExtraData } from "../omit-extra-data.js";

export function withOmitExtraData<V extends FormValidator<any>>(
  validator: Creatable<V, ValidatorFactoryOptions>
) {
  return (options: ValidatorFactoryOptions): V => {
    const v = create(validator, options);
    const createContext = () =>
      createCoreContext({
        validator: v,
        merger: options.merger(),
        rootSchema: options.schema,
      });
    if (isAsyncFormValueValidator(v)) {
      return {
        ...v,
        validateFormValueAsync(signal, formValue) {
          const cleanData = omitExtraData(createContext(), formValue);
          return v.validateFormValueAsync(signal, cleanData);
        },
      } satisfies AsyncFormValueValidator<any>;
    }
    if (isFormValueValidator(v)) {
      return {
        ...v,
        validateFormValue(formValue) {
          const cleanData = omitExtraData(createContext(), formValue);
          return v.validateFormValue(cleanData);
        },
      } satisfies FormValueValidator<any>;
    }
    return v;
  };
}
