import {
	traverseSchemaDefinition,
	type SchemaDefinition,
	type SchemaDefinitionVisitor,
	type SchemaTraverserContextType
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
	node: SchemaTraverserContextType;
}

interface LeaveEvent extends AbstractEvent<EventType.Leave> {
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
	convertValue
}: SchemaValueParserOptions): SchemaValue | undefined {
	if (entries.length === 0) {
		return undefined;
	}
	let keyFilter = '';
	const lengthsStack: number[] = [];
	const entriesStack: Entries<string>[] = [entries];
	let result: SchemaValue | undefined = undefined;

	const visitor: SchemaDefinitionVisitor<Event> = {
		*onEnter(node, ctx) {
			yield {
				type: EventType.Enter,
				node: ctx.type
			};
		},
		*onLeave(node) {
			yield {
				type: EventType.Leave,
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
		const regExp = new RegExp(keyFilter);
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

	for (const event of traverseSchemaDefinition(schema, visitor)) {
		switch (event.type) {
			case EventType.Enter: {
				switch (event.node) {
					case 'root': {
						pushFilterComponent(`^${idPrefix}`);
						pushEntries();
					}
				}
				continue;
			}
			case EventType.Leave: {
				const last = entriesStack[entriesStack.length - 1];
				if (last.length === 0) {
					continue;
				}
				result = convertValue(event.schema, last);
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
