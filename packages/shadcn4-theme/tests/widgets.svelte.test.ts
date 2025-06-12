import { widgetTests } from 'testing/snapshots/widget-tests';

import * as components from '../src/lib/components/ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';

import { theme } from '../src/lib/theme/index.js';
import { specs } from '../src/lib/specs.js';
import Form from './form.svelte';

widgetTests(theme, specs, { context: new Map([[THEME_CONTEXT, { components }]]), Form });
