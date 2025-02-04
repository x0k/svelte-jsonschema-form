<script lang="ts">
	import { createForm3 } from '@sjsf/form';
	import { ComponentsAndWidgets, widgets, validator, translation } from 'testing/demo';

	import '../app.css';
	import { theme } from '../lib/index.js';
</script>

<ComponentsAndWidgets
	{theme}
	createWidgetsForm={() =>
		createForm3({
			...theme,
			initialValue: {
				pikadayCalendar: {
					readonly: '2025-02-04'
				}
			},
			schema: {
				type: 'object',
				properties: {
					...widgets.schema.properties,
					toggle: widgets.states(widgets.boolean),
					filter: widgets.states(widgets.enumeration),
					callyCalendar: widgets.states(widgets.text),
					pikadayCalendar: widgets.states(widgets.text)
				}
			},
			uiSchema: {
				...widgets.uiSchema,
				toggle: widgets.uiStates({
					'ui:widget': 'toggle'
				}),
				filter: widgets.uiStates({
					'ui:widget': 'filter'
				}),
				callyCalendar: widgets.uiStates({
					'ui:widget': 'callyCalendar'
				}),
				pikadayCalendar: widgets.uiStates({
					'ui:widget': 'pikadayCalendar'
				})
			},
			initialErrors: widgets.errors(
				Object.keys(widgets.uiSchema).concat('toggle', 'filter', 'callyCalendar', 'pikadayCalendar')
			),
			translation,
			validator
		})}
/>
