<script lang="ts">
	import { ComponentsAndWidgets, s } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
	import '../lib/extra-widgets/checkboxes-include';
	import '../lib/extra-widgets/date-picker-include';
	import '../lib/extra-widgets/file-include';
	import '../lib/extra-widgets/multi-select-include';
	import '../lib/extra-widgets/radio-include';
	import '../lib/extra-widgets/range-include';
	import '../lib/extra-widgets/textarea-include';
</script>

<ComponentsAndWidgets
	{theme}
	additionalSpecs={{
    datePicker: [
      s.text,
      { "ui:components": { textWidget: "datePickerWidget" } },
    ],
		multiSelect: [s.uniqueArray, { 'ui:components': { checkboxesWidget: 'multiSelectWidget' } }],
		radio: [s.enumeration, { 'ui:components': { selectWidget: 'radioWidget' } }],
		range: [s.number, { 'ui:components': { numberWidget: 'rangeWidget' } }],
		textarea: [s.text, { 'ui:components': { textWidget: 'textareaWidget' } }]
	}}
/>
