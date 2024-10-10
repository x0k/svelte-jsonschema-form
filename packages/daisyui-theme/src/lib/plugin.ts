import plugin from 'tailwindcss/plugin';

export const THEME_CONTENT = './node_modules/@sjsf/daisyui-theme/dist/**/*.{html,js,svelte,ts}';

export default plugin(() => {}, {
	content: [THEME_CONTENT]
});
