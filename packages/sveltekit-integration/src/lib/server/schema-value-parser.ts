import jsonpointer from 'jsonpointer';
import {
	getClosestMatchingOption2,
	getDiscriminatorFieldFromSchema,
	getSimpleSchemaType,
	isSchema,
	isSelect2,
	traverseSchemaDefinition,
	type Merger2,
	type SchemaArrayValue,
	type SchemaDefinition,
	type SchemaDefinitionVisitor,
	type SchemaObjectValue,
	type SchemaTraverserContext,
	type Validator
} from '@sjsf/form/core';
import type { Schema, SchemaValue } from '@sjsf/form';

export type Entry<T> = [key: string, value: T];
export type Entries<T> = Entry<T>[];

enum MessageType {
	Enter,
	Leave
}

interface AbstractMessage<T extends MessageType> {
	type: T;
}

interface EnterMessage extends AbstractMessage<MessageType.Enter> {
	ctx: SchemaTraverserContext;
	schema: SchemaDefinition;
}

interface LeaveMessage extends AbstractMessage<MessageType.Leave> {
	ctx: SchemaTraverserContext;
	schema: SchemaDefinition;
}

type Message = EnterMessage | LeaveMessage;

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
	schema: rootSchema,
	entries,
	idPrefix,
	idSeparator: originalIdSeparator,
	idPseudoSeparator,
	convertValue,
	merger,
	validator
}: SchemaValueParserOptions): SchemaValue | undefined {
	if (entries.length === 0) {
		return undefined;
	}

	const idSeparator = escapeRegex(originalIdSeparator);
	const BOUNDARY = `($|${idSeparator})`;
	let keyFilter = '';
	const lengthsStack: number[] = [];
	const entriesStack: Entries<string>[] = [removePseudoElements(entries, idPseudoSeparator)];
	const valueStack: SchemaArrayValue = [];

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

	const visitor: SchemaDefinitionVisitor<Message> = {
		*onEnter(node, ctx) {
			yield {
				type: MessageType.Enter,
				ctx,
				schema: node
			};
		},
		*onLeave(node, ctx) {
			yield {
				type: MessageType.Leave,
				ctx,
				schema: node
			};
		}
	};

	function pushFilter(cmp: string) {
		keyFilter += cmp;
		lengthsStack.push(cmp.length);
	}

	function popFilter() {
		const len = lengthsStack.pop()!;
		keyFilter = keyFilter.slice(0, -len);
	}

	function pushFilterAndEntries(cmp: string) {
		pushFilter(cmp);
		const last = entriesStack[entriesStack.length - 1];
		const regExp = new RegExp(keyFilter + BOUNDARY);
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

	function pushValue(schema: SchemaDefinition) {
		if (typeof schema === 'boolean') {
			valueStack.push(undefined);
			return;
		}
		switch (getSimpleSchemaType(schema)) {
			case 'array':
				valueStack.push([]);
				break;
			case 'object':
				valueStack.push({});
				break;
			default:
				valueStack.push(undefined);
				break;
		}
	}

	function popValue(ctx: SchemaTraverserContext) {
		const value = valueStack.pop();
		switch (ctx.type) {
			case 'root': {
				return value;
			}
			case 'sub': {
				switch (ctx.key) {
					case 'additionalItems':
					case 'items': {
						const array = valueStack[valueStack.length - 1] as SchemaArrayValue;
						array.push(value);
						return array;
					}
					case 'additionalProperties': {
						return value;
					}
					default:
						throw unexpected(`PopValue: Unknown context`, ctx);
				}
			}
			case 'record': {
				const record = valueStack[valueStack.length - 1] as SchemaObjectValue;
				record[ctx.property] ??= value;
				return record;
			}
			case 'array': {
				const array = valueStack[valueStack.length - 1] as SchemaArrayValue;
				array[ctx.index] ??= value;
				return array;
			}
			default:
				throw unreachable(`PopValue: Unknown context`, ctx);
		}
	}

	function calculateValueOnStack(schema: SchemaDefinition) {
		const entries = entriesStack[entriesStack.length - 1];
		valueStack[valueStack.length - 1] ??= convertValue(schema, entries);
	}

	function parse(generator: Generator<Message>, depth = 0) {
		function skipNodeDecDepth() {
			skipNode(generator);
			depth--;
		}

		let result: SchemaValue | undefined;
		for (let it = generator.next(); !it.done; it = generator.next()) {
			const message = it.value;
			switch (message.type) {
				case MessageType.Enter: {
					depth++;
					if (
						(message.ctx.type === 'record' &&
							(message.ctx.key === '$defs' || message.ctx.key === 'definitions')) ||
						(message.ctx.type === 'sub' &&
							(message.ctx.key === 'if' ||
								message.ctx.key === 'contains' ||
								message.ctx.key === 'not' ||
								message.ctx.key === 'propertyNames'))
					) {
						skipNodeDecDepth();
						continue;
					}
					if (isSchema(message.schema)) {
						const ref = message.schema.$ref;
						if (ref !== undefined) {
							if (entriesStack[entriesStack.length - 1].length > 0) {
								const schemaDef = resolveRef(ref, rootSchema);
								result = parse(traverseSchemaDefinition(schemaDef, visitor, message.ctx), depth);
							}
							skipNodeDecDepth();
							continue;
						}
						const { anyOf, oneOf } = message.schema;
						const anyOfOrOneOf = anyOf || oneOf;
						if (Array.isArray(anyOfOrOneOf)) {
							skipNodeDecDepth();
							if (isSelect2(validator, merger, message.schema, rootSchema)) {
								const property = message.ctx.type === 'record' ? message.ctx.property : undefined;
								if (property) {
									pushFilterAndEntries(`${idSeparator}${escapeRegex(property)}`);
								}
								pushValue(message.schema);
								calculateValueOnStack(message.schema);
								result = popValue(message.ctx);
								if (property) {
									popEntriesAndFilter();
								}
								continue;
							}
							const bestIndex = getClosestMatchingOption2(
								validator,
								merger,
								rootSchema,
								valueStack[valueStack.length - 1],
								anyOfOrOneOf.map((def) => {
									if (typeof def === 'boolean') {
										return def ? {} : { not: {} };
									}
									return def;
								}),
								0,
								getDiscriminatorFieldFromSchema(message.schema)
							);
							const key = Array.isArray(oneOf) ? 'oneOf' : 'anyOf';
							result = parse(
								traverseSchemaDefinition(anyOfOrOneOf[bestIndex], visitor, {
									type: 'array',
									key,
									index: bestIndex,
									parent: message.schema,
									path: message.ctx.path.concat(key, bestIndex)
								})
							);
							continue;
						}
					}
					switch (message.ctx.type) {
						case 'root': {
							pushFilterAndEntries(`^${escapeRegex(idPrefix)}`);
							pushValue(message.schema);
							continue;
						}
						case 'record': {
							switch (message.ctx.key) {
								case 'properties': {
									pushFilterAndEntries(`${idSeparator}${escapeRegex(message.ctx.property)}`);
									pushValue(message.schema);
									continue;
								}
								case '$defs':
								case 'definitions':
									throw unexpected(`Enter: Unexpected record context`, message.ctx);
								case 'dependencies':
									continue;
								case 'patternProperties':
									throw todo(`Enter: Unimplemented record context`, message.ctx);
								default:
									throw unreachable(`Enter: Unknown record context`, message.ctx);
							}
						}
						case 'sub': {
							if (depth === 1) {
								pushValue(message.schema);
								continue;
							}
							switch (message.ctx.key) {
								case 'then':
								case 'else':
									continue;
								case 'contains':
								case 'if':
								case 'not':
								case 'propertyNames': {
									throw unexpected(`Enter: Unexpected sub context`, message.ctx);
								}
								case 'items': {
									skipNodeDecDepth();
									let i = 0;
									while (entriesStack[entriesStack.length - 1].length > 0) {
										pushFilterAndEntries(`${idSeparator}${i++}`);
										// Special case: array items have no indexes, but they have the same names
										if (i === 1 && entriesStack[entriesStack.length - 1].length === 0) {
											popEntriesAndFilter();
											const arrayEntries = entriesStack[entriesStack.length - 1];
											for (let j = 0; j < arrayEntries.length; j++) {
												entriesStack.push([arrayEntries[j]]);
												parse(traverseSchemaDefinition(message.schema, visitor, message.ctx));
												entriesStack.pop();
											}
											arrayEntries.length = 0;
											break;
										}
										parse(traverseSchemaDefinition(message.schema, visitor, message.ctx));
										popEntriesAndFilter();
									}
									continue;
								}
								case 'additionalProperties': {
									skipNodeDecDepth();
									const knownProperties = new Set(
										getKnownProperties(message.ctx.parent, rootSchema)
									);
									for (const entry of entriesStack[entriesStack.length - 1]) {
										const keyEnd = entry[0].indexOf(originalIdSeparator, keyFilter.length);
										const key = entry[0].slice(
											keyFilter.length,
											keyEnd === -1 ? undefined : keyEnd
										);
										if (knownProperties.has(key)) {
											addGroupEntry(KNOWN_PROPERTIES, entry);
										} else {
											addGroupEntry(key, entry);
										}
									}
									const { known, unknown } = popGroupEntries();
									entriesStack[entriesStack.length - 1] = known;
									const record = valueStack[valueStack.length - 1] as SchemaObjectValue;
									for (const [key, entries] of unknown) {
										pushFilter(`${idSeparator}${escapeRegex(key)}$`);
										entriesStack.push(entries);
										record[key] = parse(
											traverseSchemaDefinition(message.schema, visitor, message.ctx)
										);
										entriesStack.pop();
										popFilter();
									}
									continue;
								}
								case 'additionalItems': {
									skipNodeDecDepth();
									const schemaItems = message.ctx.parent.items;
									const initialIndex = Array.isArray(schemaItems) ? schemaItems.length : 0;
									let i = initialIndex;
									while (entriesStack[entriesStack.length - 1].length > 0) {
										pushFilterAndEntries(`${idSeparator}${i++}`);
										if (
											i === initialIndex + 1 &&
											entriesStack[entriesStack.length - 1].length === 0
										) {
											popEntriesAndFilter();
											break;
										}
										parse(traverseSchemaDefinition(message.schema, visitor, message.ctx));
										popEntriesAndFilter();
									}
									continue;
								}
								default:
									throw unreachable('Enter: Unknown sub key', message.ctx);
							}
						}
						case 'array':
							switch (message.ctx.key) {
								case 'allOf': {
									pushValue(message.schema);
									continue;
								}
								case 'anyOf':
								case 'oneOf': {
									if (depth !== 1) {
										throw unexpected('Enter: Unexpected array context', message.ctx);
									}
									continue
								}
								case 'items': {
									pushFilterAndEntries(`${idSeparator}${message.ctx.index}`);
									pushValue(message.schema);
									continue;
								}
								default:
									throw unreachable('Enter: Unknown array context', message.ctx);
							}
						default:
							throw unreachable('Enter: Unknown context type', message.ctx);
					}
				}
				case MessageType.Leave: {
					depth--;
					switch (message.ctx.type) {
						case 'sub': {
							switch (message.ctx.key) {
								case 'if':
								case 'contains':
								case 'not':
								case 'propertyNames':
									throw unexpected('Leave: Unexpected sub schema', message.ctx);
								case 'then':
								case 'else': {
									result = valueStack[valueStack.length - 1];
									continue;
								}
								case 'items':
								case 'additionalItems':
								case 'additionalProperties': {
									if (depth !== 0) {
										throw unexpected('Leave: Unexpected sub schema', message.ctx);
									}
									calculateValueOnStack(message.schema);
									result = popValue(message.ctx);
									continue;
								}
								default:
									throw unreachable('Leave: Unknown sub key', message.ctx);
							}
						}
						case 'array': {
							switch (message.ctx.key) {
								case 'allOf':
									calculateValueOnStack(message.schema);
									result = popValue(message.ctx);
									continue;
								case 'anyOf':
								case 'oneOf':
									if (depth !== 0) {
										throw unexpected('Leave: Unexpected array schema', message.ctx);
									}
									continue;
								case 'items':
									calculateValueOnStack(message.schema);
									result = popValue(message.ctx);
									popEntriesAndFilter();
									continue;
								default:
									throw unreachable('Leave: Unknown array context', message.ctx);
							}
						}
						case 'root': {
							calculateValueOnStack(message.schema);
							result = popValue(message.ctx);
							popEntriesAndFilter();
							continue;
						}
						case 'record': {
							switch (message.ctx.key) {
								case 'dependencies': {
									result = valueStack[valueStack.length - 1];
									continue;
								}
								case '$defs':
								case 'definitions':
									throw unexpected('Leave: Unexpected record schema', message.ctx);
								case 'patternProperties':
									throw todo('Leave: patternProperties', message.ctx);
								case 'properties': {
									calculateValueOnStack(message.schema);
									result = popValue(message.ctx);
									popEntriesAndFilter();
									continue;
								}
								default:
									throw unreachable('Leave: Unknown record context', message.ctx);
							}
						}
						default:
							throw unreachable('Leave: Unknown context type', message.ctx);
					}
				}
				default: {
					throw unreachable('Unknown message type', message);
				}
			}
		}
		return result;
	}
	return parse(traverseSchemaDefinition(rootSchema, visitor));
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

function todo<T>(message: string, value: T) {
	return new Error(`TODO: ${message} "${JSON.stringify(value)}"`);
}

function unexpected<T>(message: string, value: T) {
	return new Error(`Unexpected: ${message} "${JSON.stringify(value)}"`);
}

function unreachable(message: string, value: never) {
	return new Error(`Unreachable: ${message} "${JSON.stringify(value)}"`);
}

function skipNode(generator: Generator<Message>) {
	let depth = 1;
	do {
		const it = generator.next();
		switch (it.value.type) {
			case MessageType.Enter: {
				depth++;
				break;
			}
			case MessageType.Leave: {
				depth--;
				break;
			}
		}
	} while (depth > 0);
}

function removePseudoElements(entries: Entries<string>, idPseudoSeparator: string) {
	return entries.filter(([key]) => key.lastIndexOf(idPseudoSeparator) === -1);
}

function escapeRegex(str: string) {
	return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
