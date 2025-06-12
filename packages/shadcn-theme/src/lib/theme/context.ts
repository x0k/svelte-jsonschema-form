import { getContext, setContext } from 'svelte';

import { THEME_CONTEXT } from './internal';

export interface ThemeComponents {}

export interface ThemeContext {
	components: ThemeComponents;
}

export function getThemeContext(): ThemeContext {
	return getContext(THEME_CONTEXT);
}

export function setThemeContext(ctx: ThemeContext) {
	setContext(THEME_CONTEXT, ctx);
}
