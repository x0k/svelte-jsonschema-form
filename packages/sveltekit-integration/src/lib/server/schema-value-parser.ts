import {
	getSimpleSchemaType,
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

export function parseSchemaValue({
	schema: rootSchema,
	entries,
	idPrefix,
	idSeparator,
	convertValue
}: SchemaValueParserOptions): SchemaValue | undefined {
	if (entries.length === 0) {
		return undefined;
	}
	const BOUNDARY = `($|${escapeRegex(idSeparator)})`;
	let keyFilter = '';
	const lengthsStack: number[] = [];
	const entriesStack: Entries<string>[] = [entries];
	const valueStack: SchemaArrayValue = [];

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

	function pushFilterComponent(cmp: string) {
		// Filter
		keyFilter += cmp;
		lengthsStack.push(cmp.length);
		// Entries
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

	function popFilterComponent() {
		// Entries
		entriesStack.pop();
		// Filter
		const len = lengthsStack.pop()!;
		keyFilter = keyFilter.slice(0, -len);
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
			case 'record': {
				const record = valueStack[valueStack.length - 1] as SchemaObjectValue;
				record[ctx.property] = value;
				break;
			}
			case 'sub': {
				const array = valueStack[valueStack.length - 1] as SchemaArrayValue;
				array.push(value);
				break;
			}
			case 'root': {
				return value;
			}
			default:
				throw new Error(`Handling of "${ctx.type}" context is not implemented`);
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
							pushFilterComponent(`^${idPrefix}`);
							pushValue(message.schema);
							continue;
						}
						case 'record': {
							pushFilterComponent(`${idSeparator}${message.ctx.property}`);
							pushValue(message.schema);
							continue;
						}
						case 'sub': {
							if (depth === 1) {
								pushValue(message.schema);
							} else {
								let i = 0;
								const values: SchemaArrayValue = [];
								while (true) {
									pushFilterComponent(`${idSeparator}${i++}`);
									if (entriesStack[entriesStack.length - 1].length === 0) {
										break;
									}
									values.push(
										parse(traverseSchemaDefinition(message.schema, visitor, message.ctx))
									);
									popFilterComponent();
								}
								skipNode(generator);
								valueStack[valueStack.length - 1] = values;
								popFilterComponent();
							}
							continue;
						}
					}
					continue;
				}
				case MessageType.Leave: {
					depth--;
					switch (message.ctx.type) {
						case 'sub': {
							if (depth === 0) {
								result = valueStack.pop();
							}
							continue;
						}
						default: {
							const currentEntries = entriesStack[entriesStack.length - 1];
							if (currentEntries.length > 0) {
								valueStack[valueStack.length - 1] = convertValue(message.schema, currentEntries);
							}
							result = popValue(message.ctx);
							popFilterComponent();
							continue;
						}
					}
				}
				default: {
					const neverEvent: never = message;
					throw new Error(`Unknown event: ${JSON.stringify(neverEvent)}`);
				}
			}
		}
		return result;
	}
	return parse(traverseSchemaDefinition(rootSchema, visitor));
}

function skipNode(generator: Generator<Message>) {
	let depth = 0;
	for (let it = generator.next(); !it.done; it = generator.next()) {
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
		if (depth === 0) {
			return;
		}
	}
}

function escapeRegex(str: string) {
	return str.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}
