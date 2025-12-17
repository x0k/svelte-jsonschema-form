import type { Schema } from '@sjsf/form';
import { createMerger } from '@sjsf/form/lib/json-schema';

const { mergeSchemaDefinitions } = createMerger();

export function mergeSchemas(a: Schema, b: Schema): Schema {
	return mergeSchemaDefinitions(a, b) as Schema;
}

const jsonSchemaFormats = new Set([
	// Dates and Times
	'date-time', // draft-00 (original)
	'time', // draft-07
	'date', // draft-07
	'duration', // draft 2019-09

	// Email Addresses
	'email', // draft-00 (original)
	'idn-email', // draft-07

	// Hostnames
	'hostname', // draft-00 (original)
	'idn-hostname', // draft-07

	// IP Addresses
	'ipv4', // draft-00 (original)
	'ipv6', // draft-00 (original)

	// Resource Identifiers
	'uuid', // draft 2019-09
	'uri', // draft-00 (original)
	'uri-reference', // draft-06
	'iri', // draft-07
	'iri-reference', // draft-07

	// URI Template
	'uri-template', // draft-06

	// JSON Pointer
	'json-pointer', // draft-06
	'relative-json-pointer', // draft-07

	// Regular Expressions
	'regex' // draft-07
]);

export function isKnownJsonSchemaFormat(format: string) {
	return jsonSchemaFormats.has(format);
}
