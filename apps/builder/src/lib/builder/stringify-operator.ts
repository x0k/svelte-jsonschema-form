import { isValidRegExp } from "$lib/reg-exp.js";

import { EnumValueType } from "./enum.js";
import { OperatorType } from "./operator.js";
import { type Node, type Operator } from "./node.js";
import { getNodeProperty, getNodeTitle } from "./node-props.js";

export type StringifiedOperator = { ok: boolean; value: string };

export function stringifyOperator(
  operator: Operator,
  node: Node | undefined
): StringifiedOperator {
  switch (operator.op) {
    case OperatorType.And:
    case OperatorType.Or:
    case OperatorType.Xor: {
      if (operator.operands.length === 0) {
        return { ok: false, value: `${operator.op}(<no args>)` };
      }
      let ok = true;
      const values: string[] = [];
      for (const operand of operator.operands) {
        const r = stringifyOperator(operand, node);
        ok &&= r.ok;
        values.push(r.value);
      }
      return {
        ok,
        value: `${operator.op}(${values.join(", ")})`,
      };
    }
    case OperatorType.Contains:
    case OperatorType.Not: {
      if (operator.operand === undefined) {
        return {
          ok: false,
          value: `${operator.op}(<undefined>)`,
        };
      }
      const r = stringifyOperator(operator.operand, node);
      return {
        ok: r.ok,
        value: `${operator.op}(${r.value})`,
      };
    }
    case OperatorType.Eq: {
      return {
        ok: true,
        value: `${operator.op}(${operator.value})`,
      };
    }
    case OperatorType.In: {
      const haveItems = operator.values.length > 0;
      return {
        ok: haveItems,
        value: `${operator.op}(${
          haveItems ? operator.values.join(", ") : "<no values>"
        })`,
      };
    }
    case OperatorType.Pattern: {
      const ok =
        operator.op !== OperatorType.Pattern || isValidRegExp(operator.value);
      return {
        ok,
        value: `${operator.op}(${ok ? operator.value : "<invalid value>"})`,
      };
    }
    case OperatorType.UniqueItems: {
      return {
        ok: true,
        value: operator.op,
      };
    }
    case OperatorType.HasProperty: {
      const prop =
        node &&
        operator.propertyId &&
        getNodeProperty(node, operator.propertyId);
      const propTitle = (prop && getNodeTitle(prop)) ?? operator.propertyId;
      return {
        ok: prop !== undefined,
        value: `${operator.op}(${propTitle ? `"${propTitle}"` : "<undefined>"})`,
      };
    }
    case OperatorType.Property: {
      const prop =
        node &&
        operator.propertyId &&
        getNodeProperty(node, operator.propertyId);
      const r = operator.operator && stringifyOperator(operator.operator, prop);
      const propTitle = (prop && getNodeTitle(prop)) ?? operator.propertyId;
      return {
        ok: r?.ok === true,
        value: `${operator.op}(${propTitle ? `"${propTitle}"` : "<undefined>"}, ${r?.value ?? "<undefined>"})`,
      };
    }
    default: {
      const ok = operator.value !== undefined;
      return {
        ok,
        value: `${operator.op}(${ok ? operator.value : "<undefined>"})`,
      };
    }
  }
}
