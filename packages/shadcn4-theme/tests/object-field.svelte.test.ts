import { objectTests } from 'testing/snapshots/object-field-tests';

import * as components from '../src/lib/components/ui/index.js';
import { THEME_CONTEXT } from '../src/lib/theme/internal.js';

import { theme } from '../src/lib/theme/index.js';
import Form from './form.svelte';

objectTests(theme, { context: new Map([[THEME_CONTEXT, { components }]]), Form });
