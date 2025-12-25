import type { Calendar, WithoutChildrenOrChild } from 'bits-ui';

declare module '../context.js' {
	interface ThemeComponents {
		// @ts-expect-error too complex
		Calendar: Component<
			WithoutChildrenOrChild<Calendar.RootProps>,
			{},
			'value' | 'placeholder' | 'ref'
		>;
	}
}
