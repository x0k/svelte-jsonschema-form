import {
  isJsonValueArray,
  isJsonValueBoolean,
  isJsonValueNumber,
  isJsonValueObject,
  isJsonValueString,
  isValidJson,
} from "$lib/json.js";
import { isValidRegExp } from "$lib/reg-exp.js";

import {
  isArrayNode,
  isBooleanNode,
  isContainsOperator,
  isCustomizableNode,
  isFileNode,
  isGridNode,
  isNumberNode,
  isObjectNode,
  isOperatorNode,
  isStringNode,
  isTagsNode,
} from "./node-guards.js";
import { getNodeOptions } from "./node-props.js";
import {
  NodeType,
  type AbstractNode,
  type ComparisonOperator,
  type CustomizableNode,
  type Node,
  type NodeId,
  type NOperator,
  type Operator,
  type OperatorNode,
  type UOperator,
} from "./node.js";
import { OperatorType, type AbstractOperator } from "./operator.js";

interface ValidatorRegistries {
  complementary: NodeId | undefined;
  affectedNode: Node;
  parentNode: Node;
}

interface ValidatorContext {
  validateCustomizableNodeOptions: (node: CustomizableNode) => void;
  addError: (node: Node, message: string) => void;
  addWarning: (node: Node, message: string) => void;
  setContext<K extends keyof ValidatorRegistries>(
    registry: K,
    value: ValidatorRegistries[K]
  ): Disposable;
  getContext<K extends keyof ValidatorRegistries>(
    registry: K
  ): ValidatorRegistries[K] | undefined;
}

function checkAffected(
  ctx: ValidatorContext,
  node: Node,
  check: (node: Node) => void
) {
  const affected = ctx.getContext("affectedNode");
  if (affected === undefined) {
    ctx.addError(
      node,
      "It looks like you deleted the field to which this operator was applied"
    );
  } else {
    check(affected);
  }
}

function checkChildren<Args extends ReadonlyArray<any>>(
  ctx: ValidatorContext,
  self: Node,
  check: (ctx: ValidatorContext, ...args: Args) => void,
  ...args: Args
) {
  using _parent = ctx.setContext("parentNode", self);
  check(ctx, ...args);
}

function checkParent(
  ctx: ValidatorContext,
  node: Node,
  check: (node: Node) => void
) {
  const parent = ctx.getContext("parentNode");
  if (parent === undefined) {
    ctx.addError(node, "This node cannot be used in the root of the form");
  } else {
    check(parent);
  }
}

function validateNOperator(
  ctx: ValidatorContext,
  op: AbstractNode<NodeType.Operator> & NOperator
) {
  if (op.operands.length === 0) {
    ctx.addError(op, "Missing operands");
  } else if (op.operands.length === 1) {
    ctx.addWarning(op, "An operator with one operand is redundant");
  }
  checkChildren(ctx, op, () => {
    for (let i = 0; i < op.operands.length; i++) {
      validateOperator(ctx, op.operands[i]);
    }
  });
}

function validateUOperator(
  ctx: ValidatorContext,
  op: AbstractNode<NodeType.Operator> & UOperator
) {
  if (op.operand === undefined) {
    ctx.addError(op, "Missing operand");
  } else {
    checkChildren(ctx, op, validateOperator, op.operand);
  }
}

function validateComparisonOperator(
  ctx: ValidatorContext,
  op: AbstractNode<NodeType.Operator> & ComparisonOperator
) {}

const OPERATOR_VALIDATORS: {
  [T in OperatorType]: (
    ctx: ValidatorContext,
    operator: Extract<OperatorNode, AbstractOperator<T>>
  ) => void;
} = {
  [OperatorType.And]: validateNOperator,
  [OperatorType.Or]: validateNOperator,
  [OperatorType.Xor]: validateNOperator,
  [OperatorType.Not]: validateUOperator,
  // Shared
  [OperatorType.Eq]: (ctx, op) => {
    if (!isValidJson(op.value)) {
      ctx.addError(op, "The value must be in JSON format");
    } else {
      checkAffected(ctx, op, (affected) => {
        const options = getNodeOptions(affected);
        if (options.length > 0) {
          if (options.find((o) => o.value === op.value) === undefined) {
            ctx.addError(
              op,
              "The entered value does not correspond to the possible field values"
            );
          }
        } else if (isObjectNode(affected) || isGridNode(affected)) {
          if (!isJsonValueObject(op.value)) {
            ctx.addError(op, "The entered value should be a JSON object");
          }
        } else if (isArrayNode(affected)) {
          if (!isJsonValueArray(op.value)) {
            ctx.addError(op, "The entered value should be a JSON array");
          }
        } else if (isStringNode(affected)) {
          if (!isJsonValueString(op.value)) {
            ctx.addError(op, "The entered value should be a JSON string");
          }
        } else if (isNumberNode(affected)) {
          if (!isJsonValueNumber(op.value)) {
            ctx.addError(op, "The entered value should be a JSON number");
          }
        } else if (isBooleanNode(affected)) {
          if (!isJsonValueBoolean(op.value)) {
            ctx.addError(op, "The entered value should be a boolean");
          }
        } else if (isFileNode(affected)) {
          if (affected.options.multiple) {
            if (!isJsonValueArray(op.value)) {
              ctx.addError(op, "The entered value should be a JSON array");
            }
          } else {
            if (!isJsonValueString(op.value)) {
              ctx.addError(op, "The entered value should be a JSON string");
            }
          }
        } else if (isTagsNode(affected)) {
          checkParent(ctx, op, (parent) => {
            if (!isOperatorNode(parent) || !isContainsOperator(parent)) {
              if (!isJsonValueArray(op.value)) {
                ctx.addError(op, "The entered value should be a JSON array");
              }
            } else if (isContainsOperator(parent)) {
              if (!isJsonValueString(op.value)) {
                ctx.addError(op, "The entered value should be a JSON string");
              }
            }
          });
        }
      });
    }
  },
  [OperatorType.In]: (ctx, op) => {
    if (op.values.length === 0) {
      ctx.addError(op, "Add at least one value");
    } else if (op.values.length === 1) {
      ctx.addWarning(
        op,
        "The `In` operator with one value is redundant, use the `Equal` operator"
      );
    }
    const invalid = op.values.filter((v) => !isValidJson(v));
    if (invalid.length > 0) {
      ctx.addError(
        op,
        `The following values must be in JSON format: "${invalid.join('", "')}"`
      );
    } else if (op.values.length > 0) {
      checkAffected(ctx, op, (affected) => {
        const options = getNodeOptions(affected);
        if (options.length === 0) {
          return;
        }
        if (options.find((o) => o.value === op.value) === undefined) {
          ctx.addError(
            op,
            "The entered value does not correspond to the possible field values"
          );
        }
      });
    }
  },
  // String
  [OperatorType.Pattern]: (ctx, op) => {
    if (!isValidRegExp(op.value)) {
      ctx.addError(op, "Invalid regular expression");
    } else if (op.value.length === 0) {
      ctx.addWarning(
        op,
        "It looks like you forgot to fill in the value, if not, then ignore this warning message"
      );
    }
    checkAffected(ctx, op, (affected) => {
      if (!isStringNode(affected)) {
        ctx.addError(op, "The operator can only be applied to string fields");
      }
    });
  },
  [OperatorType.MinLength]: (ctx, op) => {},
  [OperatorType.MaxLength]: (ctx, op) => {},
  // Number
  [OperatorType.Less]: (ctx, op) => {},
  [OperatorType.LessOrEq]: (ctx, op) => {},
  [OperatorType.Greater]: (ctx, op) => {},
  [OperatorType.GreaterOrEq]: (ctx, op) => {},
  [OperatorType.MultipleOf]: (ctx, op) => {},
  // Array
  [OperatorType.Contains]: (ctx, op) => {},
  [OperatorType.MinItems]: (ctx, op) => {},
  [OperatorType.MaxItems]: (ctx, op) => {},
  [OperatorType.UniqueItems]: (ctx, op) => {},
  // Object
  [OperatorType.HasProperty]: (ctx, op) => {},
  [OperatorType.Property]: (ctx, op) => {},
};

function validateOperator(ctx: ValidatorContext, op: Operator) {
  OPERATOR_VALIDATORS[op.op](ctx, op as never);
}

const NODE_VALIDATORS: {
  [T in NodeType]: (
    ctx: ValidatorContext,
    node: Extract<Node, AbstractNode<T>>
  ) => void;
} = {
  [NodeType.Object]: (ctx, node) => {
    if (node.properties.length === 0) {
      ctx.addError(node, "Properties are missing");
    }
    for (let i = 0; i < node.properties.length; i++) {
      validateChildNode(ctx, node.properties[i]);
    }
  },
  [NodeType.ObjectProperty]: (ctx, node) => {
    if (
      node.complementary !== undefined &&
      node.dependencies.find((d) => d.id === node.complementary) === undefined
    ) {
      ctx.addError(
        node,
        "Invalid `addition` mark, try selecting/unselecting this mark"
      );
    } else if (
      node.complementary === undefined &&
      node.dependencies.length === 1
    ) {
      ctx.addError(
        node,
        "The only dependency should be marked as `Complement`"
      );
    }
    validateChildNode(ctx, node.property);
    using _complementary = ctx.setContext("complementary", node.complementary);
    using _affected = ctx.setContext("affectedNode", node.property);
    const emptyDeps: NodeId[] = [];
    for (let i = 0; i < node.dependencies.length; i++) {
      const dep = node.dependencies[i];
      if (dep.properties.length === 0) {
        emptyDeps.push(dep.id);
      }
      validateChildNode(ctx, node.dependencies[i]);
    }
    if (emptyDeps.length > 1) {
      ctx.addWarning(
        node,
        "You have more than one empty dependency, perhaps you can merge them using the `Or` operator"
      );
    }
  },
  [NodeType.ObjectPropertyDependency]: (ctx, node) => {
    const complementary = ctx.getContext("complementary");
    if (node.predicate === undefined && complementary !== node.id) {
      ctx.addError(
        node,
        "Specify the predicate or mark the dependency as `Complement`"
      );
    }
    // NOTE: dependency may not have properties
    if (node.predicate !== undefined) {
      validateChildNode(ctx, node.predicate);
    }
    for (let i = 0; node.properties.length < i; i++) {
      validateChildNode(ctx, node.properties[i]);
    }
  },
  [NodeType.Predicate]: (ctx, node) => {
    if (node.operator === undefined) {
      ctx.addError(node, "Specify the operator");
    } else {
      validateChildNode(ctx, node.operator);
    }
  },
  [NodeType.Operator]: validateOperator,
  [NodeType.Array]: (ctx, node) => {},
  [NodeType.Grid]: (ctx, node) => {},
  [NodeType.Enum]: (ctx, node) => {},
  [NodeType.MultiEnum]: (ctx, node) => {},
  [NodeType.EnumItem]: (ctx, node) => {},
  [NodeType.String]: (ctx, node) => {},
  [NodeType.Number]: (ctx, node) => {},
  [NodeType.Boolean]: (ctx, node) => {},
  [NodeType.File]: (ctx, node) => {},
  [NodeType.Tags]: (ctx, node) => {},
};

export function validateNode(ctx: ValidatorContext, node: Node) {
  if (isCustomizableNode(node)) {
    ctx.validateCustomizableNodeOptions(node);
  }
  NODE_VALIDATORS[node.type](ctx, node as never);
}
