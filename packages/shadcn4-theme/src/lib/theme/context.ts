import { getContext, setContext } from 'svelte';

export interface ThemeComponents {}

export interface ThemeContext {
	components: ThemeComponents;
}

const THEME_CONTEXT = Symbol('theme-context');

export function getThemeContext(): ThemeContext {
	return getContext(THEME_CONTEXT);
}

export function setThemeContext(ctx: ThemeContext) {
	setContext(THEME_CONTEXT, ctx);
}
