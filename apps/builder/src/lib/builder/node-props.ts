import { DEFAULT_BOOLEAN_ENUM } from '@sjsf/form';

import type { NodeId } from './node-base.js';
import type { Node } from './node.js';
import {
	isArrayNode,
	isBooleanNode,
	isCustomizableNode,
	isEnumNode,
	isGridNode,
	isMultiEnumNode,
	isObjectNode,
	isRangeNode
} from './node-guards.js';
import { EnumValueType } from './enum.js';

export function getNodeTitle(node: Node): string | undefined {
	return isCustomizableNode(node) ? node.options.title : undefined;
}

export function getNodeProperties(node: Node): Map<NodeId, string> {
	const map = new Map<NodeId, string>();
	if (isObjectNode(node)) {
		for (let i = 0; i < node.properties.length; i++) {
			const { id, property } = node.properties[i];
			map.set(id, getNodeTitle(property) ?? `Property ${i + 1}`);
		}
	} else if (isGridNode(node)) {
		for (let i = 0; i < node.cells.length; i++) {
			const { node: cell, x, y } = node.cells[i];
			map.set(cell.id, getNodeTitle(cell) ?? `Cell (${x + 1}, ${y + 1})`);
		}
	} else if (isRangeNode(node)) {
		map.set(node.startNode.id, 'Start');
		map.set(node.endNode.id, 'End');
	}
	return map;
}

export function getNodeProperty(n: Node, propertyId: NodeId) {
	if (isObjectNode(n)) {
		return n.properties.find((p) => p.id === propertyId)?.property;
	}
	if (isGridNode(n)) {
		return n.cells.find((c) => c.node.id === propertyId)?.node;
	}
	if (isRangeNode(n)) {
		return n.startNode.id === propertyId
			? n.startNode
			: n.endNode.id === propertyId
				? n.endNode
				: undefined;
	}
	return null;
}

export interface NodeOption {
	id: string;
	label: string;
	value: string;
}

const BOOLEAN_OPTIONS: NodeOption[] = DEFAULT_BOOLEAN_ENUM.map((v, i) => ({
	id: `bool::${i}`,
	label: String(v),
	value: JSON.stringify(v)
}));

export function getNodeOptions(node: Node): NodeOption[] {
	if (isBooleanNode(node)) {
		return BOOLEAN_OPTIONS;
	}
	if (isEnumNode(node) || isMultiEnumNode(node)) {
		const isJson = node.valueType === EnumValueType.JSON;
		return node.items.map((item) => ({
			id: item.id,
			label: item.label,
			value: isJson ? item.value : JSON.stringify(item.value)
		}));
	}
	return [];
}

export function getNodeChild(node: Node) {
	if (isArrayNode(node)) {
		return node.item;
	}
	return undefined;
}
