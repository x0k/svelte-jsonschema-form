import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: ['class', '[data-theme="dark"]'],
	theme: {
		extend: {}
	},
	plugins: [daisyui],
  daisyui: {
    themes: ["light", "dark"],
  }
};
