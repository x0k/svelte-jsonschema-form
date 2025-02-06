import type { Theme } from "@/form/index.js";
import { fields } from '@/form/fields/index.js';
import { templates } from '@/form/templates/index.js';

import { components } from "./components/index.js";
import { widgets } from "./widgets/index.js";

declare module "@/form/index.js" {
  interface FormElements {
    form: HTMLFormElement
  }
}

export const theme = {
  components,
  widgets,
  fields,
  templates,
} satisfies Theme;
