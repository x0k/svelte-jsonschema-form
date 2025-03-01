<script lang="ts">
	import { clientOnly } from '@sjsf/form/lib/env';
	import { ComponentsAndWidgets, s } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
	import '../lib/extra-widgets/radio-include';
	import '../lib/extra-widgets/cally-date-picker-include';
	import '../lib/extra-widgets/multi-select-include';
	import '../lib/extra-widgets/radio-buttons-include';
	import FilterRadioButtons from '../lib/extra-widgets/filter-radio-buttons.svelte';
	import '../lib/extra-widgets/switch-include';
	import '../lib/extra-widgets/textarea-include';

	const PikadayDatePicker = clientOnly(
		() => import('../lib/extra-widgets/pikaday-date-picker.svelte')
	);
</script>

<ComponentsAndWidgets
	{theme}
	additionalSpecs={{
		radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
		datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
		pikadayDatePicker: [s.text, { 'ui:components': { textWidget: PikadayDatePicker } }],
		radioButtons: [s.enumeration, { 'ui:components': { selectWidget: 'radioButtonsWidget' } }],
		filterRadioButtons: [s.enumeration, { 'ui:components': { selectWidget: FilterRadioButtons } }],
		switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
		textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
	}}
/>
