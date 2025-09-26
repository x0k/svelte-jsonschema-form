import { objectTests } from 'theme-testing/snapshots/object-field-tests';

import { theme } from '../src/lib/index.js';
import Form from './form.svelte';

objectTests(theme, { Form });
