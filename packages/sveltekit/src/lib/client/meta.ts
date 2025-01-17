/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AnyKey } from '@sjsf/form/lib/types';
import type { SchemaValue } from '@sjsf/form';

import type { ValidatedFormData, InitialFormData } from '../model.js';

export type SvelteKitFormMeta<
  ActionData,
  PageData,
  Name extends FormNameFromActionDataUnion<ActionData>,
  FallbackValue,
  VFD = ValidatedFormDataFromActionDataUnion<ActionData, Name>,
  IFD = InitialFromDataFromPageData<PageData, Name>
> = {
  name: Name;
  __actionData: ActionData;
  __pageData: PageData;
  __fallbackValue: FallbackValue;
  __validationFormData: VFD;
  __initialFormData: IFD;
  __formValue: FormValueFromInitialFormData<IFD, FallbackValue>;
  __validationError: ValidatorErrorFromValidatedFormData<VFD>;
  __sendSchema: SendSchemaFromInitialFormData<IFD>;
  __sendData: SendDataFromValidatedFormData<VFD>;
};

export function createMeta<
  ActionData,
  PageData,
  N extends FormNameFromActionDataUnion<ActionData>,
  FallbackValue = SchemaValue
>(name: N): SvelteKitFormMeta<ActionData, PageData, N, FallbackValue> {
  return { name } as SvelteKitFormMeta<ActionData, PageData, N, FallbackValue>;
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

type InitialFromDataFromPageData<PageData, FormName extends AnyKey> =
  PageData[keyof PageData & FormName] extends InitialFormData<any, any, any>
    ? PageData[keyof PageData & FormName]
    : InitialFormData<never, never, false>;

type FormValueFromInitialFormData<IFD, FallbackValue> =
  IFD extends InitialFormData<infer T, any, any>
    ? unknown extends T
      ? FallbackValue
      : T
    : FallbackValue;

type SendDataFromValidatedFormData<VFD> =
  VFD extends ValidatedFormData<any, infer SendData> ? SendData : false;

type SendSchemaFromInitialFormData<IFD> =
  IFD extends InitialFormData<any, any, infer SendSchema> ? SendSchema : false;
