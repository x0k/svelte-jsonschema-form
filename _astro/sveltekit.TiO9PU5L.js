import{p as t}from"./package.D2uID5XT.js";import{o as e}from"./advanced-examples.CLJEbenV.js";import"./each.C1y4Ttji.js";import"./render.-l4jZV6X.js";import"./definitions.DZ-4uMDD.js";import"./_commonjsHelpers.DaWZu8wl.js";import"./snippet.DkaeJbdM.js";import"./shared.0FjE2P_K.js";import"./preload-helper.BUFao3bW.js";import"./buttons.n4uGT5MW.js";/* empty css                                                       *//* empty css                                                                 */const n=`{
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
