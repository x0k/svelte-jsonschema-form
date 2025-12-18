import { isObject } from '@sjsf/form/lib/object';
import type { CompatibleComponentType, Schema, UiSchemaRoot } from '@sjsf/form';

import { constant } from '$lib/function.js';
import { ActualTheme, LabTheme, type Theme, type WidgetType } from '$lib/sjsf/theme.js';
import {
	NodeType,
	RangeValueType,
	type AbstractNode,
	type CustomizableNodeType,
	type Node
} from '$lib/builder/index.js';

import { WIDGET_NAMES } from './model.js';

type Factory<T extends NodeType, R> = (node: Extract<Node, AbstractNode<T>>) => R;

type Factories<R> = { [T in NodeType]?: Factory<T, R> };

const basicThemeSchema: Factories<Schema> = {
	[NodeType.Enum]: constant({
		properties: {
			widget: {
				enum: ['selectWidget', 'radioWidget'] satisfies CompatibleComponentType<'selectWidget'>[]
			}
		}
	}),
	[NodeType.MultiEnum]: constant({
		properties: {
			widget: {
				enum: [
					'checkboxesWidget',
					'multiSelectWidget'
				] satisfies CompatibleComponentType<'checkboxesWidget'>[]
			}
		}
	}),
	[NodeType.String]: constant({
		properties: {
			widget: {
				enum: [
					'textWidget',
					'textareaWidget',
					'datePickerWidget'
				] satisfies CompatibleComponentType<'textWidget'>[]
			}
		}
	}),
	[NodeType.Number]: constant({
		properties: {
			widget: {
				enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
			}
		}
	}),
	[NodeType.Boolean]: constant({
		properties: {
			widget: {
				enum: ['checkboxWidget'] satisfies CompatibleComponentType<'checkboxWidget'>[]
			}
		}
	}),
	[NodeType.File]: constant({
		properties: {
			widget: {
				enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
			}
		}
	})
};

export const THEME_SCHEMAS: Record<Theme, Factories<Schema>> = {
	[ActualTheme.Basic]: basicThemeSchema,
	[ActualTheme.Pico]: basicThemeSchema,
	[ActualTheme.Daisy5]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'radioButtonsWidget',
						'daisyui5FilterRadioButtonsWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget',
						'daisyui5CallyDatePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: [
						'numberWidget',
						'rangeWidget',
						'ratingWidget'
					] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.File]: constant({
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		})
	},
	[ActualTheme.Flowbite3]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'radioButtonsWidget',
						'flowbite3ToggleRadioButtonsWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.File]: constant({
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		}),
		[NodeType.Tags]: constant({
			properties: {
				widget: {
					enum: ['tagsWidget'] satisfies CompatibleComponentType<'tagsWidget'>[]
				}
			}
		}),
		[NodeType.Range]: (node) => ({
			properties: {
				widget: {
					[RangeValueType.String]: {
						enum: [
							'dateRangePickerWidget'
						] satisfies CompatibleComponentType<'dateRangePickerWidget'>[]
					} satisfies Schema,
					[RangeValueType.Number]: {} satisfies Schema
				}[node.valueType]
			}
		})
	},
	[ActualTheme.Skeleton4]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'radioButtonsWidget',
						'comboboxWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: [
						'numberWidget',
						'rangeWidget',
						'skeleton4SliderWidget',
						'ratingWidget'
					] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.File]: constant({
			properties: {
				widget: {
					enum: [
						'fileWidget',
						'skeleton4FileUploadWidget'
					] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		}),
		[NodeType.Tags]: constant({
			properties: {
				widget: {
					enum: ['tagsWidget'] satisfies CompatibleComponentType<'tagsWidget'>[]
				}
			}
		}),
		[NodeType.Range]: (node) => ({
			properties: {
				widget: {
					enum: {
						[RangeValueType.String]: [
							'dateRangePickerWidget'
						] satisfies CompatibleComponentType<'dateRangePickerWidget'>[],
						[RangeValueType.Number]: [
							'rangeSliderWidget'
						] satisfies CompatibleComponentType<'rangeSliderWidget'>[]
					}[node.valueType]
				}
			}
		})
	},
	[ActualTheme.Shadcn4]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'comboboxWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.File]: constant({
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		}),
		[NodeType.Range]: (node) => ({
			properties: {
				widget: {
					enum: {
						[RangeValueType.String]: [
							'dateRangePickerWidget'
						] satisfies CompatibleComponentType<'dateRangePickerWidget'>[],
						[RangeValueType.Number]: [
							'rangeSliderWidget'
						] satisfies CompatibleComponentType<'rangeSliderWidget'>[]
					}[node.valueType]
				}
			}
		})
	},
	[LabTheme.Svar]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'radioButtonsWidget',
						'comboboxWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget',
						'svarColorPickerWidget',
						'svarColorSelectWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.Range]: (node) => ({
			properties: {
				widget: {
					[RangeValueType.String]: {
						enum: [
							'dateRangePickerWidget'
						] satisfies CompatibleComponentType<'dateRangePickerWidget'>[]
					},
					[RangeValueType.Number]: {}
				}[node.valueType]
			}
		})
	},
	[LabTheme.BeerCSS]: {
		[NodeType.Enum]: constant({
			properties: {
				widget: {
					enum: ['selectWidget', 'radioWidget'] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		}),
		[NodeType.MultiEnum]: constant({
			properties: {
				widget: {
					enum: ['checkboxesWidget'] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		}),
		[NodeType.String]: constant({
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		}),
		[NodeType.Number]: constant({
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		}),
		[NodeType.Boolean]: constant({
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		}),
		[NodeType.File]: constant({
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		})
	}
};

export const THEME_UI_SCHEMAS: Record<Theme, Factories<UiSchemaRoot | undefined>> = {
	[ActualTheme.Basic]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Basic]),
	[ActualTheme.Pico]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Pico]),
	[ActualTheme.Daisy5]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Daisy5]),
	[ActualTheme.Flowbite3]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Flowbite3]),
	[ActualTheme.Skeleton4]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Skeleton4]),
	[ActualTheme.Shadcn4]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Shadcn4]),
	[LabTheme.Svar]: schemasToEnumNames(THEME_SCHEMAS[LabTheme.Svar]),
	[LabTheme.BeerCSS]: schemasToEnumNames(THEME_SCHEMAS[LabTheme.BeerCSS])
};

function schemasToEnumNames(schemas: Factories<Schema>) {
	const result: Factories<UiSchemaRoot | undefined> = {};
	for (const [type, schema] of Object.entries(schemas)) {
		const uiSchema = schemaToEnumNames(schema as never);
		result[type as NodeType] = uiSchema;
	}
	return result;
}

function schemaToEnumNames<T extends NodeType>(factory: Factory<T, Schema>) {
	return (node: Extract<Node, AbstractNode<T>>): UiSchemaRoot | undefined => {
		const schema = factory(node);
		const widget = schema.properties?.widget;
		if (
			widget === undefined ||
			!isObject(widget) ||
			widget.enum === undefined ||
			widget.enum.some((v) => typeof v !== 'string' || !(v in WIDGET_NAMES))
		) {
			return undefined;
		}
		return {
			widget: {
				'ui:options': {
					enumNames: widget.enum.map((v) => WIDGET_NAMES[v as WidgetType])
				}
			}
		};
	};
}

const BASIC_THEME_CUSTOMIZABLE_NODE_TYPES = [
	NodeType.Object,
	NodeType.Grid,
	NodeType.Array,
	NodeType.Enum,
	NodeType.MultiEnum,
	NodeType.String,
	NodeType.Number,
	NodeType.Boolean,
	NodeType.File
] satisfies CustomizableNodeType[];

export const THEME_CUSTOMIZABLE_NODE_TYPES: Record<Theme, CustomizableNodeType[]> = {
	[ActualTheme.Basic]: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
	[ActualTheme.Pico]: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
	[ActualTheme.Daisy5]: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES,
	[ActualTheme.Flowbite3]: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Tags, NodeType.Range],
	[ActualTheme.Skeleton4]: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Tags, NodeType.Range],
	[ActualTheme.Shadcn4]: [...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES, NodeType.Range],
	[LabTheme.Svar]: [
		...BASIC_THEME_CUSTOMIZABLE_NODE_TYPES.filter((t) => t !== NodeType.File),
		NodeType.Range
	],
	[LabTheme.BeerCSS]: BASIC_THEME_CUSTOMIZABLE_NODE_TYPES
};

export const THEME_RANGE_VALUE_TYPES: Record<Theme, RangeValueType[]> = {
	[ActualTheme.Basic]: [],
	[ActualTheme.Pico]: [],
	[ActualTheme.Daisy5]: [],
	[ActualTheme.Flowbite3]: [RangeValueType.String],
	[ActualTheme.Skeleton4]: [RangeValueType.String, RangeValueType.Number],
	[ActualTheme.Shadcn4]: [RangeValueType.String, RangeValueType.Number],
	[LabTheme.Svar]: [RangeValueType.String],
	[LabTheme.BeerCSS]: []
};

export const THEME_APP_CSS: Record<Theme, string> = {
	[ActualTheme.Basic]: "@import '@sjsf/basic-theme/css/basic.css';",
	[ActualTheme.Pico]:
		"@import '@picocss/pico/css/pico.css';\n@import '@sjsf/basic-theme/css/pico.css';",
	[ActualTheme.Daisy5]: '@source "../node_modules/@sjsf/daisyui5-theme/dist";',
	[ActualTheme.Flowbite3]: '@source "../node_modules/@sjsf/flowbite3-theme/dist";',
	[ActualTheme.Skeleton4]: '@source "../node_modules/@sjsf/skeleton3-theme/dist";',
	[ActualTheme.Shadcn4]: '@source "../node_modules/@sjsf/shadcn4-theme/dist";',
	[LabTheme.Svar]: '',
	[LabTheme.BeerCSS]: ''
};
