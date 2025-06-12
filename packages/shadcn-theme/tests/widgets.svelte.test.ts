import { describe } from 'vitest';
import { widgetTests } from 'testing/snapshots/widget-tests';

import * as defaultUi from '../src/lib/default-ui/index.js';
import * as newYorkUi from '../src/lib/new-york-ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';

import { theme } from '../src/lib/theme/index.js';
import { specs } from '../src/lib/specs.js';
import Form from './form.svelte';

describe('default-ui', () => {
	widgetTests(theme, specs, {
		context: new Map([[THEME_CONTEXT, { components: defaultUi }]]),
		Form
	});
});

describe('new-york-ui', () => {
	widgetTests(theme, specs, {
		context: new Map([[THEME_CONTEXT, { components: newYorkUi }]]),
		Form
	});
});
