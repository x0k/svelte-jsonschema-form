import type { Widget, Widgets, WidgetType } from "@/components/form";

import TextWidget from "./text-widget.svelte";
import TextareaWidget from "./textarea-widget.svelte";
import NumberWidget from "./number-widget.svelte";
import SelectWidget from "./select-widget.svelte";
import CheckBoxWidget from "./checkbox-widget.svelte";
import RadioWidget from './radio-widget.svelte';
import CheckboxesWidget from './checkboxes-widget.svelte';
import EmailWidget from './email-widget.svelte';
import UrlWidget from './url-widget.svelte';

export const registry: { [T in WidgetType]: Widget<T> } = {
  text: TextWidget,
  textarea: TextareaWidget,
  number: NumberWidget,
  select: SelectWidget,
  checkbox: CheckBoxWidget,
  radio: RadioWidget,
  checkboxes: CheckboxesWidget,
  url: UrlWidget,
  email: EmailWidget,
};

export const widgets: Widgets = (type) => registry[type];
