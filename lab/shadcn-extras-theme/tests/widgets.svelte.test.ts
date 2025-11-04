import { THEME_CONTEXT } from '@sjsf/shadcn4-theme/internal';
import { widgetTests } from 'theme-testing/snapshots/widget-tests';

import * as components from '../src/lib/components/ui/index.js';

import { theme } from '../src/lib/theme/index.js';
import { specs } from '../src/lib/specs.js';
import Form from './form.svelte';

widgetTests(theme, specs, { context: new Map([[THEME_CONTEXT, { components }]]), Form });
