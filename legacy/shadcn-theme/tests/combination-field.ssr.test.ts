import { describe } from 'vitest';
import { combinationFieldSsrTests } from 'theme-testing/fields/combination-field-ssr-tests';

import * as defaultUi from '../src/lib/default-ui/index.js';
import * as newYorkUi from '../src/lib/new-york-ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';
import { theme } from '../src/lib/theme/index.js';

describe('default-ui', () => {
	combinationFieldSsrTests(theme, {
		context: new Map([[THEME_CONTEXT, { components: defaultUi }]])
	});
});

describe('new-york-ui', () => {
	combinationFieldSsrTests(theme, {
		context: new Map([[THEME_CONTEXT, { components: newYorkUi }]])
	});
});
