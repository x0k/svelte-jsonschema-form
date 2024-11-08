import {
	getSimpleSchemaType,
	isSchema,
	traverseSchemaDefinition,
	type SchemaArrayValue,
	type SchemaDefinition,
	type SchemaDefinitionVisitor,
	type SchemaObjectValue,
	type SchemaTraverserContext
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
	convertValue: (schema: SchemaDefinition, entries: Entries<string>) => SchemaValue | undefined;
}

const KNOWN_PROPERTIES = Symbol('known-properties');

export function parseSchemaValue({
	schema: rootSchema,
	entries,
	idPrefix,
	idSeparator,
	idPseudoSeparator,
	convertValue
}: SchemaValueParserOptions): SchemaValue | undefined {
	if (entries.length === 0) {
		return undefined;
	}

	const BOUNDARY = `($|${escapeRegex(idSeparator)})`;
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
			case 'root':
			case 'sub': {
				return value;
			}
			case 'record': {
				const record = valueStack[valueStack.length - 1] as SchemaObjectValue;
				record[ctx.property] = value;
				break;
			}
			case 'array':
				throw unexpected(`PopValue: Unexpected context`, ctx);
			default:
				throw unreachable(`PopValue: Unknown context`, ctx);
		}
	}

	function calculateValueOnStack(schema: SchemaDefinition) {
		const entries = entriesStack[entriesStack.length - 1];
		if (entries.length > 0) {
			valueStack[valueStack.length - 1] = convertValue(schema, entries);
		}
	}

	function parse(generator: Generator<Message>) {
		let result: SchemaValue | undefined;
		let depth = 0;
		for (let it = generator.next(); !it.done; it = generator.next()) {
			const message = it.value;
			switch (message.type) {
				case MessageType.Enter: {
					depth++;
					switch (message.ctx.type) {
						case 'root': {
							pushFilterAndEntries(`^${idPrefix}`);
							pushValue(message.schema);
							continue;
						}
						case 'record': {
							pushFilterAndEntries(`${idSeparator}${message.ctx.property}`);
							pushValue(message.schema);
							continue;
						}
						case 'sub': {
							if (depth === 1) {
								pushValue(message.schema);
								continue;
							}
							switch (message.ctx.key) {
								case 'items': {
									depth--;
									skipNode(generator);
									let i = 0;
									const values: SchemaArrayValue = [];
									while (entriesStack[entriesStack.length - 1].length > 0) {
										pushFilterAndEntries(`${idSeparator}${i++}`);
										values.push(
											parse(traverseSchemaDefinition(message.schema, visitor, message.ctx))
										);
										popEntriesAndFilter();
									}
									valueStack[valueStack.length - 1] = values;
									continue;
								}
								case 'additionalProperties': {
									depth--;
									skipNode(generator);
									const knownProperties = new Set(
										getKnownProperties(message.ctx.parent, rootSchema)
									);
									for (const entry of entriesStack[entriesStack.length - 1]) {
										const keyEnd = entry[0].indexOf(idSeparator, keyFilter.length);
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
										pushFilter(`${idSeparator}${key}`);
										entriesStack.push(entries);
										record[key] = parse(
											traverseSchemaDefinition(message.schema, visitor, message.ctx)
										);
										entriesStack.pop();
										popFilter();
									}
									continue;
								}
								case 'additionalItems':
								case 'then':
								case 'else':
									throw todo('Enter: Unimplemented sub key', message.ctx);
								case 'contains':
								case 'if':
								case 'not':
								case 'propertyNames':
									continue;
								default:
									throw unreachable('Enter: Unknown sub key', message.ctx);
							}
						}
						case 'array':
							continue;
						default:
							throw unreachable('Enter: Unknown context type', message.ctx);
					}
				}
				case MessageType.Leave: {
					depth--;
					switch (message.ctx.type) {
						case 'sub': {
							if (depth !== 0) {
								throw unexpected('Leave: Unexpected sub schema', message.ctx);
							}
							calculateValueOnStack(message.schema);
							result = popValue(message.ctx);
							continue;
						}
						case 'root':
						case 'record':
						case 'array': {
							calculateValueOnStack(message.schema);
							result = popValue(message.ctx);
							popEntriesAndFilter();
							continue;
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

// TODO: `$ref`'s resolution, maybe `oneOf`, `anyOf`, `allOf` ???
function* getKnownProperties(
	{ properties, dependencies }: Schema,
	rootSchema: Schema
): Generator<string> {
	if (properties) {
		for (const key of Object.keys(properties)) {
			yield key;
		}
	}
	if (dependencies === undefined) {
		return;
	}
	for (const dependency of Object.values(dependencies)) {
		if (Array.isArray(dependency) || !isSchema(dependency)) {
			continue;
		}
		yield* getKnownProperties(dependency, rootSchema);
	}
}

function todo<T>(message: string, value: T) {
	return new Error(`TODO: ${message} "${JSON.stringify(value)}"`);
}

function unexpected<T>(message: string, value: T) {
	return new Error(`Unexpected: ${message} "${JSON.stringify(value)}"`);
}

function unreachable(message: string, value: never) {
	return new Error(`${message} "${JSON.stringify(value)}"`);
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
