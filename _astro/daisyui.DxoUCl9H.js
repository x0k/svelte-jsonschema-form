import{o as t}from"./advanced-examples.CEulQ5SC.js";import"./each.D9J1edTM.js";import"./render.CJVHSWjk.js";import"./definitions.CjwYPYqW.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.StJGqR0u.js";import"./shared.DQz9udL4.js";import"./preload-helper.BUFao3bW.js";import"./buttons.Dia9lCGu.js";/* empty css                                                       *//* empty css                                                                 */const e="daisyui-starter",n="0.0.3",s="module",i={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},a={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",autoprefixer:"^10.4.21",daisyui:"^4.12.24",svelte:"^5.30.0","svelte-check":"^4.3.1",tailwindcss:"^3.4.18",postcss:"^8.5.6",typescript:"^5.9.2",vite:"^7.1.2"},o={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/daisyui-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1"},r={name:e,private:!0,version:n,type:s,scripts:i,devDependencies:a,dependencies:o},c=`import daisyui from 'daisyui';
import { THEME_CONTENT } from '@sjsf/daisyui-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT],
	darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {}
	},
	plugins: [daisyui],
	daisyui: {
		themes: [
			'light',
			'dark',
			'cupcake',
			'bumblebee',
			'emerald',
			'corporate',
			'synthwave',
			'retro',
			'cyberpunk',
			'valentine',
			'halloween',
			'garden',
			'forest',
			'aqua',
			'lofi',
			'pastel',
			'fantasy',
			'wireframe',
			'black',
			'luxury',
			'dracula',
			'cmyk',
			'autumn',
			'business',
			'acid',
			'lemonade',
			'night',
			'coffee',
			'winter',
			'dim',
			'nord',
			'sunset'
		]
	}
};
`,g={package:t(r),formDefaults:{theme:"daisyui"},files:{"tailwind.config.js":c}};export{g as layer};
