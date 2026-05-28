export enum EnumValueType {
  String = "string",
  JSON = "json",
}

export const ENUM_VALUE_TYPE_TITLES: Record<EnumValueType, string> = {
  [EnumValueType.String]: "String",
  [EnumValueType.JSON]: "JSON",
};

export const ENUM_VALUE_TYPES = Object.values(EnumValueType);
