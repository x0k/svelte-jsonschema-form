import { defineConfig } from "jsrepo";
import prettier from "@jsrepo/transform-prettier";
    
export default defineConfig({
	registries: [
	"@ieedan/shadcn-svelte-extras"
],
	paths: {
	"*": "./src/blocks",
	"ui": "$lib/components/ui",
	"actions": "$lib/actions",
	"hooks": "$lib/hooks",
	"utils": "$lib/utils"
},
	transforms: [prettier()],
});