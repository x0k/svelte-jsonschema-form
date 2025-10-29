import{p as t}from"./package._0ULKFQ3.js";import{o as e}from"./advanced-examples.DS8dmNvb.js";import"./each.mpKmeHYv.js";import"./render.gEp3m_LP.js";import"./definitions.DHCzoh2g.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.Dj95Z4E7.js";import"./shared.DfRIL9pD.js";import"./preload-helper.1-HTDuIo.js";import"./buttons.CEFJ03XP.js";/* empty css                                                       *//* empty css                                                                 */const n=`{
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
}`,o=`<!doctype html>
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
`,s={"tsconfig.json":n,"src/app.html":o},f={package:e(t),vite:{plugins:{"@sveltejs/kit/vite":{import:"{ sveltekit }",call:"sveltekit()"}}},files:s};export{f as layer};
