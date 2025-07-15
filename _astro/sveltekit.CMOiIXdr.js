import{p as t}from"./package.Dcs-j8oq.js";import{o as e}from"./advanced-examples.BRiQse49.js";import"./_commonjsHelpers.BQuq4T_S.js";import"./render.CP1IS3HJ.js";import"./function.DiXyTdGP.js";import"./shared.y3pRYwqI.js";import"./preload-helper.CndyEa7M.js";import"./buttons.BnY44wo8.js";/* empty css                                                       *//* empty css                                                                 */const n=`import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://svelte.dev/docs/kit/adapters for more information about adapters.
    adapter: adapter(),
  },
  compilerOptions: {
    runes: true,
  },
};

export default config;
`,o=`{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"allowJs": true,
		"checkJs": true,
		"esModuleInterop": true,
		"forceConsistentCasingInFileNames": true,
		"resolveJsonModule": true,
		"skipLibCheck": true,
		"sourceMap": true,
		"strict": true,
		"moduleResolution": "bundler"
	}
	// Path aliases are handled by https://svelte.dev/docs/kit/configuration#alias
	// except $lib which is handled by https://svelte.dev/docs/kit/configuration#files
	//
	// If you want to overwrite includes/excludes, make sure to copy over the relevant includes/excludes
	// from the referenced tsconfig.json - TypeScript does not merge them in
}
`,s=`<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.png" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
`,i={"svelte.config.js":n,"tsconfig.json":o,"src/app.html":s},h={package:e(t),vite:{plugins:{"@sveltejs/kit/vite":{import:"{ sveltekit }",call:"sveltekit()"}}},files:i};export{h as layer};
