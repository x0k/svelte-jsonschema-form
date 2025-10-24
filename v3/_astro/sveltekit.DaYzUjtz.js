import{p as t}from"./package.Csb99hK1.js";import{o as e}from"./advanced-examples.BkFBhb_n.js";import"./each.QeOQJl6X.js";import"./render.H0AegGA0.js";import"./definitions.ZtG-Tena.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.BgtKOETU.js";import"./shared.CIv1cTDx.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CvAcS7W6.js";/* empty css                                                       *//* empty css                                                                 */const n=`import adapter from "@sveltejs/adapter-auto";
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
    experimental: {
      remoteFunctions: true,
    },
  },
  compilerOptions: {
    runes: true,
    experimental: {
      async: true,
    },
  },
};

export default config;
`,o=`{
	"extends": "./.svelte-kit/tsconfig.json",
	"compilerOptions": {
		"lib": [
			"esnext",
			"DOM",
			"DOM.Iterable",
			"DOM.AsyncIterable"
		],
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
}`,s=`<!doctype html>
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
`,i={"svelte.config.js":n,"tsconfig.json":o,"src/app.html":s},g={package:e(t),vite:{plugins:{"@sveltejs/kit/vite":{import:"{ sveltekit }",call:"sveltekit()"}}},files:i};export{g as layer};
