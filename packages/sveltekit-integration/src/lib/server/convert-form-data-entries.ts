import {
	getSchemaConstantValue,
	isNullableSchemaType,
	isSelect2,
	pickSchemaType,
	typeOfSchema,
	type Merger2,
	type SchemaDefinition,
	type Validator
} from '@sjsf/form/core';
import { DEFAULT_BOOLEAN_ENUM, type Schema, type SchemaValue } from '@sjsf/form';

import type { Entries } from './entry';

export interface FormDataConverterOptions {
	validator: Validator;
	merger: Merger2;
	rootSchema: Schema;
}

export function makeFormDataEntriesConverter({
	validator,
	merger,
	rootSchema
}: FormDataConverterOptions) {
	return (schema: SchemaDefinition, entries: Entries<string>): SchemaValue | undefined => {
		if (typeof schema === 'boolean') {
			return schema ? entries[0]?.[1] : undefined;
		}
		const typeOrTypes = typeOfSchema(schema);
		const type = Array.isArray(typeOrTypes) ? pickSchemaType(typeOrTypes) : typeOrTypes;
		if (entries.length === 0) {
			if (type === 'boolean') {
				return false;
			}
			return isNullableSchemaType(typeOrTypes) ? null : undefined;
		}
		const value = entries[0][1];
		if (isSelect2(validator, merger, schema, rootSchema)) {
			const num = Number(value);
			if (isNaN(num)) {
				throw new Error(`Invalid select index value: ${value} is not a number`);
			}
			const altSchemas = schema.oneOf ?? schema.anyOf;
			const options = Array.isArray(altSchemas)
				? altSchemas.map((s) => (typeof s === 'boolean' ? s : getSchemaConstantValue(s)))
				: (schema.enum ?? (type === 'boolean' ? DEFAULT_BOOLEAN_ENUM : undefined));
			if (options === undefined) {
				throw new Error(`Invalid select options: ${JSON.stringify(schema)}`);
			}
			if (num >= options.length) {
				throw new Error(
					`Invalid select index: "${value}" is not a valid index for "[${options.join(', ')}]"`
				);
			}
			return structuredClone(options[num]);
		}
		switch (type) {
			case 'string':
				return value;
			case 'boolean':
				return value === 'on';
			case 'integer':
				return parseInt(value, 10);
			case 'number':
				return parseFloat(value);
			case 'null':
			case 'array':
			case 'object':
				throw new Error(`Unsupported schema type: ${type}`);
			default: {
				const n: never = type;
				throw new Error(`Unexpected schema type: ${n}`);
			}
		}
	};
}
