<script lang="ts" module>
	import type { CheckboxRootProps } from '@ark-ui/svelte/checkbox';

	declare module '@sjsf/form' {
		interface UiOptions {
			tarkuiCheckbox?: CheckboxRootProps;
		}
	}
</script>

<script lang="ts">
	import { getFormContext, inputAttributes, type ComponentProps } from '@sjsf/form';
	import {
		CheckboxRoot,
		CheckboxControl,
		CheckboxIndicator,
		CheckboxLabel,
		CheckboxHiddenInput
	} from '@ark-ui/svelte/checkbox';
	import CheckIcon from '@lucide/svelte/icons/check';

	let {
		config,
		value = $bindable(),
		handlers,
		errors
	}: ComponentProps['checkboxWidget'] = $props();

	const ctx = getFormContext();
</script>

<!-- <label class="fieldset-label">
	<input
		type="checkbox"
		class={['checkbox', errors.length > 0 && 'checkbox-error']}
		bind:checked={() => value ?? false, (v) => (value = v)}
		{...inputAttributes(ctx, config, 'checkbox', handlers, {})}
	/>
	{config.title}
</label> -->
<CheckboxRoot class="flex items-center gap-3 cursor-pointer">
	<CheckboxControl
		class="w-5 h-5 bg-white border-2 border-gray-300 rounded data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-hover:border-gray-400 dark:bg-gray-900 dark:border-gray-600 dark:data-[state=checked]:bg-blue-500 dark:data-[state=checked]:border-blue-500 dark:data-hover:border-gray-400 transition-all duration-200 flex items-center justify-center"
	>
		<CheckboxIndicator>
			<CheckIcon class="w-3.5 h-3.5 text-white" />
		</CheckboxIndicator>
	</CheckboxControl>
	<CheckboxLabel class="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer">
		{config.title}
	</CheckboxLabel>
	<CheckboxHiddenInput />
</CheckboxRoot>
