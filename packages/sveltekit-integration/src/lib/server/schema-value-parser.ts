import jsonpointer from 'jsonpointer';
import {
	getClosestMatchingOption2,
	getDiscriminatorFieldFromSchema,
	isSchema,
	isSchemaObjectValue,
	isSelect2,
	type Merger2,
	type SchemaArrayValue,
	type SchemaDefinition,
	type SchemaObjectValue,
	type Validator
} from '@sjsf/form/core';
import type { Schema, SchemaValue } from '@sjsf/form';

export type Entry<T> = [key: string, value: T];
export type Entries<T> = Entry<T>[];

export interface SchemaValueParserOptions {
	schema: Schema;
	entries: Entries<string>;
	idPrefix: string;
	idSeparator: string;
	idPseudoSeparator: string;
	validator: Validator;
	merger: Merger2;
	convertValue: (schema: SchemaDefinition, entries: Entries<string>) => SchemaValue | undefined;
}

const KNOWN_PROPERTIES = Symbol('known-properties');

export function parseSchemaValue({
	convertValue,
	entries,
	idPrefix,
	idPseudoSeparator,
	idSeparator: originalIdSeparator,
	schema: rootSchema,
	validator,
	merger
}: SchemaValueParserOptions) {
	if (entries.length === 0) {
		return undefined;
	}

	const idSeparator = escapeRegex(originalIdSeparator);
	const BOUNDARY = `($|${idSeparator})`;
	let filter = '';
	const filterLengthStack: number[] = [];
	const entriesStack: Entries<string>[] = [removePseudoElements(entries, idPseudoSeparator)];

	const groups = new Map<string | typeof KNOWN_PROPERTIES, Entries<string>>();
	function addGroupEntry(key: string | typeof KNOWN_PROPERTIES, entry: Entry<string>) {
		const group = groups.get(key);
		if (group) {
			group.push(entry);
		} else {
			groups.set(key, [entry]);
		}
	}
	function popGroupEntries() {
		const known = groups.get(KNOWN_PROPERTIES) ?? [];
		groups.delete(KNOWN_PROPERTIES);
		const unknown = Array.from(groups.entries()) as [string, Entries<string>][];
		groups.clear();
		return { known, unknown };
	}

	function pushFilter(cmp: string) {
		filter += cmp;
		filterLengthStack.push(cmp.length);
	}

	function popFilter() {
		const len = filterLengthStack.pop()!;
		filter = filter.slice(0, -len);
	}

	function pushFilterAndEntries(cmp: string) {
		pushFilter(cmp);
		const last = entriesStack[entriesStack.length - 1];
		const regExp = new RegExp(filter + BOUNDARY);
		const right: Entries<string> = [];
		const left: Entries<string> = [];
		for (const entry of last) {
			if (regExp.test(entry[0])) {
				right.push(entry);
			} else {
				left.push(entry);
			}
		}
		entriesStack[entriesStack.length - 1] = left;
		entriesStack.push(right);
	}

	function popEntriesAndFilter() {
		entriesStack.pop();
		popFilter();
	}

	function parseObject(schema: Schema) {
		const { properties, additionalProperties } = schema;
		const value: SchemaObjectValue = {};
		if (properties !== undefined) {
			for (const [property, schema] of Object.entries(properties)) {
				pushFilterAndEntries(`${idSeparator}${escapeRegex(property)}`);
				value[property] = parseSchemaDef(schema);
				popEntriesAndFilter();
			}
		}
		if (additionalProperties !== undefined) {
			const knownProperties = new Set(getKnownProperties(schema, rootSchema));
			for (const entry of entriesStack[entriesStack.length - 1]) {
				const keyEnd = entry[0].indexOf(originalIdSeparator, filter.length);
				const key = entry[0].slice(filter.length, keyEnd === -1 ? undefined : keyEnd);
				if (knownProperties.has(key)) {
					addGroupEntry(KNOWN_PROPERTIES, entry);
				} else {
					addGroupEntry(key, entry);
				}
			}
			const { known, unknown } = popGroupEntries();
			entriesStack[entriesStack.length - 1] = known;
			for (const [key, entries] of unknown) {
				pushFilter(`${idSeparator}${escapeRegex(key)}`);
				entriesStack.push(entries);
				value[key] = parseSchemaDef(additionalProperties);
				entriesStack.pop();
				popFilter();
			}
		}
		return value;
	}

	function parseArray(schema: Schema) {
		const { items, additionalItems } = schema;
		const value: SchemaArrayValue = [];
		if (items !== undefined) {
			if (Array.isArray(items)) {
				for (let i = 0; i < items.length; i++) {
					pushFilterAndEntries(`${idSeparator}${i}`);
					value.push(parseSchemaDef(items[i]));
					popEntriesAndFilter();
				}
				if (additionalItems !== undefined) {
					let i = items.length;
					while (entriesStack[entriesStack.length - 1].length > 0) {
						pushFilterAndEntries(`${idSeparator}${i++}`);
						if (i === items.length + 1 && entriesStack[entriesStack.length - 1].length === 0) {
							popEntriesAndFilter();
							break;
						}
						value.push(parseSchemaDef(additionalItems));
						popEntriesAndFilter();
					}
				}
			} else {
				let i = 0;
				while (entriesStack[entriesStack.length - 1].length > 0) {
					pushFilterAndEntries(`${idSeparator}${i++}`);
					// Special case: array items have no indexes, but they have the same names
					if (i === 1 && entriesStack[entriesStack.length - 1].length === 0) {
						popEntriesAndFilter();
						const arrayEntries = entriesStack[entriesStack.length - 1];
						for (let j = 0; j < arrayEntries.length; j++) {
							entriesStack.push([arrayEntries[j]]);
							value.push(parseSchemaDef(items));
							entriesStack.pop();
						}
						arrayEntries.length = 0;
						break;
					}
					value.push(parseSchemaDef(items));
					popEntriesAndFilter();
				}
			}
		}
		return value;
	}

	function handleAltSchema(schema: Schema, value: SchemaValue | undefined) {
		const { anyOf, oneOf } = schema;
		const altSchema = anyOf ?? oneOf;
		if (!Array.isArray(altSchema) || isSelect2(validator, merger, schema, rootSchema)) {
			return value;
		}
		const bestIndex = getClosestMatchingOption2(
			validator,
			merger,
			rootSchema,
			value,
			altSchema.map((def) => {
				if (typeof def === 'boolean') {
					return def ? {} : { not: {} };
				}
				return def;
			}),
			0,
			getDiscriminatorFieldFromSchema(schema)
		);
		return parseSchemaDef(altSchema[bestIndex], value);
	}

	function handleConditions(schema: Schema, value: SchemaValue | undefined) {
		const { if: expression, then, else: otherwise } = schema;
		if (expression === undefined) {
			return value;
		}
		const isThenBranch =
			typeof expression === 'boolean'
				? expression
				: validator.isValid(expression, rootSchema, value);
		const branch = isThenBranch ? then : otherwise;
		return branch === undefined ? value : parseSchemaDef(branch, value);
	}

	function handleDependencies(schema: Schema, value: SchemaValue | undefined) {
		const { dependencies } = schema;
		if (dependencies === undefined || !isSchemaObjectValue(value)) {
			return value;
		}
		let result = value;
		for (const [key, deps] of Object.entries(dependencies)) {
			if (!(key in value) || Array.isArray(deps)) {
				continue;
			}
			result = { ...(parseSchemaDef(deps, result) as SchemaObjectValue), ...result };
		}
		return result;
	}

	function parseSchemaDef(schema: SchemaDefinition, value?: SchemaValue): SchemaValue | undefined {
		if (!isSchema(schema)) {
			return schema ? convertValue(schema, entriesStack[entriesStack.length - 1]) : undefined;
		}
		const { properties, items, $ref: ref } = schema;
		if (ref !== undefined) {
			return parseSchemaDef(resolveRef(ref, rootSchema));
		}
		if (properties !== undefined) {
			value = parseObject(schema);
		} else if (items !== undefined) {
			value = parseArray(schema);
		} else {
			value = convertValue(schema, entriesStack[entriesStack.length - 1]);
		}
		return handleDependencies(schema, handleAltSchema(schema, handleConditions(schema, value)));
	}

	pushFilterAndEntries(`^${escapeRegex(idPrefix)}`);
	return parseSchemaDef(rootSchema);
}

function resolveRef(ref: string, rootSchema: Schema) {
	if (!ref.startsWith('#')) {
		throw new Error(`Invalid reference: ${ref}, must start with #`);
	}
	const schemaDef: SchemaDefinition | undefined = jsonpointer.get(
		rootSchema,
		decodeURIComponent(ref.substring(1))
	);
	if (schemaDef === undefined) {
		throw new Error(`Could not find a definition for ${ref}.`);
	}
	return schemaDef;
}

function* getKnownProperties(
	{ $ref: ref, properties, dependencies, oneOf, allOf, anyOf }: Schema,
	rootSchema: Schema,
	stack = new Set<string>()
): Generator<string> {
	if (ref) {
		if (stack.has(ref)) {
			return;
		}
		stack.add(ref);
		const resolved = resolveRef(ref, rootSchema);
		if (isSchema(resolved)) {
			yield* getKnownProperties(resolved, rootSchema, stack);
		}
		return;
	}
	if (properties) {
		for (const key of Object.keys(properties)) {
			yield key;
		}
	}
	for (const alternatives of [oneOf, allOf, anyOf]) {
		if (Array.isArray(alternatives)) {
			for (const alternative of alternatives) {
				if (isSchema(alternative)) {
					yield* getKnownProperties(alternative, rootSchema, stack);
				}
			}
		}
	}
	if (dependencies !== undefined) {
		for (const dependency of Object.values(dependencies)) {
			if (!Array.isArray(dependency) && isSchema(dependency)) {
				yield* getKnownProperties(dependency, rootSchema, stack);
			}
		}
	}
}

function removePseudoElements(entries: Entries<string>, idPseudoSeparator: string) {
	return entries.filter(([key]) => key.lastIndexOf(idPseudoSeparator) === -1);
}

function escapeRegex(str: string) {
	return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
