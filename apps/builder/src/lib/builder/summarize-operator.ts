import { isValidRegExp } from '$lib/reg-exp.js';

import { OperatorType } from './operator.js';
import { type Node, type OperatorNode } from './node.js';
import { getNodeChild, getNodeProperty, getNodeTitle } from './node-props.js';
import { isContainsOperator } from './node-guards.js';

export type OperatorStatus = number;

export const OK_STATUS = 0;
export const ERROR_STATUS = 1;
export const WARNING_STATUS = ERROR_STATUS << 1;

export type StringifiedOperator = { status: OperatorStatus; value: string };

export interface SummarizerContext {
	operatorStatus(operator: OperatorNode): OperatorStatus;
}

export function summarizeOperator(
	ctx: SummarizerContext,
	operator: OperatorNode,
	node: Node | undefined
): StringifiedOperator {
	let status = ctx.operatorStatus(operator);
	switch (operator.op) {
		case OperatorType.And:
		case OperatorType.Or:
		case OperatorType.Xor: {
			if (operator.operands.length === 0) {
				return {
					status: status | ERROR_STATUS,
					value: `${operator.op}(<undefined>)`
				};
			}
			const values: string[] = [];
			for (const operand of operator.operands) {
				const r = summarizeOperator(ctx, operand, node);
				status |= r.status;
				values.push(r.value);
			}
			return {
				status,
				value: `${operator.op}(${values.join(', ')})`
			};
		}
		case OperatorType.Contains:
		case OperatorType.Not: {
			if (operator.operand === undefined) {
				return {
					status: status | ERROR_STATUS,
					value: `${operator.op}(<undefined>)`
				};
			}
			const r = summarizeOperator(
				ctx,
				operator.operand,
				node && (isContainsOperator(operator) ? getNodeChild(node) : node)
			);
			return {
				status: status | r.status,
				value: `${operator.op}(${r.value})`
			};
		}
		case OperatorType.Eq: {
			return {
				status,
				value: `${operator.op}(${operator.value})`
			};
		}
		case OperatorType.In: {
			const haveItems = operator.values.length > 0;
			return {
				status: status | (haveItems ? OK_STATUS : ERROR_STATUS),
				value: `${operator.op}([${haveItems ? operator.values.join(', ') : '<undefined>'}])`
			};
		}
		case OperatorType.Pattern: {
			const ok = isValidRegExp(operator.value);
			return {
				status: status | (ok ? OK_STATUS : ERROR_STATUS),
				value: `${operator.op}(${ok ? operator.value : '<invalid>'})`
			};
		}
		case OperatorType.UniqueItems: {
			return {
				status,
				value: operator.op
			};
		}
		case OperatorType.HasProperty: {
			const prop =
				node && operator.propertyId && (getNodeProperty(node, operator.propertyId) ?? undefined);
			const propTitle = (prop && getNodeTitle(prop)) ?? operator.propertyId;
			return {
				status: status | (prop !== undefined ? OK_STATUS : ERROR_STATUS),
				value: `${operator.op}(${propTitle ? `"${propTitle}"` : '<undefined>'})`
			};
		}
		case OperatorType.Property: {
			const prop =
				node && operator.propertyId && (getNodeProperty(node, operator.propertyId) ?? undefined);
			const r = operator.operator && summarizeOperator(ctx, operator.operator, prop);
			const propTitle = (prop && getNodeTitle(prop)) ?? operator.propertyId;
			return {
				status: status | (r?.status ?? ERROR_STATUS),
				value: `${operator.op}(${propTitle ? `"${propTitle}"` : '<undefined>'}, ${r?.value ?? '<undefined>'})`
			};
		}
		default: {
			const ok = operator.value !== undefined;
			return {
				status: status | (ok ? OK_STATUS : ERROR_STATUS),
				value: `${operator.op}(${ok ? operator.value : '<undefined>'})`
			};
		}
	}
}
