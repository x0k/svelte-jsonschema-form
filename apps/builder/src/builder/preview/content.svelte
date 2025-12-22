<script lang="ts">
	import { isRecordEmpty } from '@sjsf/form/lib/object';

	import Code, { type CodeFile } from '$lib/components/code.svelte';

	import DeviconPlainSvelte from '~icons/devicon-plain/svelte';
	import DeviconPlainTypescript from '~icons/devicon-plain/typescript';
	import DeviconPlainBash from '~icons/devicon-plain/bash';
	import DeviconPlainCss from '~icons/devicon-plain/css';
	import MdiCodeJson from '~icons/mdi/code-json';

	import { getBuilderContext } from '../context.svelte.js';
	import { PreviewSubRouteName, type PreviewRoute } from '../model.js';
	import Form from './form.svelte';

	const { route }: { route: PreviewRoute } = $props();

	const ctx = getBuilderContext();

	const ROUTE_FILES: Record<PreviewSubRouteName, () => CodeFile[]> = {
		[PreviewSubRouteName.Code]: () => {
			const files: CodeFile[] = [
				{
					Icon: DeviconPlainSvelte,
					title: 'form.svelte',
					get content() {
						return ctx.formDotSvelte;
					}
				},
				{
					Icon: DeviconPlainTypescript,
					title: 'defaults.ts',
					get content() {
						return ctx.formDefaults;
					}
				},
				{
					Icon: DeviconPlainBash,
					title: 'install.sh',
					get content() {
						return ctx.installSh;
					}
				}
			];
			if (ctx.appCss.length > 0) {
				files.splice(2, 0, {
					Icon: DeviconPlainCss,
					title: 'app.css',
					get content() {
						return ctx.appCss;
					}
				});
			}
			return files;
		},
		[PreviewSubRouteName.Schema]: () => {
			const files = [
				{
					Icon: MdiCodeJson,
					title: 'schema.json',
					get content() {
						return ctx.highlight('json', JSON.stringify(ctx.schema, null, 2));
					}
				}
			];
			if (ctx.uiSchema && !isRecordEmpty(ctx.uiSchema)) {
				files.push({
					Icon: MdiCodeJson,
					title: 'ui-schema.json',
					get content() {
						return ctx.highlight('json', JSON.stringify(ctx.uiSchema ?? {}, null, 2));
					}
				});
			}
			return files;
		}
	};
</script>

{#if route.subRoute === undefined}
	<Form />
{:else}
	<Code files={ROUTE_FILES[route.subRoute]()} />
{/if}
