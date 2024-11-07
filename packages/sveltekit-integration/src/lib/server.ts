import {
	DefaultFormMerger,
	type FormMerger,
	type FormValidator,
	type Schema,
	type SchemaValue
} from '@sjsf/form';

import { JSON_CHUNKS_KEY, type InitialFormData, type ValidatedFormData } from './model';

export interface InitFormOptions<T, E, SendSchema extends boolean> {
	schema: Schema;
	validator: FormValidator<E>;
	sendSchema?: SendSchema;
	merger?: FormMerger;
	initialValue?: T;
	/** @default true */
	computeDefaults?: boolean;
	/** @default false */
	performValidation?: boolean;
}

export function initForm<T, E, SendSchema extends boolean = false>({
	schema,
	validator,
	merger = new DefaultFormMerger(validator, schema),
	initialValue,
	computeDefaults = true,
	performValidation = false,
	sendSchema
}: InitFormOptions<T, E, SendSchema>): InitialFormData<T, E, SendSchema> {
	const defaultedData = computeDefaults
		? merger.mergeFormDataAndSchemaDefaults(initialValue as SchemaValue | undefined, schema)
		: (initialValue as SchemaValue | undefined);
	const errors = performValidation ? validator.validateFormData(schema, defaultedData) : [];
	return {
		initialValue: defaultedData as T | undefined,
		initialErrors: errors,
		schema: (sendSchema ? schema : undefined) as SendSchema extends true ? Schema : undefined
	};
}

export function parseFormData(formData: FormData): SchemaValue | undefined {
	if (formData.get(JSON_CHUNKS_KEY)) {
		const chunks = formData.getAll(JSON_CHUNKS_KEY).join('');
		return JSON.parse(chunks);
	}
	return undefined;
}

export interface ValidateFormOptions<E> {
	data: SchemaValue | undefined;
	schema: Schema;
	validator: FormValidator<E>;
}

export function validateForm<E>({
	schema,
	validator,
	data
}: ValidateFormOptions<E>): ValidatedFormData<E> {
	const errors = validator.validateFormData(schema, data);
	return {
		isValid: errors.length === 0,
		data,
		errors
	};
}
