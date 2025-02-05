import { createComponents } from "@/form/index.js";

import FormComponent from "./form-component.svelte";
import ButtonComponent from "./button-component.svelte";
import LayoutComponent from "./layout-component.svelte";
import TitleComponent from "./title-component.svelte";
import DescriptionComponent from "./description-component.svelte";
import HelpComponent from "./help-component.svelte";
import ErrorsList from "./errors-list.svelte";

export const components = createComponents({
  form: FormComponent,
  button: ButtonComponent,
  layout: LayoutComponent,
  title: TitleComponent,
  description: DescriptionComponent,
  help: HelpComponent,
  errorsList: ErrorsList,
});
