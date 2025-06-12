import { describe } from 'vitest';
import { objectTests } from 'testing/snapshots/object-field-tests';

import * as defaultUi from '../src/lib/default-ui/index.js';
import * as newYorkUi from '../src/lib/new-york-ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';

import { theme } from '../src/lib/theme/index.js';
import Form from './form.svelte';

describe('default-ui', () => {
	objectTests(theme, { context: new Map([[THEME_CONTEXT, { components: defaultUi }]]), Form });
});

describe('new-york-ui', () => {
	objectTests(theme, { context: new Map([[THEME_CONTEXT, { components: newYorkUi }]]), Form });
});
