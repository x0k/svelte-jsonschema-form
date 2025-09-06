import type { IdentifiableFieldElement, Schema, UiSchemaRoot, SchemaValue, ValidationError } from '@sjsf/form';

export const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';

export interface InitialFormData<T, E, SendSchema extends boolean> {
  initialValue: T | undefined;
  initialErrors: ValidationError<E>[];
  schema: SendSchema extends true ? Schema : undefined;
  uiSchema: SendSchema extends true ? UiSchemaRoot : undefined;
}

export interface ValidatedFormData<E, SendData extends boolean> {
  isValid: boolean;
  sendData?: SendData;
  data: SendData extends true ? SchemaValue | undefined : undefined;
  errors: ValidationError<E>[];
}

export const IDENTIFIABLE_INPUT_ELEMENTS: (keyof IdentifiableFieldElement)[] = [
  // NOTE: We use the value of `key-input` to infer new key value
  // 'key-input',
  'anyof',
  'oneof',
];
