import { describe } from 'vitest';
import { combinationFieldTests } from 'theme-testing/fields/combination-field-tests';

import * as defaultUi from '../src/lib/default-ui/index.js';
import * as newYorkUi from '../src/lib/new-york-ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';
import { theme } from '../src/lib/theme/index.js';

describe('default-ui', () => {
	combinationFieldTests(theme, { context: new Map([[THEME_CONTEXT, { components: defaultUi }]]) });
});

describe('new-york-ui', () => {
	combinationFieldTests(theme, { context: new Map([[THEME_CONTEXT, { components: newYorkUi }]]) });
});
