import { arrayFieldTests } from "testing/snapshots/array-field-tests";

import { theme } from "../src/lib/index.js";
import Form from './form.svelte'

arrayFieldTests(theme, { Form });
