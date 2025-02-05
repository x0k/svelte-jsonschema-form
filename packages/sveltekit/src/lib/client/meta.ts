/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyKey } from '@sjsf/form/lib/types';
import type { SchemaValue } from '@sjsf/form';

import type { ValidatedFormData, InitialFormData } from '../model.js';

export interface SvelteKitFormMeta<
  ActionData,
  PageData,
  Name extends FormNameFromActionDataUnion<ActionData>,
  FallbackValue,
  IFD = InitialFromDataFromPageData<PageData, Name>,
  VFD = ValidatedFormDataFromActionDataUnion<ActionData, Name>
> {
  name: Name;
  __actionData: ActionData;
  __pageData: PageData;
  __formValue: FormValueFromInitialFormData<IFD, FallbackValue>;
  __validationError: ValidatorErrorFromValidatedFormData<VFD>;
  __sendSchema: SendSchemaFromInitialFormData<IFD>;
  __sendData: SendDataFromValidatedFormData<VFD>;
}

export function createMeta<
  ActionData,
  PageData,
  Name extends FormNameFromActionDataUnion<ActionData>,
  FallbackValue = SchemaValue
>(name: Name) {
  return { name } as SvelteKitFormMeta<ActionData, PageData, Name, FallbackValue>;
}

type FormNameFromActionDataBranch<ActionData> = keyof {
  [K in keyof ActionData]: ActionData[K] extends ValidatedFormData<any, any> ? K : never;
};

type FormNameFromActionDataUnion<ActionData> = ActionData extends any
  ? FormNameFromActionDataBranch<ActionData>
  : never;

type ValidatedFormDataFromActionDataBranch<ActionData, FormName extends keyof ActionData> =
  ActionData[FormName] extends ValidatedFormData<any, any> ? ActionData[FormName] : never;

type ValidatedFormDataFromActionDataUnion<
  ActionData,
  FormName extends keyof ActionData
> = ActionData extends any ? ValidatedFormDataFromActionDataBranch<ActionData, FormName> : never;

type ValidatorErrorFromValidatedFormData<VFD> =
  VFD extends ValidatedFormData<infer E, any> ? E : never;

type InitialFromDataFromPageData<PageData, FormName extends AnyKey> = PageData extends {
  [K in FormName]: InitialFormData<any, any, any>;
}
  ? PageData[FormName]
  : unknown

type FormValueFromInitialFormData<IFD, FallbackValue> = unknown extends IFD
  ? FallbackValue
  : IFD extends InitialFormData<infer T, any, any>
    ? T
    : never;

type SendDataFromValidatedFormData<VFD> =
  VFD extends ValidatedFormData<any, infer SendData> ? SendData : false;

type SendSchemaFromInitialFormData<IFD> =
  IFD extends InitialFormData<any, any, infer SendSchema> ? SendSchema : false;
