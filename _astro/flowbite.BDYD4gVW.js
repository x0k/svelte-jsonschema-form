import{o as t}from"./advanced-examples.Cp7TO-Xm.js";import"./each.CgaYJsoO.js";import"./render.BS0Exw5_.js";import"./definitions.y_LKrXC-.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.2SqGvurC.js";import"./shared.y6mgI_aI.js";import"./preload-helper.BUFao3bW.js";import"./buttons.aGVqK1Op.js";/* empty css                                                       *//* empty css                                                                 */const e="flowbite-starter",s="0.0.8",o="module",n={dev:"vite dev",preview:"vite preview",prepare:"svelte-kit sync || echo ''",check:"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json","check:watch":"svelte-kit sync && svelte-check --tsconfig ./tsconfig.json --watch"},i={"@sveltejs/adapter-auto":"^6.1.0","@sveltejs/kit":"^2.42.0","@sveltejs/vite-plugin-svelte":"^6.1.2",autoprefixer:"^10.4.21",flowbite:"^2.5.2",svelte:"^5.34.8","svelte-check":"^4.3.1",tailwindcss:"^3.4.18",postcss:"^8.5.6",typescript:"^5.9.2",vite:"^7.1.2"},c={"@sjsf/ajv8-validator":"workspace:*","@sjsf/basic-theme":"workspace:*","@sjsf/flowbite-theme":"workspace:*","@sjsf/form":"workspace:*",ajv:"^8.17.1","flowbite-svelte":"~0.47.4"},r={name:e,private:!0,version:s,type:o,scripts:n,devDependencies:i,dependencies:c},p=`import flowbite from 'flowbite/plugin';
import { THEME_CONTENT, FLOWBITE_CONTENT } from '@sjsf/flowbite-theme/preset'

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}', THEME_CONTENT, FLOWBITE_CONTENT],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			}
		}
	},
	plugins: [flowbite]
};
`,j={package:t(r),formDefaults:{theme:"flowbite"},files:{"tailwind.config.js":p},svelte:{compilerOptions:{runes:!1}}};export{j as layer};
