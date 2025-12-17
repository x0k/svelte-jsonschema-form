import { isObject } from '@sjsf/form/lib/object';
import type { CompatibleComponentType, Schema, UiSchema, UiSchemaRoot } from '@sjsf/form';

import { ActualTheme, LabTheme, type Theme, type WidgetType } from '$lib/sjsf/theme.js';
import { NodeType } from '$lib/builder/index.js';

import { WIDGET_NAMES } from './model.js';

const basicThemeSchema: { [T in NodeType]?: Schema } = {
	[NodeType.Enum]: {
		properties: {
			widget: {
				enum: ['selectWidget', 'radioWidget'] satisfies CompatibleComponentType<'selectWidget'>[]
			}
		}
	},
	[NodeType.MultiEnum]: {
		properties: {
			widget: {
				enum: [
					'checkboxesWidget',
					'multiSelectWidget'
				] satisfies CompatibleComponentType<'checkboxesWidget'>[]
			}
		}
	},
	[NodeType.String]: {
		properties: {
			widget: {
				enum: [
					'textWidget',
					'textareaWidget',
					'datePickerWidget'
				] satisfies CompatibleComponentType<'textWidget'>[]
			}
		}
	},
	[NodeType.Number]: {
		properties: {
			widget: {
				enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
			}
		}
	},
	[NodeType.Boolean]: {
		properties: {
			widget: {
				enum: ['checkboxWidget'] satisfies CompatibleComponentType<'checkboxWidget'>[]
			}
		}
	},
	[NodeType.File]: {
		properties: {
			widget: {
				enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
			}
		}
	}
};

export const THEME_SCHEMAS: Record<Theme, { [T in NodeType]?: Schema }> = {
	[ActualTheme.Basic]: basicThemeSchema,
	[ActualTheme.Pico]: basicThemeSchema,
	[ActualTheme.Daisy5]: {
		[NodeType.Enum]: {
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
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
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
		},
		[NodeType.Number]: {
			properties: {
				widget: {
					enum: [
						'numberWidget',
						'rangeWidget',
						'ratingWidget'
					] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.File]: {
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		}
	},
	[ActualTheme.Flowbite3]: {
		[NodeType.Enum]: {
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
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		},
		[NodeType.Number]: {
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.File]: {
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		},
		[NodeType.Tags]: {
			properties: {
				widget: {
					enum: ['tagsWidget'] satisfies CompatibleComponentType<'tagsWidget'>[]
				}
			}
		},
		[NodeType.Range]: {
			properties: {
				widget: {
					enum: ['stringRangeWidget'] satisfies CompatibleComponentType<'stringRangeWidget'>[]
				}
			}
		}
	},
	[ActualTheme.Skeleton4]: {
		[NodeType.Enum]: {
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
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		},
		[NodeType.Number]: {
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
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.File]: {
			properties: {
				widget: {
					enum: [
						'fileWidget',
						'skeleton4FileUploadWidget'
					] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		},
		[NodeType.Tags]: {
			properties: {
				widget: {
					enum: ['tagsWidget'] satisfies CompatibleComponentType<'tagsWidget'>[]
				}
			}
		},
		[NodeType.Range]: {
			properties: {
				widget: {
					enum: ['stringRangeWidget'] satisfies CompatibleComponentType<'stringRangeWidget'>[]
				}
			}
		}
	},
	[ActualTheme.Shadcn4]: {
		[NodeType.Enum]: {
			properties: {
				widget: {
					enum: [
						'selectWidget',
						'radioWidget',
						'comboboxWidget'
					] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		},
		[NodeType.Number]: {
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.File]: {
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		},
		[NodeType.Range]: {
			properties: {
				widget: {
					enum: ['stringRangeWidget'] satisfies CompatibleComponentType<'stringRangeWidget'>[]
				}
			}
		}
	},
	[LabTheme.Svar]: {
		[NodeType.Enum]: {
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
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: [
						'checkboxesWidget',
						'multiSelectWidget'
					] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
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
		},
		[NodeType.Number]: {
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.Range]: {
			properties: {
				widget: {
					enum: ['stringRangeWidget'] satisfies CompatibleComponentType<'stringRangeWidget'>[]
				}
			}
		}
	},
	[LabTheme.BeerCSS]: {
		[NodeType.Enum]: {
			properties: {
				widget: {
					enum: ['selectWidget', 'radioWidget'] satisfies CompatibleComponentType<'selectWidget'>[]
				}
			}
		},
		[NodeType.MultiEnum]: {
			properties: {
				widget: {
					enum: ['checkboxesWidget'] satisfies CompatibleComponentType<'checkboxesWidget'>[]
				}
			}
		},
		[NodeType.String]: {
			properties: {
				widget: {
					enum: [
						'textWidget',
						'textareaWidget',
						'datePickerWidget'
					] satisfies CompatibleComponentType<'textWidget'>[]
				}
			}
		},
		[NodeType.Number]: {
			properties: {
				widget: {
					enum: ['numberWidget', 'rangeWidget'] satisfies CompatibleComponentType<'numberWidget'>[]
				}
			}
		},
		[NodeType.Boolean]: {
			properties: {
				widget: {
					enum: [
						'checkboxWidget',
						'switchWidget'
					] satisfies CompatibleComponentType<'checkboxWidget'>[]
				}
			}
		},
		[NodeType.File]: {
			properties: {
				widget: {
					enum: ['fileWidget'] satisfies CompatibleComponentType<'fileWidget'>[]
				}
			}
		}
	}
};

export const THEME_UI_SCHEMAS: Record<
	Theme,
	{
		[T in NodeType]?: UiSchemaRoot;
	}
> = {
	[ActualTheme.Basic]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Basic]),
	[ActualTheme.Pico]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Pico]),
	[ActualTheme.Daisy5]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Daisy5]),
	[ActualTheme.Flowbite3]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Flowbite3]),
	[ActualTheme.Skeleton4]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Skeleton4]),
	[ActualTheme.Shadcn4]: schemasToEnumNames(THEME_SCHEMAS[ActualTheme.Shadcn4]),
	[LabTheme.Svar]: schemasToEnumNames(THEME_SCHEMAS[LabTheme.Svar]),
	[LabTheme.BeerCSS]: schemasToEnumNames(THEME_SCHEMAS[LabTheme.BeerCSS])
};

function schemaToEnumNames(schema: Schema): UiSchema | undefined {
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
}

function schemasToEnumNames(schemas: Partial<Record<NodeType, Schema>>) {
	const map = new Map<NodeType, UiSchema>();
	for (const [type, schema] of Object.entries(schemas)) {
		const uiSchema = schemaToEnumNames(schema);
		if (uiSchema === undefined) {
			continue;
		}
		map.set(type as NodeType, uiSchema);
	}
	return Object.fromEntries(map);
}

export const THEME_MISSING_FIELDS: Record<Theme, Set<NodeType>> = {
	[ActualTheme.Basic]: new Set([NodeType.Tags, NodeType.Range]),
	[ActualTheme.Pico]: new Set([NodeType.Tags, NodeType.Range]),
	[ActualTheme.Daisy5]: new Set([NodeType.Tags, NodeType.Range]),
	[ActualTheme.Flowbite3]: new Set([]),
	[ActualTheme.Skeleton4]: new Set([]),
	[ActualTheme.Shadcn4]: new Set([NodeType.Tags]),
	[LabTheme.Svar]: new Set([NodeType.Tags, NodeType.File]),
	[LabTheme.BeerCSS]: new Set([NodeType.Tags, NodeType.Range])
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
