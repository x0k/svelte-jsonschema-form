import type { Component, Components, ComponentType } from '@sjsf/form';

import FormComponent from './form.svelte';
import ButtonComponent from './button.svelte';
import LayoutComponent from './layout.svelte';
import TitleComponent from './title.svelte';
import DescriptionComponent from './description.svelte';
import HelpComponent from './help.svelte';
import ErrorsList from './errors-list.svelte';

export const registry: { [T in ComponentType]: Component<T> } = {
	form: FormComponent,
	button: ButtonComponent,
	layout: LayoutComponent,
	title: TitleComponent,
	description: DescriptionComponent,
	help: HelpComponent,
	errorsList: ErrorsList
};

export const components: Components = (type) => registry[type];
