import { combinationFieldTests } from 'theme-testing/fields/combination-field-tests';

import * as components from '../src/lib/components/ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';
import { theme } from '../src/lib/theme/index.js';

combinationFieldTests(theme, { context: new Map([[THEME_CONTEXT, { components }]]) });
