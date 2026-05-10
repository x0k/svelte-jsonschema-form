import{a as e}from"./layer.CYwf_3o2.js";import{t}from"./package.Dv2RrwKK.js";var n={package:e(t),vite:{plugins:{"@sveltejs/kit/vite":{import:`{ sveltekit }`,call:`sveltekit()`}}},files:{"tsconfig.json":`{
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
}`,"src/app.html":`<!doctype html>
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
`}};export{n as layer};