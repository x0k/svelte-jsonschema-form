import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve paths
const source = resolve(
	fileURLToPath(import.meta.url),
	'../../node_modules/@skeletonlabs/skeleton-svelte/dist/components/Segment/types.d.ts'
);
const dest = resolve(fileURLToPath(import.meta.url), '../../src/lib/segment-types.d.ts');

// Ensure target directory exists
mkdirSync(dirname(dest), { recursive: true });

// Copy file
copyFileSync(source, dest);

console.log(`Copied: ${source} -> ${dest}`);
