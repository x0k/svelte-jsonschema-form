import { pickSchemaType, typeOfValue } from '@sjsf/form/core';
import type { UiOptions, UiSchema } from '@sjsf/form';

import { constant } from '$lib/function.js';
import { Resolver } from '$lib/sjsf/resolver.js';
import {
	BOOLEAN_NODE_OPTIONS_SCHEMA,
	buildEnumValues,
	ENUM_OPTIONS_SCHEMA,
	FILE_NODE_OPTIONS_SCHEMA,
	MULTI_ENUM_OPTIONS_SCHEMA,
	NodeType,
	NUMBER_NODE_OPTIONS_SCHEMA,
	STRING_NODE_OPTIONS_SCHEMA,
	type AbstractNode,
	type Node,
	type TextWidgetParams,
	type WidgetNode,
	type WidgetNodeType
} from '$lib/builder/index.js';
import {
	ActualTheme,
	LabTheme,
	type Theme,
	type FieldType,
	type WidgetType
} from '$lib/sjsf/theme.js';

import type { BuilderDraggable } from './context.svelte.js';

export interface NodeProps<T extends NodeType> {
	node: Extract<Node, AbstractNode<T>>;
	draggable: BuilderDraggable;
	showRequired: boolean;
	unmount: () => void;
}

export enum RouteName {
	Editor = 'editor',
	Preview = 'preview'
}

export interface AbstractRoute<N extends RouteName> {
	name: N;
}

export interface EditorRoute extends AbstractRoute<RouteName.Editor> {}

export enum PreviewSubRouteName {
	Code = 'code',
	Schema = 'schema'
}

export interface PreviewRoute extends AbstractRoute<RouteName.Preview> {
	subRoute?: PreviewSubRouteName;
}

export type Route = EditorRoute | PreviewRoute;

function basicTextOptions(params: TextWidgetParams): UiOptions {
	return { text: { ...params } };
}

export const TEXT_WIDGET_OPTIONS: Record<Theme, (params: TextWidgetParams) => UiOptions> = {
	[ActualTheme.Basic]: basicTextOptions,
	[ActualTheme.Pico]: basicTextOptions,
	[ActualTheme.Daisy5]: basicTextOptions,
	[ActualTheme.Flowbite3]: (params) => ({ flowbite3Text: { ...params } }),
	[ActualTheme.Skeleton4]: basicTextOptions,
	[ActualTheme.Shadcn4]: (params) => ({ shadcn4Text: { ...params } }),
	[LabTheme.Svar]: (params) => ({
		svarText: { placeholder: params.placeholder, type: params.type as any }
	}),
	[LabTheme.BeerCSS]: basicTextOptions
};

export const CHECKBOXES_WIDGET_OPTIONS: Record<Theme, (inline: boolean) => UiOptions> = {
	[ActualTheme.Basic]: (inline) =>
		inline
			? {}
			: {
					layouts: {
						'field-content': {
							style: 'display: flex; flex-direction: column; gap: 0.2rem;'
						}
					}
				},
	[ActualTheme.Pico]: (inline) =>
		inline
			? {}
			: {
					layouts: {
						'field-content': {
							style: 'display: flex; flex-direction: column; gap: 0.2rem;'
						}
					}
				},
	[ActualTheme.Daisy5]: (inline) =>
		inline
			? {
					layouts: {
						'field-content': {
							style: 'display: flex; gap: 0.5rem;'
						}
					}
				}
			: {},
	[ActualTheme.Flowbite3]: (inline) =>
		inline
			? {}
			: {
					layouts: {
						'field-content': {
							style: 'flex-direction: column; gap: 0.2rem;'
						}
					}
				},
	[ActualTheme.Skeleton4]: (inline) =>
		inline
			? {}
			: {
					layouts: {
						'field-content': {
							style: 'flex-direction: column; gap: 0.2rem;'
						}
					}
				},
	[ActualTheme.Shadcn4]: (inline) =>
		inline
			? {
					layouts: {
						'field-content': {
							style: 'display: flex; gap: 1rem;'
						}
					}
				}
			: {},
	[LabTheme.Svar]: (inline) =>
		inline
			? {
					svarCheckboxes: {
						type: 'inline'
					}
				}
			: {},
	[LabTheme.BeerCSS]: (inline) =>
		inline
			? {}
			: {
					beercssCheckboxesContainer: {
						class: 'vertical'
					}
				}
};

export const RADIO_WIDGET_OPTIONS: Record<Theme, (inline: boolean) => UiOptions> = {
	...CHECKBOXES_WIDGET_OPTIONS,
	[ActualTheme.Shadcn4]: (inline) =>
		inline
			? {
					shadcn4RadioGroup: {
						style: 'grid-auto-flow: column; grid-auto-columns: max-content;'
					}
				}
			: {},
	[LabTheme.Svar]: (inline) =>
		inline
			? {
					svarRadio: {
						type: 'inline'
					}
				}
			: {},
	[LabTheme.BeerCSS]: (inline) =>
		inline
			? {}
			: {
					beercssRadioContainer: {
						class: 'vertical'
					}
				}
};

export const DEFAULT_COMPONENTS: Record<
	Resolver,
	{
		[T in WidgetNodeType]: (
			node: Extract<WidgetNode, AbstractNode<T>>
		) => UiSchema['ui:components'];
	}
> = {
	[Resolver.Basic]: {
		[NodeType.Enum]: (node) => {
			const items = buildEnumValues(node.valueType, node.items);
			const type = pickSchemaType(items.map(typeOfValue));
			return {
				[`${type}Field`]: 'enumField'
			} satisfies UiSchema['ui:components'];
		},
		[NodeType.MultiEnum]: constant({
			arrayField: 'multiEnumField'
		}),
		[NodeType.String]: constant(undefined),
		[NodeType.Number]: constant(undefined),
		[NodeType.Boolean]: constant(undefined),
		[NodeType.File]: (node): UiSchema['ui:components'] => {
			if (node.options.multiple) {
				return {
					arrayField: node.options.native ? 'arrayNativeFilesField' : 'arrayFilesField'
				};
			}
			return node.options.native
				? {
						unknownField: 'unknownNativeFileField'
					}
				: {
						stringField: 'fileField'
					};
		},
		[NodeType.Tags]: constant({
			arrayField: 'arrayTagsField'
		}),
		[NodeType.Range]: constant({
			objectField: 'aggregatedField'
		})
	},
	[Resolver.Compat]: {
		[NodeType.Enum]: constant(undefined),
		[NodeType.MultiEnum]: constant(undefined),
		[NodeType.String]: constant(undefined),
		[NodeType.Number]: constant(undefined),
		[NodeType.Boolean]: constant(undefined),
		[NodeType.File]: (node): UiSchema['ui:components'] => {
			if (!node.options.native) {
				return undefined;
			}
			return node.options.multiple
				? {
						arrayField: 'arrayNativeFilesField'
					}
				: {
						unknownField: 'unknownNativeFileField'
					};
		},
		[NodeType.Tags]: constant({
			arrayField: 'arrayTagsField'
		}),
		[NodeType.Range]: constant({
			objectField: 'aggregatedField'
		})
	}
};

export const DEFAULT_WIDGETS: Record<WidgetNodeType, WidgetType> = {
	[NodeType.Enum]: ENUM_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.MultiEnum]: MULTI_ENUM_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.String]: STRING_NODE_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.Number]: NUMBER_NODE_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.Boolean]: BOOLEAN_NODE_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.File]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.Tags]: FILE_NODE_OPTIONS_SCHEMA.properties.widget.default,
	[NodeType.Range]: 'aggregatedWidget'
};

const BASE_WIDGETS = [
	'textWidget',
	'numberWidget',
	'checkboxWidget',
	'selectWidget'
] as const satisfies WidgetType[];

export type BaseWidgetType = (typeof BASE_WIDGETS)[number];

const BASE_WIDGETS_SET = new Set<WidgetType>(BASE_WIDGETS);

export function isBaseWidget(w: WidgetType): w is BaseWidgetType {
	return BASE_WIDGETS_SET.has(w);
}

export type ExtraWidgetType = Exclude<WidgetType, BaseWidgetType>;

export type FileFieldMode = number;
export const FILE_FIELD_SINGLE_MODE = 1;
export const FILE_FIELD_MULTIPLE_MODE = FILE_FIELD_SINGLE_MODE << 1;
export const FILE_FIELD_NATIVE_SINGLE_MODE = FILE_FIELD_MULTIPLE_MODE << 1;
export const FILE_FIELD_NATIVE_MULTIPLE_MODE = FILE_FIELD_NATIVE_SINGLE_MODE << 1;

type StripFieldSuffix<T> = T extends `${infer U}Field` ? U : T;

export function fileFieldModeToFields(mode: FileFieldMode): StripFieldSuffix<FieldType>[] {
	const fields: StripFieldSuffix<FieldType>[] = [];
	if (mode & FILE_FIELD_SINGLE_MODE) {
		fields.push('file');
	}
	if (mode & FILE_FIELD_MULTIPLE_MODE) {
		fields.push('files');
	}
	if (mode & FILE_FIELD_NATIVE_SINGLE_MODE) {
		fields.push('unknownNativeFile');
	}
	if (mode & FILE_FIELD_NATIVE_MULTIPLE_MODE) {
		fields.push('arrayNativeFiles');
	}
	return fields;
}

export const WIDGET_EXTRA_FIELD: Record<WidgetType, StripFieldSuffix<FieldType> | undefined> = {
	textWidget: undefined,
	numberWidget: undefined,
	selectWidget: 'enum',
	checkboxWidget: undefined,
	fileWidget: undefined,
	checkboxesWidget: 'multiEnum',
	tagsWidget: 'tags',
	datePickerWidget: undefined,
	multiSelectWidget: 'multiEnum',
	radioWidget: 'enum',
	rangeWidget: undefined,
	textareaWidget: undefined,
	radioButtonsWidget: 'enum',
	ratingWidget: undefined,
	switchWidget: undefined,
	comboboxWidget: 'enum',
	daisyui5FilterRadioButtonsWidget: 'enum',
	daisyui5CallyDatePickerWidget: undefined,
	skeleton4SliderWidget: undefined,
	skeleton4FileUploadWidget: undefined,
	flowbite3ToggleRadioButtonsWidget: 'enum',
	shadcn4DateRangePickerWidget: 'aggregated',
	aggregatedWidget: 'aggregated',
	skeleton4DateRangePickerWidget: 'aggregated',
	svarColorPickerWidget: undefined,
	svarColorSelectWidget: undefined,
	svarDateRangePickerWidget: 'aggregated',
	dateRangePickerWidget: 'aggregated',
	rangeSliderWidget: 'aggregated'
};

export const WIDGET_NAMES: Record<WidgetType, string> = {
	textWidget: 'Text input',
	numberWidget: 'Number input',
	selectWidget: 'Select',
	checkboxWidget: 'Checkbox',
	fileWidget: 'File input',
	checkboxesWidget: 'Checkboxes',
	tagsWidget: 'Tags',
	datePickerWidget: 'Date picker',
	multiSelectWidget: 'Multi Select',
	radioWidget: 'Radio group',
	rangeWidget: 'Range',
	textareaWidget: 'Textarea',
	radioButtonsWidget: 'Radio buttons',
	ratingWidget: 'Rating',
	switchWidget: 'Switch',
	comboboxWidget: 'Combobox',
	daisyui5FilterRadioButtonsWidget: 'Filter radio buttons',
	daisyui5CallyDatePickerWidget: 'Cally date picker',
	skeleton4FileUploadWidget: 'Drop zone',
	skeleton4SliderWidget: 'Slider',
	flowbite3ToggleRadioButtonsWidget: 'Toggle radio buttons',
	aggregatedWidget: 'Invalid widget',
	shadcn4DateRangePickerWidget: 'Date range picker',
	skeleton4DateRangePickerWidget: 'Date range picker',
	svarDateRangePickerWidget: 'Date range picker',
	svarColorPickerWidget: 'Color picker',
	svarColorSelectWidget: 'Color select',
	dateRangePickerWidget: 'Date range picker',
	rangeSliderWidget: 'Range slider'
};

const WIDGET_USE_LABEL: Record<WidgetType, boolean | Set<Theme>> = {
	textWidget: true,
	numberWidget: true,
	selectWidget: true,
	checkboxWidget: true,
	fileWidget: true,
	checkboxesWidget: false,
	tagsWidget: true,
	datePickerWidget: true,
	multiSelectWidget: true,
	radioWidget: false,
	rangeWidget: true,
	textareaWidget: true,
	radioButtonsWidget: false,
	ratingWidget: false,
	switchWidget: true,
	comboboxWidget: true,
	daisyui5FilterRadioButtonsWidget: false,
	daisyui5CallyDatePickerWidget: true,
	skeleton4SliderWidget: true,
	skeleton4FileUploadWidget: true,
	flowbite3ToggleRadioButtonsWidget: false,
	aggregatedWidget: false,
	shadcn4DateRangePickerWidget: false,
	skeleton4DateRangePickerWidget: false,
	svarColorPickerWidget: true,
	svarColorSelectWidget: true,
	svarDateRangePickerWidget: true,
	dateRangePickerWidget: new Set([LabTheme.Svar, ActualTheme.Flowbite3]),
	rangeSliderWidget: false
};

export function getUseLabel(theme: Theme, widgetType: WidgetType): boolean {
	const useLabel = WIDGET_USE_LABEL[widgetType];
	if (typeof useLabel === 'boolean') {
		return useLabel;
	}
	return useLabel.has(theme);
}

export const EXTRA_WIDGET_IMPORTS: Record<ExtraWidgetType, string> = {
	fileWidget: 'file',
	checkboxesWidget: 'checkboxes',
	tagsWidget: 'tags',
	datePickerWidget: 'date-picker',
	multiSelectWidget: 'multi-select',
	radioWidget: 'radio',
	rangeWidget: 'range',
	textareaWidget: 'textarea',
	radioButtonsWidget: 'radio-buttons',
	ratingWidget: 'rating',
	switchWidget: 'switch',
	comboboxWidget: 'combobox',
	daisyui5FilterRadioButtonsWidget: 'filter-radio-buttons',
	daisyui5CallyDatePickerWidget: 'cally-date-picker',
	skeleton4SliderWidget: 'slider',
	skeleton4FileUploadWidget: 'file-upload',
	flowbite3ToggleRadioButtonsWidget: 'toggle-radio-buttons',
	skeleton4DateRangePickerWidget: 'date-range-picker',
	shadcn4DateRangePickerWidget: 'date-range-picker',
	svarDateRangePickerWidget: 'date-range-picker',
	svarColorPickerWidget: 'color-picker',
	svarColorSelectWidget: 'color-select',
	aggregatedWidget: 'virtual-widget-import',
	dateRangePickerWidget: 'date-range-picker',
	rangeSliderWidget: 'range-slider'
};
