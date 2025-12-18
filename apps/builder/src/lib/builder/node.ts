import type { Schema, UiOptions, UiSchemaRoot } from '@sjsf/form';
import type { FromSchema } from 'json-schema-to-ts';

import { mergeUiSchemas } from '$lib/sjsf/theme.js';
import { mergeSchemas } from '$lib/json-schema.js';
import { constant } from '$lib/function.js';

import {
	OperatorType,
	type AbstractOperator,
	type ComparatorOperatorType,
	type NOperatorType,
	type SOperatorType,
	type UOperatorType
} from './operator.js';
import { EnumValueType } from './enum.js';
import {
	COMMON_OPTIONS_SCHEMA,
	NodeType,
	type AbstractCustomizableNode,
	type AbstractNode,
	type NodeId
} from './node-base.js';
import { STRING_NODE_OPTIONS_SCHEMA, type StringNode } from './string-node.js';
import { NUMBER_NODE_OPTIONS_SCHEMA, type NumberNode } from './number-node.js';
import { RANGE_NODE_OPTIONS_SCHEMA, type RangeNode } from './range-node.js';

export interface PredicateNode extends AbstractNode<NodeType.Predicate> {
	operator: OperatorNode | undefined;
}

export interface AbstractComparisonOperator<
	T extends ComparatorOperatorType
> extends AbstractOperator<T> {
	value: number | undefined;
}

export interface AbstractUOperator<T extends UOperatorType> extends AbstractOperator<T> {
	operand: OperatorNode | undefined;
}

export interface AbstractNOperator<T extends NOperatorType> extends AbstractOperator<T> {
	operands: OperatorNode[];
}

export interface AbstractSOperator<T extends SOperatorType> extends AbstractOperator<T> {
	value: string;
}

export interface EqOperator extends AbstractOperator<OperatorType.Eq> {
	value: string;
}
export interface InOperator extends AbstractOperator<OperatorType.In> {
	values: string[];
}

export interface UniqueItemsOperator extends AbstractOperator<OperatorType.UniqueItems> {}

export interface PropertyOperator extends AbstractOperator<OperatorType.Property> {
	propertyId: NodeId | undefined;
	operator: OperatorNode | undefined;
}

export interface HasPropertyOperator extends AbstractOperator<OperatorType.HasProperty> {
	propertyId: NodeId | undefined;
}

type AbstractOperators = {
	[T in UOperatorType]: AbstractUOperator<T>;
} & {
	[T in NOperatorType]: AbstractNOperator<T>;
} & {
	[T in SOperatorType]: AbstractSOperator<T>;
} & {
	[T in ComparatorOperatorType]: AbstractComparisonOperator<T>;
};

export type ContainsOperator = AbstractOperators[OperatorType.Contains];

export type UOperator = AbstractOperators[UOperatorType];

export type NOperator = AbstractOperators[NOperatorType];

export type SOperator = AbstractOperators[SOperatorType];

export type ComparisonOperator = AbstractOperators[ComparatorOperatorType];

export type Operator =
	| EqOperator
	| InOperator
	| UniqueItemsOperator
	| UOperator
	| NOperator
	| SOperator
	| ComparisonOperator
	| HasPropertyOperator
	| PropertyOperator;

export type OperatorNode = AbstractNode<NodeType.Operator> & Operator;

export interface ObjectPropertyDependencyNode extends AbstractNode<NodeType.ObjectPropertyDependency> {
	predicate: PredicateNode | undefined;
	properties: ObjectPropertyNode[];
}

export interface ObjectPropertyNode extends AbstractNode<NodeType.ObjectProperty> {
	property: Node;
	complementary: NodeId | undefined;
	dependencies: ObjectPropertyDependencyNode[];
}

export const OBJECT_NODE_OPTIONS_SCHEMA = {
	title: 'Group options',
	type: 'object',
	properties: {}
} as const satisfies Schema;

export type ObjectOptions = FromSchema<typeof OBJECT_NODE_OPTIONS_SCHEMA>;

export interface ObjectNode extends AbstractCustomizableNode<NodeType.Object, ObjectOptions> {
	properties: ObjectPropertyNode[];
}

export const ARRAY_NODE_OPTIONS_SCHEMA = {
	title: 'List options',
	type: 'object',
	properties: {
		defaultValue: {
			title: 'Default value',
			type: 'array',
			items: {
				type: 'string',
				format: 'json'
			}
		},
		minItems: {
			title: 'Min items',
			type: 'number'
		},
		maxItems: {
			title: 'Max items',
			type: 'number'
		},
		uniqueItems: {
			title: 'Unique items',
			type: 'boolean'
		}
	}
} as const satisfies Schema;

export type ArrayNodeOptions = FromSchema<typeof ARRAY_NODE_OPTIONS_SCHEMA>;

export interface ArrayNode extends AbstractCustomizableNode<NodeType.Array, ArrayNodeOptions> {
	item: Node | undefined;
}

export interface GridCell {
	x: number;
	y: number;
	w: number;
	h: number;
	node: Node;
}

export const GRID_NODE_OPTIONS_SCHEMA = {
	title: 'Grid options',
	type: 'object',
	properties: {
		cellSize: {
			title: 'Cell size',
			enum: ['1fr', 'auto']
		},
		gap: {
			title: 'Gap',
			type: 'string'
		},
		additionalStyles: {
			title: 'Additional styles',
			type: 'string'
		}
	},
	required: ['cellSize', 'gap']
} as const satisfies Schema;

export type GridNodeOptions = FromSchema<typeof GRID_NODE_OPTIONS_SCHEMA>;

export interface GridNode extends AbstractCustomizableNode<NodeType.Grid, GridNodeOptions> {
	width: number;
	height: number;
	cells: GridCell[];
}

export interface EnumItemNode extends AbstractNode<NodeType.EnumItem> {
	label: string;
	value: string;
}

export const ENUM_OPTIONS_SCHEMA = {
	title: 'Choice options',
	type: 'object',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'selectWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		defaultValue: {
			title: 'Default value',
			type: 'string',
			format: 'json'
		}
	},
	required: ['widget'],
	dependencies: {
		widget: {
			oneOf: [
				{
					type: 'object',
					properties: {
						widget: {
							const: 'radioWidget'
						},
						inline: {
							title: 'Inline',
							type: 'boolean'
						}
					}
				},
				{
					properties: {
						widget: {
							not: {
								const: 'radioWidget'
							}
						}
					}
				}
			]
		}
	}
} as const satisfies Schema;

export type EnumOptions = FromSchema<typeof ENUM_OPTIONS_SCHEMA> &
	FromSchema<(typeof ENUM_OPTIONS_SCHEMA)['dependencies']['widget']['oneOf'][0]>;

export interface EnumNode extends AbstractCustomizableNode<NodeType.Enum, EnumOptions> {
	valueType: EnumValueType;
	items: EnumItemNode[];
}

export const MULTI_ENUM_OPTIONS_SCHEMA = {
	title: 'Multi choice options',
	type: 'object',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'checkboxesWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		defaultValue: {
			title: 'Default value',
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string',
				format: 'json'
			}
		},
		minItems: {
			title: 'Min items',
			type: 'number'
		},
		maxItems: {
			title: 'Max items',
			type: 'number'
		}
	},
	required: ['widget'],
	dependencies: {
		widget: {
			oneOf: [
				{
					type: 'object',
					properties: {
						widget: {
							const: 'checkboxesWidget'
						},
						inline: {
							title: 'Inline',
							type: 'boolean'
						}
					}
				},
				{
					properties: {
						widget: {
							not: {
								const: 'checkboxesWidget'
							}
						}
					}
				}
			]
		}
	}
} as const satisfies Schema;

export type MultiEnumOptions = FromSchema<typeof MULTI_ENUM_OPTIONS_SCHEMA> &
	FromSchema<(typeof MULTI_ENUM_OPTIONS_SCHEMA)['dependencies']['widget']['oneOf'][0]>;

export interface MultiEnumNode extends AbstractCustomizableNode<
	NodeType.MultiEnum,
	MultiEnumOptions
> {
	valueType: EnumValueType;
	items: EnumItemNode[];
}

export const BOOLEAN_NODE_OPTIONS_SCHEMA = {
	title: 'Boolean options',
	type: 'object',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'checkboxWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		default: {
			title: 'Default value',
			type: 'boolean'
		}
	},
	required: ['widget']
} as const satisfies Schema;

export type BooleanOptions = FromSchema<typeof BOOLEAN_NODE_OPTIONS_SCHEMA>;

export interface BooleanNode extends AbstractCustomizableNode<NodeType.Boolean, BooleanOptions> {}

export const FILE_NODE_OPTIONS_SCHEMA = {
	title: 'File options',
	type: 'object',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'fileWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		native: {
			title: 'Native',
			type: 'boolean'
		},
		multiple: {
			title: 'Multiple',
			type: 'boolean'
		}
	},
	dependencies: {
		multiple: {
			oneOf: [
				{
					type: 'object',
					properties: {
						multiple: {
							const: true
						},
						minItems: {
							title: 'Min items',
							type: 'number'
						},
						maxItems: {
							title: 'Max items',
							type: 'number'
						},
						uniqueItems: {
							title: 'Unique items',
							type: 'boolean'
						}
					}
				},
				{
					type: 'object',
					properties: {
						multiple: {
							const: false
						}
					}
				}
			]
		}
	},
	required: ['widget']
} as const satisfies Schema;

export type FileOptions = FromSchema<typeof FILE_NODE_OPTIONS_SCHEMA> &
	FromSchema<(typeof FILE_NODE_OPTIONS_SCHEMA)['dependencies']['multiple']['oneOf'][0]>;

export interface FileNode extends AbstractCustomizableNode<NodeType.File, FileOptions> {}

export const TAGS_NODE_OPTIONS_SCHEMA = {
	title: 'Tags options',
	type: 'object',
	properties: {
		widget: {
			title: 'Widget',
			type: 'string',
			default: 'tagsWidget'
		},
		help: {
			title: 'Help',
			type: 'string'
		},
		default: {
			title: 'Default value',
			type: 'array',
			uniqueItems: true,
			items: {
				type: 'string'
			}
		},
		minItems: {
			title: 'Min items',
			type: 'number'
		},
		maxItems: {
			title: 'Max items',
			type: 'number'
		}
	},
	required: ['widget']
} as const satisfies Schema;

export type TagsOptions = FromSchema<typeof TAGS_NODE_OPTIONS_SCHEMA>;

export interface TagsNode extends AbstractCustomizableNode<NodeType.Tags, TagsOptions> {}

export type Node =
	| ObjectNode
	| ObjectPropertyNode
	| ObjectPropertyDependencyNode
	| ArrayNode
	| GridNode
	| EnumNode
	| MultiEnumNode
	| EnumItemNode
	| StringNode
	| NumberNode
	| BooleanNode
	| FileNode
	| TagsNode
	| RangeNode
	| PredicateNode
	| OperatorNode;

export type CustomizableNode = Extract<Node, AbstractCustomizableNode<NodeType, any>>;
export type CustomizableNodeType = CustomizableNode['type'];

export type WidgetNode = Extract<Node, { options: { widget: string } }>;
export type WidgetNodeType = WidgetNode['type'];

export const CUSTOMIZABLE_TYPE_TITLES: Record<CustomizableNodeType, string> = {
	[NodeType.Object]: 'Group',
	[NodeType.Grid]: 'Grid',
	[NodeType.Array]: 'List',
	[NodeType.Enum]: 'Choice',
	[NodeType.MultiEnum]: 'Multi choice',
	[NodeType.String]: 'String',
	[NodeType.Number]: 'Number',
	[NodeType.Boolean]: 'Boolean',
	[NodeType.File]: 'File',
	[NodeType.Tags]: 'Tags',
	[NodeType.Range]: 'Range'
};

export const CUSTOMIZABLE_TYPES = Object.keys(CUSTOMIZABLE_TYPE_TITLES) as CustomizableNodeType[];

export const NODE_OPTIONS_SCHEMAS: {
	[T in CustomizableNodeType]: Schema;
} = {
	[NodeType.Object]: mergeSchemas(COMMON_OPTIONS_SCHEMA, OBJECT_NODE_OPTIONS_SCHEMA),
	[NodeType.Array]: mergeSchemas(COMMON_OPTIONS_SCHEMA, ARRAY_NODE_OPTIONS_SCHEMA),
	[NodeType.Grid]: mergeSchemas(COMMON_OPTIONS_SCHEMA, GRID_NODE_OPTIONS_SCHEMA),
	[NodeType.Enum]: mergeSchemas(COMMON_OPTIONS_SCHEMA, ENUM_OPTIONS_SCHEMA),
	[NodeType.MultiEnum]: mergeSchemas(COMMON_OPTIONS_SCHEMA, MULTI_ENUM_OPTIONS_SCHEMA),
	[NodeType.String]: mergeSchemas(COMMON_OPTIONS_SCHEMA, STRING_NODE_OPTIONS_SCHEMA),
	[NodeType.Number]: mergeSchemas(COMMON_OPTIONS_SCHEMA, NUMBER_NODE_OPTIONS_SCHEMA),
	[NodeType.Boolean]: mergeSchemas(COMMON_OPTIONS_SCHEMA, BOOLEAN_NODE_OPTIONS_SCHEMA),
	[NodeType.File]: mergeSchemas(COMMON_OPTIONS_SCHEMA, FILE_NODE_OPTIONS_SCHEMA),
	[NodeType.Tags]: mergeSchemas(COMMON_OPTIONS_SCHEMA, TAGS_NODE_OPTIONS_SCHEMA),
	[NodeType.Range]: mergeSchemas(COMMON_OPTIONS_SCHEMA, RANGE_NODE_OPTIONS_SCHEMA)
};

const COMMON_UI_SCHEMA: UiSchemaRoot = {
	'ui:options': {
		titleAttributes: {
			class: 'font-medium text-md py-2'
		}
	},
	description: {
		'ui:components': {
			textWidget: 'textareaWidget'
		}
	},
	defaultValue: {
		'ui:options': {
			titleAttributes: {
				class: 'font-medium text-md'
			}
		}
	},
	widget: {
		'ui:components': {
			stringField: 'enumField'
		}
	}
};

const ORDER = Object.keys(COMMON_OPTIONS_SCHEMA.properties);

function order(...titles: string[]): UiOptions {
	return {
		order: ORDER.concat(titles)
	};
}

export const NODE_OPTIONS_UI_SCHEMAS = {
	[NodeType.Object]: COMMON_UI_SCHEMA,
	[NodeType.Array]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		defaultValue: {
			items: {
				'ui:options': {
					shadcn4Text: {
						placeholder: 'Input JSON value'
					}
				}
			}
		}
	}),
	[NodeType.Grid]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		cellSize: {
			'ui:components': {
				stringField: 'enumField'
			}
		},
		gap: {
			'ui:options': {
				shadcn4Text: {
					placeholder: 'Input CSS unit'
				}
			}
		}
	}),
	[NodeType.Enum]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', 'inline', '*'),
		defaultValue: {
			'ui:options': {
				shadcn4Text: {
					placeholder: 'Input JSON value'
				}
			}
		}
	}),
	[NodeType.MultiEnum]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', 'inline', '*'),
		defaultValue: {
			items: {
				'ui:options': {
					shadcn4Text: {
						placeholder: 'Input JSON value'
					}
				}
			},
			'ui:options': {
				orderable: false
			}
		}
	}),
	[NodeType.String]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', 'inputType', 'placeholder', '*'),
		inputType: {
			'ui:components': {
				stringField: 'enumField'
			}
		}
	}),
	[NodeType.Number]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', '*')
	}),
	[NodeType.Boolean]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', '*'),
		defaultValue: {
			'ui:components': {
				booleanField: 'booleanSelectField',
				selectWidget: 'radioWidget'
			},
			'ui:options': {
				useLabel: false,
				enumNames: ['true', 'false'],
				shadcn4RadioGroup: {
					style: 'display: flex;'
				}
			}
		}
	}),
	[NodeType.File]: mergeUiSchemas(COMMON_UI_SCHEMA, {
		'ui:options': order('widget', 'native', 'multiple', '*', 'help')
	}),
	[NodeType.Tags]: COMMON_UI_SCHEMA,
	[NodeType.Range]: COMMON_UI_SCHEMA
} satisfies Record<CustomizableNodeType, UiSchemaRoot>;
