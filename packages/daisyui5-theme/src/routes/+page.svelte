<script lang="ts">
	import { clientOnly } from '@sjsf/form/lib/env';
	import { ComponentsAndWidgets, s } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';

	import '../lib/extra-widgets/cally-date-picker-include';
	import FilterRadioButtons from '../lib/extra-widgets/filter-radio-buttons.svelte';
	import '../lib/extra-widgets/multi-select-include';
	const PikadayDatePicker = clientOnly(
		() => import('../lib/extra-widgets/pikaday-date-picker.svelte')
	);
	import '../lib/extra-widgets/radio-buttons-include';
	import '../lib/extra-widgets/radio-include';
	import '../lib/extra-widgets/range-include';
	import '../lib/extra-widgets/switch-include';
	import '../lib/extra-widgets/textarea-include';
</script>

<ComponentsAndWidgets
	{theme}
	additionalSpecs={{
		callyDatePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
		filterRadioButtons: [s.enumeration, { 'ui:components': { selectWidget: FilterRadioButtons } }],
		multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
		pikadayDatePicker: [s.text, { 'ui:components': { textWidget: PikadayDatePicker } }],
		radioButtons: [s.enumeration, { 'ui:components': { selectWidget: 'radioButtonsWidget' } }],
		radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
		range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
		switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
		textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
	}}
/>
