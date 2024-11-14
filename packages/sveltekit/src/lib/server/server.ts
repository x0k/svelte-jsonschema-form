import { fileToDataURL } from '@sjsf/form/lib/file';
import { defaultMerger, type Merger2, type Validator } from '@sjsf/form/core';
import {
	DEFAULT_ID_PREFIX,
	DEFAULT_ID_SEPARATOR,
	DEFAULT_PSEUDO_ID_SEPARATOR,
	type FormValidator,
	type Schema,
	type SchemaValue,
	type UiSchemaRoot
} from '@sjsf/form';

import { JSON_CHUNKS_KEY, type InitialFormData, type ValidatedFormData } from '../model';

import type { Entry } from './entry';
import { parseSchemaValue } from './schema-value-parser';
import { makeFormDataEntriesConverter } from './convert-form-data-entries';

export interface InitFormOptions<T, E, SendSchema extends boolean> {
	schema: Schema;
	validator: FormValidator<E>;
	sendSchema?: SendSchema;
	initialValue?: T;
	/** @default false */
	performValidation?: boolean;
}

export function initForm<T, E, SendSchema extends boolean = false>({
	schema,
	validator,
	initialValue,
	performValidation = false,
	sendSchema
}: InitFormOptions<T, E, SendSchema>): InitialFormData<T, E, SendSchema> {
	const errors = performValidation ? validator.validateFormData(schema, initialValue as SchemaValue | undefined) : [];
	return {
		initialValue,
		initialErrors: errors,
		schema: (sendSchema ? schema : undefined) as SendSchema extends true ? Schema : undefined
	};
}

export interface FormDataParserOptions {
	validator: Validator;
	merger?: Merger2;
	idPrefix?: string;
	idSeparator?: string;
	idPseudoSeparator?: string;
}

export function makeFormDataParser({
	validator,
	merger = defaultMerger,
	idPrefix = DEFAULT_ID_PREFIX,
	idSeparator = DEFAULT_ID_SEPARATOR,
	idPseudoSeparator = DEFAULT_PSEUDO_ID_SEPARATOR
}: FormDataParserOptions) {
	return async ({
		request,
		schema,
		uiSchema = {}
	}: {
		schema: Schema;
		request: Request;
		uiSchema?: UiSchemaRoot;
	}): Promise<SchemaValue | undefined> => {
		const formData = await request.formData();
		if (formData.get(JSON_CHUNKS_KEY)) {
			const chunks = formData.getAll(JSON_CHUNKS_KEY).join('');
			return JSON.parse(chunks);
		}
		return parseSchemaValue({
			idPrefix,
			idSeparator,
			idPseudoSeparator,
			schema,
			uiSchema,
			entries: await Promise.all(
				formData
					.entries()
					.map((entry) =>
						entry[1] instanceof File
							? fileToDataURL(request.signal, entry[1]).then(
									(data): Entry<string> => [entry[0], data]
								)
							: (entry as Entry<Exclude<FormDataEntryValue, File>>)
					)
			),
			validator,
			merger,
			convertEntries: makeFormDataEntriesConverter({
				validator,
				merger,
				rootSchema: schema,
				rootUiSchema: uiSchema
			})
		});
	};
}

export interface ValidateFormOptions<E, SendData extends boolean> {
	data: SchemaValue | undefined;
	schema: Schema;
	validator: FormValidator<E>;
	/** @default false */
	sendData?: SendData;
}

export function validateForm<
	E,
	SendData extends boolean = false
>({
	schema,
	validator,
	data,
	sendData,
}: ValidateFormOptions<E, SendData>): ValidatedFormData<E, SendData> {
	const errors = validator.validateFormData(schema, data);
	return {
		isValid: errors.length === 0,
		sendData,
		data: (sendData ? data : undefined) as SendData extends true
			? SchemaValue | undefined
			: undefined,
		errors
	};
}
