import {
	getSimpleSchemaType,
	traverseSchemaDefinition,
	type SchemaArrayValue,
	type SchemaDefinition,
	type SchemaDefinitionVisitor,
	type SchemaObjectValue,
	type SchemaTraverserContext,
} from '@sjsf/form/core';
import type { Schema, SchemaValue } from '@sjsf/form';

export type Entry<T> = [key: string, value: T];
export type Entries<T> = Entry<T>[];

enum EventType {
	Enter,
	Leave
}

interface AbstractEvent<T extends EventType> {
	type: T;
}

interface EnterEvent extends AbstractEvent<EventType.Enter> {
	ctx: SchemaTraverserContext
	schema: SchemaDefinition;
}

interface LeaveEvent extends AbstractEvent<EventType.Leave> {
	ctx: SchemaTraverserContext
	schema: SchemaDefinition;
}

type Event = EnterEvent | LeaveEvent;

export interface SchemaValueParserOptions {
	schema: Schema;
	entries: Entries<string>;
	idPrefix: string;
	idSeparator: string;
	idPseudoSeparator: string;
	convertValue: (schema: SchemaDefinition, entries: Entries<string>) => SchemaValue | undefined;
}

export function parseSchemaValue({
	schema,
	entries,
	idPrefix,
	idSeparator,
	convertValue
}: SchemaValueParserOptions): SchemaValue | undefined {
	if (entries.length === 0) {
		return undefined;
	}
	let keyFilter = '';
	const lengthsStack: number[] = [];
	const entriesStack: Entries<string>[] = [entries];
	const valueStack: SchemaArrayValue = [];
	let result: SchemaValue | undefined;

	const visitor: SchemaDefinitionVisitor<Event> = {
		*onEnter(node, ctx) {
			yield {
				type: EventType.Enter,
				ctx,
				schema: node
			};
		},
		*onLeave(node, ctx) {
			yield {
				type: EventType.Leave,
				ctx,
				schema: node
			};
		}
	};

	function pushFilterComponent(cmp: string) {
		keyFilter += cmp;
		lengthsStack.push(cmp.length);
	}

	function popFilterComponent() {
		const len = lengthsStack.pop()!;
		keyFilter = keyFilter.slice(0, -len);
	}

	function pushEntries() {
		const last = entriesStack[entriesStack.length - 1];
		const regExp = new RegExp(keyFilter + "\\b");
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

	function popEntries() {
		entriesStack.pop();
	}

	function pushValue(schema: SchemaDefinition) {
		if (typeof schema === "boolean") {
			valueStack.push(undefined);
			return
		}
		switch(getSimpleSchemaType(schema)) {
			case "array":
				valueStack.push([]);
				break;
			case "object":
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
			case "array": {
				const array = valueStack[valueStack.length - 1] as SchemaArrayValue;
				array[ctx.index] = value;
				break;
			}
			case "record": {
				const record = valueStack[valueStack.length - 1] as SchemaObjectValue;
				record[ctx.property] = value;
				break;
			}
			case "root": {
				result = value;
				break;
			}
			default:
				throw new Error(`Handling of "${ctx.type}" context is not implemented`);
		}
	}

	for (const event of traverseSchemaDefinition(schema, visitor)) {
		switch (event.type) {
			case EventType.Enter: {
				switch (event.ctx.type) {
					case 'root': {
						pushFilterComponent(`^${idPrefix}`);
						pushEntries();
						pushValue(event.schema);
						continue;
					}
					case "record": {
						pushFilterComponent(`${idSeparator}${event.ctx.property}`);
						pushEntries();
						pushValue(event.schema);
						continue;
					}
				}
				continue;
			}
			case EventType.Leave: {
				const currentEntries = entriesStack[entriesStack.length - 1];
				if (currentEntries.length > 0) {;
					valueStack[valueStack.length - 1] = convertValue(event.schema, currentEntries);;
				}
				popValue(event.ctx);
				popEntries();
				popFilterComponent();
				continue;
			}
			default: {
				const neverEvent: never = event;
				throw new Error(`Unknown event: ${JSON.stringify(neverEvent)}`);
			}
		}
	}

	return result;
}
