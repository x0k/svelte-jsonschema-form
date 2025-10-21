/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Schema, SchemaValue } from '@sjsf/form';

import type { ValidatedFormData, InitialFormData } from '../model.js';

export interface SvelteKitFormMeta<
  ActionData,
  PageData,
  Name extends FormNameFromActionDataUnion<ActionData>,
  FallbackValue,
  IFD = InitialFromDataFromPageData<PageData, Name>
> {
  name: Name;
  __actionData: ActionData;
  __pageData: PageData;
  __formValue: FormValueFromInitialFormData<IFD, FallbackValue>;
  __sendSchema: SendSchemaFromInitialFormData<IFD>;
}

const proxy = new Proxy(
  {},
  {
    get(_, name) {
      return { name };
    }
  }
);

export function createMeta<ActionData, PageData, FallbackValue = SchemaValue>() {
  return proxy as {
    [K in FormNameFromActionDataUnion<ActionData>]: SvelteKitFormMeta<
      ActionData,
      PageData,
      K,
      FallbackValue
    >;
  };
}

type FormNameFromActionDataBranch<ActionData> = keyof {
  [K in keyof ActionData]: ActionData[K] extends ValidatedFormData ? K : never;
};

type FormNameFromActionDataUnion<ActionData> = ActionData extends any
  ? FormNameFromActionDataBranch<ActionData>
  : never;

type InitialFromDataFromPageData<PageData, FormName extends PropertyKey> = PageData extends {
  [K in FormName]: InitialFormData<any>;
}
  ? PageData[FormName]
  : unknown;

type FormValueFromInitialFormData<IFD, FallbackValue> = unknown extends IFD
  ? FallbackValue
  : IFD extends InitialFormData<infer T>
    ? T
    : never;

type SendSchemaFromInitialFormData<IFD> = IFD extends { schema: Schema } ? true : false;
