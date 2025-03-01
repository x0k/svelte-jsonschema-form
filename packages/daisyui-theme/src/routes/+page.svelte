<script lang="ts">
	import { ComponentsAndWidgets, s } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
	import '../lib/extra-widgets/multi-select-include';
	import '../lib/extra-widgets/textarea-include';
	import '../lib/extra-widgets/switch-include';
	import '../lib/extra-widgets/date-picker-include';
	import '../lib/extra-widgets/range-include';
	import '../lib/extra-widgets/radio-buttons-include';
	import '../lib/extra-widgets/radio-include';
</script>

<ComponentsAndWidgets
	{theme}
	additionalSpecs={{
		multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
		radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
		datePicker: [s.text, { 'ui:components': { textWidget: 'datePickerWidget' } }],
		radioButtons: [s.enumeration, { 'ui:components': { selectWidget: 'radioButtonsWidget' } }],
		switch: [s.boolean, { 'ui:components': { checkboxWidget: 'switchWidget' } }],
		textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
	}}
/>
