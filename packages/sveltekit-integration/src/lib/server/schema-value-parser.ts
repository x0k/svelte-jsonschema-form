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

export interface SchemaValueParserOptions<T> {
	schema: Schema;
	entries: Entry<T>[];
	idPrefix: string;
	idSeparator: string;
	idPseudoSeparator: string;
	convertValue: (schema: SchemaDefinition, value: T) => SchemaValue | undefined;
}

export function parseSchemaValue<T>({
	schema,
	entries,
	idPrefix,
	convertValue
}: SchemaValueParserOptions<T>): SchemaValue | undefined {
  if (entries.length === 0) {
    return undefined;
  }
	let keyFilter = '';
	const lengthsStack: number[] = [];
	const entriesStack: Entries<T>[] = [entries];
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
		const right: Entries<T> = [];
		const left: Entries<T> = [];
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
				if (last.length > 1) {
					throw new Error(`Too many entries for ${keyFilter}`);
				}
				const [, value] = last[0];
				result = convertValue(event.schema, value);
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
