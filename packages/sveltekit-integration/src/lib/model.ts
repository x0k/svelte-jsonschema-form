import type { Schema, SchemaValue, ValidationError } from '@sjsf/form';

export const JSON_CHUNKS_KEY = '__sjsf_sveltekit_json_chunks';

export interface InitialFormData<T, E, SendSchema extends boolean> {
	initialValue: T | undefined;
	initialErrors: ValidationError<E>[];
	schema: SendSchema extends true ? Schema : undefined;
}

export interface ValidatedFormData<E> {
	isValid: boolean
	data: SchemaValue | undefined
	errors: ValidationError<E>[]
}
