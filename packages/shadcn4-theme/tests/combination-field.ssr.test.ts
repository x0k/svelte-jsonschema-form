import { combinationFieldSsrTests } from 'theme-testing/fields/combination-field-ssr-tests';

import * as components from '../src/lib/components/ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';
import { theme } from '../src/lib/theme/index.js';

combinationFieldSsrTests(theme, { context: new Map([[THEME_CONTEXT, { components }]]) });
