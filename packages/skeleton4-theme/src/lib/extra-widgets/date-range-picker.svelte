<script lang="ts" module>
	import { type DatePickerRootProps, type PortalRootProps } from '@skeletonlabs/skeleton-svelte';
	import type { Range } from '@sjsf/form/lib/range';
	import type { WidgetCommonProps } from '@sjsf/form/fields/widgets';
	import '@sjsf/form/fields/extra-widgets/string-range';

	declare module '@sjsf/form' {
		interface ComponentProps {
			// TODO: Remove in v4
			/** @deprecated use `stringRangeWidget` instead */
			skeleton4DateRangePickerWidget: WidgetCommonProps<Partial<Range<string>>>;
		}
		interface ComponentBindings {
			// TODO: Remove in v4
			/** @deprecated use `stringRangeWidget` instead */
			skeleton4DateRangePickerWidget: 'value';
		}
		interface UiOptions {
			skeleton4DateRangePicker?: DatePickerRootProps;
			skeleton4DateRangePickerPortal?: Omit<PortalRootProps, 'children'>;
		}
	}
</script>

<script lang="ts">
	import {
		customInputAttributes,
		getChildPath,
		getFormContext,
		getId,
		uiOptionProps,
		type ComponentProps
	} from '@sjsf/form';
	import { DatePicker, parseDate, Portal } from '@skeletonlabs/skeleton-svelte';

	let { value = $bindable(), config, handlers }: ComponentProps['stringRangeWidget'] = $props();

	const ctx = getFormContext();

	const properties = ['start', 'end'];
	const inputIds = $derived(properties.map((p) => getId(ctx, getChildPath(ctx, config.path, p))));
</script>

<DatePicker
	class="w-full"
	value={typeof value?.start === 'string'
		? typeof value.end === 'string'
			? [parseDate(value.start), parseDate(value.end)]
			: [parseDate(value.start)]
		: undefined}
	{...customInputAttributes(ctx, config, 'skeleton4DateRangePicker', {
		selectionMode: 'range',
		ids: {
			input: (i) => inputIds[i]
		},
		readOnly: config.schema.readOnly,
		onValueChange: (e) => {
			value = {
				start: e.value[0]?.toString(),
				end: e.value[1]?.toString()
			};
		}
	})}
>
	<DatePicker.Control>
		<DatePicker.Input
			index={0}
			name={inputIds[0]}
			required={config.schema.required?.includes(properties[0])}
			{...handlers}
		/>
		<DatePicker.Input
			index={1}
			name={inputIds[1]}
			required={config.schema.required?.includes(properties[1])}
			{...handlers}
		/>
		<DatePicker.Trigger />
	</DatePicker.Control>
	<Portal {...uiOptionProps('skeleton4DateRangePickerPortal')({}, config, ctx)}>
		<DatePicker.Positioner>
			<DatePicker.Content>
				<DatePicker.View view="day">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableHead>
									<DatePicker.TableRow>
										{#each datePicker().weekDays as weekDay, id (id)}
											<DatePicker.TableHeader>{weekDay.short}</DatePicker.TableHeader>
										{/each}
									</DatePicker.TableRow>
								</DatePicker.TableHead>
								<DatePicker.TableBody>
									{#each datePicker().weeks as week, id (id)}
										<DatePicker.TableRow>
											{#each week as day, id (id)}
												<DatePicker.TableCell value={day}>
													<DatePicker.TableCellTrigger>{day.day}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="month">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getMonthsGrid( { columns: 4, format: 'short' } ) as months, id (id)}
										<DatePicker.TableRow>
											{#each months as month, id (id)}
												<DatePicker.TableCell value={month.value}>
													<DatePicker.TableCellTrigger>{month.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
				<DatePicker.View view="year">
					<DatePicker.Context>
						{#snippet children(datePicker)}
							<DatePicker.ViewControl>
								<DatePicker.PrevTrigger />
								<DatePicker.ViewTrigger>
									<DatePicker.RangeText />
								</DatePicker.ViewTrigger>
								<DatePicker.NextTrigger />
							</DatePicker.ViewControl>
							<DatePicker.Table>
								<DatePicker.TableBody>
									{#each datePicker().getYearsGrid({ columns: 4 }) as years, id (id)}
										<DatePicker.TableRow>
											{#each years as year, id (id)}
												<DatePicker.TableCell value={year.value}>
													<DatePicker.TableCellTrigger>{year.label}</DatePicker.TableCellTrigger>
												</DatePicker.TableCell>
											{/each}
										</DatePicker.TableRow>
									{/each}
								</DatePicker.TableBody>
							</DatePicker.Table>
						{/snippet}
					</DatePicker.Context>
				</DatePicker.View>
			</DatePicker.Content>
		</DatePicker.Positioner>
	</Portal>
</DatePicker>
