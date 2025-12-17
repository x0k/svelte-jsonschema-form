import type {
	ComponentProps,
	ComponentType,
	FieldCommonProps,
	Theme as SJSFTheme,
	UiOptions,
	UiSchema
} from '@sjsf/form';
import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';

import '@sjsf/form/fields/extra/aggregated-include';
import '@sjsf/form/fields/extra/boolean-select-include';
import '@sjsf/form/fields/extra/enum-include';
import '@sjsf/form/fields/extra/file-include';
import '@sjsf/form/fields/extra/multi-enum-include';
import '@sjsf/form/fields/extra/unknown-native-file-include';
import '@sjsf/form/fields/extra/array-native-files-include';
import '@sjsf/form/fields/extra/array-files-include';
import '@sjsf/form/fields/extra/array-tags-include';

import { theme as basic } from '@sjsf/basic-theme';
import basicStyles from '@sjsf/basic-theme/css/basic.css?raw';
import picoStyles from '@picocss/pico/css/pico.css?raw';
import picoAdapterStyles from '@sjsf/basic-theme/css/pico.css?raw';
import '@sjsf/basic-theme/extra-widgets/checkboxes-include';
import '@sjsf/basic-theme/extra-widgets/date-picker-include';
import '@sjsf/basic-theme/extra-widgets/file-include';
import '@sjsf/basic-theme/extra-widgets/multi-select-include';
import '@sjsf/basic-theme/extra-widgets/radio-include';
import '@sjsf/basic-theme/extra-widgets/range-include';
import '@sjsf/basic-theme/extra-widgets/textarea-include';

import { theme as daisy5 } from '@sjsf/daisyui5-theme';
import daisy5Styles from '@sjsf/daisyui5-theme/styles.css?raw';
import '@sjsf/daisyui5-theme/extra-widgets/checkboxes-include';
import '@sjsf/daisyui5-theme/extra-widgets/date-picker-include';
import '@sjsf/daisyui5-theme/extra-widgets/file-include';
import '@sjsf/daisyui5-theme/extra-widgets/multi-select-include';
import '@sjsf/daisyui5-theme/extra-widgets/radio-buttons-include';
import '@sjsf/daisyui5-theme/extra-widgets/radio-include';
import '@sjsf/daisyui5-theme/extra-widgets/range-include';
import '@sjsf/daisyui5-theme/extra-widgets/rating-include';
import '@sjsf/daisyui5-theme/extra-widgets/switch-include';
import '@sjsf/daisyui5-theme/extra-widgets/textarea-include';
import '@sjsf/daisyui5-theme/extra-widgets/cally-date-picker-include';
import '@sjsf/daisyui5-theme/extra-widgets/filter-radio-buttons-include';

import { theme as flowbite3 } from '@sjsf/flowbite3-theme';
import flowbite3Styles from '@sjsf/flowbite3-theme/styles.css?raw';
import '@sjsf/flowbite3-theme/extra-widgets/checkboxes-include';
import '@sjsf/flowbite3-theme/extra-widgets/date-picker-include';
import '@sjsf/flowbite3-theme/extra-widgets/date-range-picker-include';
import '@sjsf/flowbite3-theme/extra-widgets/file-include';
import '@sjsf/flowbite3-theme/extra-widgets/multi-select-include';
import '@sjsf/flowbite3-theme/extra-widgets/radio-buttons-include';
import '@sjsf/flowbite3-theme/extra-widgets/radio-include';
import '@sjsf/flowbite3-theme/extra-widgets/range-include';
import '@sjsf/flowbite3-theme/extra-widgets/switch-include';
import '@sjsf/flowbite3-theme/extra-widgets/tags-include';
import '@sjsf/flowbite3-theme/extra-widgets/textarea-include';
import '@sjsf/flowbite3-theme/extra-widgets/toggle-radio-buttons-include';

import { theme as skeleton4 } from '@sjsf/skeleton4-theme';
import skeleton4Styles from '@sjsf/skeleton4-theme/styles.css?raw';
import '@sjsf/skeleton4-theme/extra-widgets/checkboxes-include';
import '@sjsf/skeleton4-theme/extra-widgets/date-picker-include';
import '@sjsf/skeleton4-theme/extra-widgets/date-range-picker-include';
import '@sjsf/skeleton4-theme/extra-widgets/file-include';
import '@sjsf/skeleton4-theme/extra-widgets/multi-select-include';
import '@sjsf/skeleton4-theme/extra-widgets/radio-buttons-include';
import '@sjsf/skeleton4-theme/extra-widgets/radio-include';
import '@sjsf/skeleton4-theme/extra-widgets/range-include';
import '@sjsf/skeleton4-theme/extra-widgets/range-slider-include';
import '@sjsf/skeleton4-theme/extra-widgets/rating-include';
import '@sjsf/skeleton4-theme/extra-widgets/switch-include';
import '@sjsf/skeleton4-theme/extra-widgets/tags-include';
import '@sjsf/skeleton4-theme/extra-widgets/textarea-include';
import '@sjsf/skeleton4-theme/extra-widgets/combobox-include';
import '@sjsf/skeleton4-theme/extra-widgets/file-upload-include';
import '@sjsf/skeleton4-theme/extra-widgets/slider-include';

import { theme as shadcn4 } from '@sjsf/shadcn4-theme';
import shadcn4Styles from '@sjsf/shadcn4-theme/styles.css?raw';
import '@sjsf/shadcn4-theme/extra-widgets/checkboxes-include';
import '@sjsf/shadcn4-theme/extra-widgets/combobox-include';
import '@sjsf/shadcn4-theme/extra-widgets/date-picker-include';
import '@sjsf/shadcn4-theme/extra-widgets/date-range-picker-include';
import '@sjsf/shadcn4-theme/extra-widgets/file-include';
import '@sjsf/shadcn4-theme/extra-widgets/multi-select-include';
import '@sjsf/shadcn4-theme/extra-widgets/radio-buttons-include';
import '@sjsf/shadcn4-theme/extra-widgets/radio-include';
import '@sjsf/shadcn4-theme/extra-widgets/range-include';
import '@sjsf/shadcn4-theme/extra-widgets/range-slider-include';
import '@sjsf/shadcn4-theme/extra-widgets/switch-include';
import '@sjsf/shadcn4-theme/extra-widgets/textarea-include';

import { theme as svar } from '@sjsf-lab/svar-theme';
import '@sjsf-lab/svar-theme/extra-widgets/checkboxes-include';
import '@sjsf-lab/svar-theme/extra-widgets/color-picker-include';
import '@sjsf-lab/svar-theme/extra-widgets/color-select-include';
import '@sjsf-lab/svar-theme/extra-widgets/combobox-include';
import '@sjsf-lab/svar-theme/extra-widgets/date-picker-include';
import '@sjsf-lab/svar-theme/extra-widgets/date-range-picker-include';
import '@sjsf-lab/svar-theme/extra-widgets/multi-select-include';
import '@sjsf-lab/svar-theme/extra-widgets/radio-include';
import '@sjsf-lab/svar-theme/extra-widgets/radio-buttons-include';
import '@sjsf-lab/svar-theme/extra-widgets/range-include';
import '@sjsf-lab/svar-theme/extra-widgets/switch-include';
import '@sjsf-lab/svar-theme/extra-widgets/textarea-include';

import { theme as beercss } from '@sjsf-lab/beercss-theme';
import beercssStyles from 'beercss/dist/cdn/beer.min.css?raw';
const beerCssSettings = `
:host {
  --size: 1rem;
  --font: Inter, Roboto, "Helvetica Neue", "Arial Nova", "Nimbus Sans", Noto Sans, Arial, sans-serif;
  --font-icon: "Material Symbols Outlined";
  --speed1: 0.1s;
  --speed2: 0.2s;
  --speed3: 0.3s;
  --speed4: 0.4s;
  --active: rgb(128 128 128 / 0.192);
  --overlay: rgb(0 0 0 / 0.5);
  --elevate1: 0 0.125rem 0.125rem 0 rgb(0 0 0 / 0.32);
  --elevate2: 0 0.25rem 0.5rem 0 rgb(0 0 0 / 0.4);
  --elevate3: 0 0.375rem 0.75rem 0 rgb(0 0 0 / 0.48);
  --top: env(safe-area-inset-top);
  --bottom: env(safe-area-inset-bottom);
  --left: env(safe-area-inset-left);
  --right: env(safe-area-inset-right);
}
:host, .light {
  --primary: #6750a4;
  --on-primary: #ffffff;
  --primary-container: #e9ddff;
  --on-primary-container: #22005d;
  --secondary: #625b71;
  --on-secondary: #ffffff;
  --secondary-container: #e8def8;
  --on-secondary-container: #1e192b;
  --tertiary: #7e5260;
  --on-tertiary: #ffffff;
  --tertiary-container: #ffd9e3;
  --on-tertiary-container: #31101d;
  --error: #ba1a1a;
  --on-error: #ffffff;
  --error-container: #ffdad6;
  --on-error-container: #410002;
  --background: #fffbff;
  --on-background: #1c1b1e;
  --surface: #fdf8fd;
  --on-surface: #1c1b1e;
  --surface-variant: #e7e0eb;
  --on-surface-variant: #49454e;
  --outline: #7a757f;
  --outline-variant: #cac4cf;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #313033;
  --inverse-on-surface: #f4eff4;
  --inverse-primary: #cfbcff;
  --surface-dim: #ddd8dd;
  --surface-bright: #fdf8fd;
  --surface-container-lowest: #ffffff;
  --surface-container-low: #f7f2f7;
  --surface-container: #f2ecf1;
  --surface-container-high: #ece7eb;
  --surface-container-highest: #e6e1e6;
}
.dark {
  --primary: #cfbcff;
  --on-primary: #381e72;
  --primary-container: #4f378a;
  --on-primary-container: #e9ddff;
  --secondary: #cbc2db;
  --on-secondary: #332d41;
  --secondary-container: #4a4458;
  --on-secondary-container: #e8def8;
  --tertiary: #efb8c8;
  --on-tertiary: #4a2532;
  --tertiary-container: #633b48;
  --on-tertiary-container: #ffd9e3;
  --error: #ffb4ab;
  --on-error: #690005;
  --error-container: #93000a;
  --on-error-container: #ffb4ab;
  --background: #1c1b1e;
  --on-background: #e6e1e6;
  --surface: #141316;
  --on-surface: #e6e1e6;
  --surface-variant: #49454e;
  --on-surface-variant: #cac4cf;
  --outline: #948f99;
  --outline-variant: #49454e;
  --shadow: #000000;
  --scrim: #000000;
  --inverse-surface: #e6e1e6;
  --inverse-on-surface: #313033;
  --inverse-primary: #6750a4;
  --surface-dim: #141316;
  --surface-bright: #3a383c;
  --surface-container-lowest: #0f0e11;
  --surface-container-low: #1c1b1e;
  --surface-container: #201f22;
  --surface-container-high: #2b292d;
  --surface-container-highest: #363438;
}`;
import '@sjsf-lab/beercss-theme/extra-widgets/checkboxes-include';
import '@sjsf-lab/beercss-theme/extra-widgets/date-picker-include';
import '@sjsf-lab/beercss-theme/extra-widgets/file-include';
import '@sjsf-lab/beercss-theme/extra-widgets/radio-include';
import '@sjsf-lab/beercss-theme/extra-widgets/range-include';
import '@sjsf-lab/beercss-theme/extra-widgets/switch-include';
import '@sjsf-lab/beercss-theme/extra-widgets/textarea-include';

export type FieldType = {
	[T in ComponentType]: ComponentProps[T] extends FieldCommonProps<any> ? T : never;
}[ComponentType];

export type WidgetType = {
	[T in ComponentType]: ComponentProps[T] extends WidgetCommonProps<any> ? T : never;
}[ComponentType];

export enum ActualTheme {
	Basic = 'basic',
	Pico = 'pico',
	Daisy5 = 'daisyui5',
	Flowbite3 = 'flowbite3',
	Skeleton4 = 'skeleton4',
	Shadcn4 = 'shadcn4'
}

const ACTUAL_THEMES = Object.values(ActualTheme);

export enum LabTheme {
	Svar = 'svar',
	BeerCSS = 'beercss'
}

const LAB_THEMES = Object.values(LabTheme);
const LAB_THEMES_SET = new Set<Theme>(LAB_THEMES);

function isLabTheme(theme: Theme): theme is LabTheme {
	return LAB_THEMES_SET.has(theme);
}

export type Theme = ActualTheme | LabTheme;

export const THEMES = [...ACTUAL_THEMES, ...LAB_THEMES];

export function packageFromTheme(theme: Theme): string {
	return `@sjsf${isLabTheme(theme) ? '-lab' : ''}/${theme}-theme`;
}

export const THEME_TITLES: Record<Theme, string> = {
	[ActualTheme.Basic]: 'Basic',
	[ActualTheme.Pico]: 'Pico',
	[ActualTheme.Daisy5]: 'daisyUI v5',
	[ActualTheme.Flowbite3]: 'Flowbite Svelte',
	[ActualTheme.Skeleton4]: 'Skeleton v4',
	[ActualTheme.Shadcn4]: 'shadcn-svelte',
	[LabTheme.Svar]: 'SVAR',
	[LabTheme.BeerCSS]: 'Beer CSS'
};

export const THEME_OPTIONAL_DEPS: Record<Theme, Record<string, Set<WidgetType>>> = {
	[ActualTheme.Basic]: {},
	[ActualTheme.Pico]: {},
	[ActualTheme.Daisy5]: {},
	[ActualTheme.Flowbite3]: {},
	[ActualTheme.Skeleton4]: {
		'@skeletonlabs/skeleton-svelte': new Set([
			'skeleton4DateRangePickerWidget',
			'skeleton4FileUploadWidget',
			'skeleton4SliderWidget',
			'dateRangePickerWidget',
			'radioButtonsWidget',
			'comboboxWidget',
			'ratingWidget',
			'rangeWidget',
			'switchWidget',
			'tagsWidget'
		])
	},
	[ActualTheme.Shadcn4]: {
		'@internationalized/date': new Set([
			'datePickerWidget',
			'shadcn4DateRangePickerWidget',
			'dateRangePickerWidget'
		])
	},
	[LabTheme.Svar]: {},
	[LabTheme.BeerCSS]: {}
};

export const THEME_PEER_DEPS: Record<Theme, string> = {
	[ActualTheme.Basic]: '',
	[ActualTheme.Pico]: '@picocss/pico',
	[ActualTheme.Daisy5]: 'daisyui',
	[ActualTheme.Flowbite3]: 'flowbite flowbite-svelte',
	[ActualTheme.Skeleton4]: '@skeletonlabs/skeleton @tailwindcss/forms',
	[ActualTheme.Shadcn4]: '@lucide/svelte bits-ui clsx tailwind-merge tailwind-variants',
	[LabTheme.Svar]: '@svar-ui/svelte-core',
	[LabTheme.BeerCSS]: 'beercss'
};

export const SJSF_THEMES: Record<Theme, SJSFTheme> = {
	[ActualTheme.Basic]: basic,
	[ActualTheme.Pico]: basic,
	[ActualTheme.Daisy5]: daisy5,
	[ActualTheme.Flowbite3]: flowbite3,
	[ActualTheme.Skeleton4]: skeleton4,
	[ActualTheme.Shadcn4]: shadcn4,
	[LabTheme.Svar]: svar,
	[LabTheme.BeerCSS]: beercss
};

export const THEME_STYLES: Record<Theme, string> = {
	[ActualTheme.Basic]: basicStyles,
	[ActualTheme.Pico]: `${picoStyles}\n${picoAdapterStyles}`,
	[ActualTheme.Daisy5]: daisy5Styles,
	[ActualTheme.Flowbite3]: flowbite3Styles,
	[ActualTheme.Skeleton4]: skeleton4Styles,
	[ActualTheme.Shadcn4]: shadcn4Styles,
	[LabTheme.Svar]: '',
	[LabTheme.BeerCSS]: `${beercssStyles}\n${beerCssSettings}`
};

interface MergeArraysOptions<T> {
	merge?: (l: T, r: T) => T;
	/**
	 * @default false
	 */
	unique?: boolean;
}

function mergeArrays<T>(left: T[], right: T[], { merge, unique }: MergeArraysOptions<T> = {}) {
	let merged: T[];
	if (merge) {
		const [minArr, maxArr] = left.length <= right.length ? [left, right] : [right, left];
		merged = new Array(maxArr.length);
		for (let i = 0; i < minArr.length; i++) {
			merged[i] = merge(left[i]!, right[i]!);
		}
		for (let i = minArr.length; i < maxArr.length; i++) {
			merged[i] = maxArr[i]!;
		}
	} else {
		merged = left.concat(right);
	}
	return unique ? Array.from(new Set(merged)) : merged;
}

function mergeUiSchemaItems(
	lItems: NonNullable<UiSchema['items']>,
	rItems: NonNullable<UiSchema['items']>
): UiSchema['items'] {
	const isRArray = Array.isArray(rItems);
	if (Array.isArray(lItems) !== isRArray) {
		return rItems;
	}
	if (isRArray) {
		return mergeArrays(lItems as UiSchema[], rItems as UiSchema[], {
			merge: mergeUiSchemas
		});
	}
	return mergeUiSchemas(lItems as UiSchema, rItems as UiSchema);
}

const COMMON_NESTED_KEYS = ['layouts', 'buttons'] as const satisfies (keyof UiOptions)[];

export function mergeUiSchemas(left: UiSchema, right: UiSchema): UiSchema {
	const merged = Object.assign({}, left, right);
	const commonKeys = new Set(Object.keys(left)).intersection(new Set(Object.keys(right)));
	for (const key of commonKeys) {
		const l = left[key];
		const r = right[key];
		if (key === 'ui:options' || key === 'ui:components' || key === 'ui:globalOptions') {
			//@ts-expect-error
			merged[key] = Object.assign({}, l, r);
			for (const k of COMMON_NESTED_KEYS) {
				if (l && r && k in l && k in r) {
					//@ts-expect-error
					merged[key][k] = Object.assign({}, l[k], r[k]);
				}
			}
		} else if (key === 'items') {
			merged['items'] = mergeUiSchemaItems(l as UiSchema[], r as UiSchema[]);
		} else if (key === 'anyOf' || key === 'oneOf') {
			merged[key] = mergeArrays(l as UiSchema[], r as UiSchema[], {
				merge: mergeUiSchemas
			});
		} else {
			merged[key] = mergeUiSchemas(l as UiSchema, r as UiSchema);
		}
	}
	return merged;
}
