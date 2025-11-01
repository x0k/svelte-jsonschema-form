import { widgetTests } from 'theme-testing/snapshots/widget-tests';

import { theme } from '../src/lib/index.js';
import { specs } from '../src/lib/specs.js';
import Form from './form.svelte';

widgetTests(theme, specs, { Form });
