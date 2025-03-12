<script lang="ts">
	import { ComponentsAndWidgets, s } from 'testing/demo';

	import { theme, setThemeContext, type ThemeComponents } from '../lib/theme/index.js';

	import '../lib/theme/extra-widgets/checkboxes-include';
	import '../lib/theme/extra-widgets/date-picker-include';
	import '../lib/theme/extra-widgets/file-include';
	import '../lib/theme/extra-widgets/multi-select-include';
	import '../lib/theme/extra-widgets/radio-include';
	import '../lib/theme/extra-widgets/range-include';
	import '../lib/theme/extra-widgets/switch-include';
	import '../lib/theme/extra-widgets/textarea-include';

	const { components }: { components: ThemeComponents } = $props();

	setThemeContext({ components });
</script>

<ComponentsAndWidgets
	{theme}
	additionalSpecs={{
		datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
		multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
		radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
		range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
		switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
		textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
	}}
/>
