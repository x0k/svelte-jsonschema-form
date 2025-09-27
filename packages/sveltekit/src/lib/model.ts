import type {
  FormOptions,
  IdentifiableFieldElement,
  Schema,
  SchemaValue,
  UiSchemaRoot,
  ValidationError
} from '@sjsf/form';

export const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';
export const FORM_DATA_FILE_PREFIX = '__sjsf_sveltekit_file__';

type SerializablePrimitive = string | number | boolean | null | undefined | bigint;

type SerializableSpecial =
  | Date
  | RegExp
  | Map<Serializable, Serializable>
  | Set<Serializable>
  | URL
  | URLSearchParams;

type Serializable =
  | SerializablePrimitive
  | SerializableSpecial
  | Serializable[]
  | { [key: string | number]: Serializable };

type OptionalKeys<T> = {
  [K in keyof T]-?: undefined extends T[K] ? K : never;
}[keyof T];

type SerializableKeys<T> = {
  [K in keyof T]: NonNullable<T[K]> extends Serializable ? K : never;
}[keyof T];

type PickOptionalSerializable<T> = Pick<T, Extract<OptionalKeys<T>, SerializableKeys<T>>>;

export type SerializableOptionalFormOptions<T> = PickOptionalSerializable<FormOptions<T>>;

export type InitialFormData<T, SendSchema extends boolean> = SerializableOptionalFormOptions<T> & {
  schema: SendSchema extends true ? Schema : undefined;
  initialErrors?: ValidationError[];
  uiSchema?: UiSchemaRoot;
};

export interface ValidatedFormData<SendData extends boolean> {
  isValid: boolean;
  sendData?: SendData;
  data: SendData extends true ? SchemaValue | undefined : undefined;
  errors: ValidationError[];
}

export const IDENTIFIABLE_INPUT_ELEMENTS: (keyof IdentifiableFieldElement)[] = [
  // NOTE: We use the value of `key-input` to infer new key value
  // 'key-input',
  'anyof',
  'oneof'
];
