import type { Theme } from '@sjsf/form';

import { components } from './components/index.js';
import { widgets } from './widgets/index.js';

export * from './context'

export const theme = {
	components,
	widgets
} satisfies Theme;
