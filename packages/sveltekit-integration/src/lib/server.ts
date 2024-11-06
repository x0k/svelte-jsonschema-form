import {
	DefaultFormMerger,
	type FormMerger,
	type FormValidator,
	type Schema,
	type SchemaValue,
	type ValidationError
} from '@sjsf/form';

import { JSON_CHUNKS_KEY } from './model';

export interface InitFormOptions<T, E, SendSchema extends boolean> {
	schema: Schema;
	validator: FormValidator<E>;
	sendSchema?: SendSchema;
	merger?: FormMerger;
	initialData?: T;
	/** @default true */
	computeDefaults?: boolean;
	/** @default false */
	performValidation?: boolean;
}

export interface InitialFormData<T, E, SendSchema extends boolean> {
	initialData: T | undefined;
	initialErrors: ValidationError<E>[];
	schema: SendSchema extends true ? Schema : undefined;
}

export function initForm<T, E, SendSchema extends boolean = false>({
	schema,
	validator,
	merger = new DefaultFormMerger(validator, schema),
	initialData,
	computeDefaults = true,
	performValidation = false,
	sendSchema
}: InitFormOptions<T, E, SendSchema>): InitialFormData<T, E, SendSchema> {
	const casted = initialData as SchemaValue | undefined;
	const defaultedData = computeDefaults
		? merger.mergeFormDataAndSchemaDefaults(casted, schema)
		: casted;
	const errors = performValidation ? validator.validateFormData(schema, defaultedData) : [];
	return {
		initialData: defaultedData as T | undefined,
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

export async function parseRequest(request: Request): Promise<SchemaValue | undefined> {
	const formData = await request.formData();
	return parseFormData(formData);
}

export interface ValidateFormOptions<E> {
	data: SchemaValue | undefined;
	schema: Schema;
	validator: FormValidator<E>;
}

export function validateForm<E>({ schema, validator, data }: ValidateFormOptions<E>) {
	const errors = validator.validateFormData(schema, data);
	return {
		isValid: errors.length === 0,
		data,
		errors
	};
}
