export enum RangeValueType {
	String = 'string'
}

export const RANGE_VALUE_TYPE_TITLES: Record<RangeValueType, string> = {
	[RangeValueType.String]: 'String'
};

export const RANGE_VALUE_TYPES = Object.values(RangeValueType);
