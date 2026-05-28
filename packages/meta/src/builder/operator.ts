export enum OperatorType {
  And = "and",
  Or = "or",
  Xor = "xor",
  Not = "not",
  Eq = "eq",
  In = "in",
  Format = "format",
  Pattern = "pattern",
  MinLength = "minLength",
  MaxLength = "maxLength",
  Less = "less",
  LessOrEq = "lessOrEq",
  Greater = "greater",
  GreaterOrEq = "greaterOrEq",
  MultipleOf = "multipleOf",
  Contains = "contains",
  MinItems = "minItems",
  MaxItems = "maxItems",
  UniqueItems = "uniqueItems",
  HasProperty = "has",
  Property = "property",
}

export const OPERATOR_TITLES: Record<OperatorType, string> = {
  [OperatorType.And]: "And",
  [OperatorType.Or]: "Or",
  [OperatorType.Xor]: "Xor",
  [OperatorType.Not]: "Not",
  [OperatorType.Eq]: "Equal",
  [OperatorType.In]: "In",
  [OperatorType.Format]: "Format",
  [OperatorType.Pattern]: "Pattern",
  [OperatorType.MinLength]: "MinLength",
  [OperatorType.MaxLength]: "MaxLength",
  [OperatorType.Less]: "Less",
  [OperatorType.LessOrEq]: "LessOrEq",
  [OperatorType.Greater]: "Greater",
  [OperatorType.GreaterOrEq]: "GreaterOrEq",
  [OperatorType.MultipleOf]: "MultipleOf",
  [OperatorType.Contains]: "Contains",
  [OperatorType.MinItems]: "MinItems",
  [OperatorType.MaxItems]: "MaxItems",
  [OperatorType.UniqueItems]: "UniqueItems",
  [OperatorType.HasProperty]: "HasProperty",
  [OperatorType.Property]: "Property",
};

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

const U_OPERATORS = [OperatorType.Not, OperatorType.Contains] as const;

export const U_OPERATORS_SET = new Set<OperatorType>(U_OPERATORS);

export type UOperatorType = (typeof U_OPERATORS)[number];

const S_OPERATORS = [OperatorType.Format, OperatorType.Pattern] as const;

export const S_OPERATORS_SET = new Set<OperatorType>(S_OPERATORS);

export type SOperatorType = (typeof S_OPERATORS)[number];

const COMPARATOR_OPERATORS = [
  OperatorType.Greater,
  OperatorType.GreaterOrEq,
  OperatorType.Less,
  OperatorType.LessOrEq,
  OperatorType.MultipleOf,
  OperatorType.MinLength,
  OperatorType.MaxLength,
  OperatorType.MinItems,
  OperatorType.MaxItems,
] as const;

export const COMPARISON_OPERATORS_SET = new Set<OperatorType>(
  COMPARATOR_OPERATORS,
);

export type ComparatorOperatorType = (typeof COMPARATOR_OPERATORS)[number];
