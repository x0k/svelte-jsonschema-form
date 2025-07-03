export enum OperatorType {
  And = "and",
  Or = "or",
  Xor = "xor",
  Not = "not",
  Eq = "eq",
  In = "in",
  Less = "less",
  LessOrEq = "lessOrEq",
  Greater = "greater",
  GreaterOrEq = "greaterOrEq",
  MultipleOf = "multipleOf",
  MinLength = "minLength",
  MaxLength = "maxLength",
  Pattern = "pattern",
}

export const OPERATOR_TITLES: Record<OperatorType, string> = {
  [OperatorType.And]: "And",
  [OperatorType.Or]: "Or",
  [OperatorType.Xor]: "Xor",
  [OperatorType.Not]: "Not",
  [OperatorType.Eq]: "Eq",
  [OperatorType.In]: "In",
  [OperatorType.Less]: "Less",
  [OperatorType.LessOrEq]: "LessOrEq",
  [OperatorType.Greater]: "Greater",
  [OperatorType.GreaterOrEq]: "GreaterOrEq",
  [OperatorType.MultipleOf]: "MultipleOf",
  [OperatorType.MinLength]: "MinLength",
  [OperatorType.MaxLength]: "MaxLength",
  [OperatorType.Pattern]: "Pattern",
}

export const OPERATOR_TYPES = Object.values(OperatorType);

export interface AbstractOperator<T extends OperatorType> {
  op: T;
}

const N_OPERATORS = [
  OperatorType.And,
  OperatorType.Or,
  OperatorType.Xor,
] as const;

export const N_OPERATORS_SET = new Set<OperatorType>(N_OPERATORS);

export type NOperatorType = (typeof N_OPERATORS)[number];

const COMPARATOR_OPERATORS = [
  OperatorType.Greater,
  OperatorType.GreaterOrEq,
  OperatorType.Less,
  OperatorType.LessOrEq,
  OperatorType.MultipleOf,
  OperatorType.MinLength,
  OperatorType.MaxLength,
] as const;

export const COMPARISON_OPERATORS_SET = new Set<OperatorType>(COMPARATOR_OPERATORS);

export type ComparatorOperatorType = (typeof COMPARATOR_OPERATORS)[number];
