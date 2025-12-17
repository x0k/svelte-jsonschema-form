<script lang="ts">
	import type { Component } from 'svelte';
	import type { SVGAttributes } from 'svelte/elements';

  import MdiSegment from '~icons/mdi/segment';
  import MdiGridLarge from '~icons/mdi/grid-large';
  import MdiFormatListBulleted from '~icons/mdi/format-list-bulleted';
  import MdiRadioboxBlank from '~icons/mdi/radiobox-blank';
  import MdiCheckboxBlankOutline from '~icons/mdi/checkbox-blank-outline';
  import MdiCursorText from '~icons/mdi/cursor-text';
  import MdiHashtag from '~icons/mdi/hashtag';
  import MdiToggleSwitchOffOutline from '~icons/mdi/toggle-switch-off-outline';
  import MdiAttachFile from '~icons/mdi/attach-file';
  import MdiTag from '~icons/mdi/tag';

  import MdiSetAnd from '~icons/mdi/set-and';
  import MdiSetOr from '~icons/mdi/set-or';
  import MdiSetXor from '~icons/mdi/set-xor';
  import MdiSetNot from '~icons/mdi/set-not';
  import MdiEqual from '~icons/mdi/equal';
  import MdiFormatListChecks from '~icons/mdi/format-list-checks';
  import MdiRegex from '~icons/mdi/regex';
  import MdiArrowExpandHorizontal from '~icons/mdi/arrow-expand-horizontal';
  import MdiArrowCollapseHorizontal from '~icons/mdi/arrow-collapse-horizontal';
  import MdiLessThan from '~icons/mdi/less-than';
  import MdiLessThanOrEqual from '~icons/mdi/less-than-or-equal';
  import MdiGreaterThan from '~icons/mdi/greater-than';
  import MdiGreaterThanOrEqual from '~icons/mdi/greater-than-or-equal';
  import MdiMultiplication from '~icons/mdi/multiplication';
  import MdiContain from '~icons/mdi/contain';
  import MdiMinusBox from '~icons/mdi/minus-box';
  import MdiPlusBox from '~icons/mdi/plus-box';
  import MdiVectorArrangeAbove from '~icons/mdi/vector-arrange-above';
  import MdiPageNextOutline from '~icons/mdi/page-next-outline';
  import MdiFileTree from '~icons/mdi/file-tree';
  import MdiArrowLeftRight from '~icons/mdi/arrow-left-right';
  import MdiFormatText from '~icons/mdi/format-text';

	import {
		createNode,
		createOperatorNode,
		CUSTOMIZABLE_TYPE_TITLES,
		detectApplicableOperators,
		NodeType,
		OPERATOR_TITLES,
		OPERATOR_TYPES,
		OperatorType,
		type Node
	} from '$lib/builder/index.js';

	import { getBuilderContext } from '../context.svelte.js';
	import NodeFactory from '../node-factory.svelte';

	const NODE_ICONS: Record<NodeType, Component<SVGAttributes<SVGSVGElement>> | null> = {
    [NodeType.Object]: MdiSegment,
    [NodeType.ObjectProperty]: null,
    [NodeType.ObjectPropertyDependency]: null,
    [NodeType.Predicate]: null,
    [NodeType.Operator]: null,
    [NodeType.Array]: MdiFormatListBulleted,
    [NodeType.Grid]: MdiGridLarge,
    [NodeType.Enum]: MdiRadioboxBlank,
    [NodeType.MultiEnum]: MdiCheckboxBlankOutline,
    [NodeType.EnumItem]: null,
    [NodeType.String]: MdiCursorText,
    [NodeType.Number]: MdiHashtag,
    [NodeType.Boolean]: MdiToggleSwitchOffOutline,
    [NodeType.File]: MdiAttachFile,
    [NodeType.Tags]: MdiTag,
    [NodeType.Range]: MdiArrowLeftRight,
  };

  const OPERATOR_ICONS: Record<OperatorType, Component<SVGAttributes<SVGSVGElement>>> = {
      [OperatorType.And]: MdiSetAnd,
      [OperatorType.Or]: MdiSetOr,
      [OperatorType.Xor]: MdiSetXor,
      [OperatorType.Not]: MdiSetNot,
      // Shared
      [OperatorType.Eq]: MdiEqual,
      [OperatorType.In]: MdiFormatListChecks,
      // String
      [OperatorType.Format]: MdiFormatText,
      [OperatorType.Pattern]: MdiRegex,
      [OperatorType.MinLength]: MdiArrowCollapseHorizontal,
      [OperatorType.MaxLength]: MdiArrowExpandHorizontal,
      // Number
      [OperatorType.Less]: MdiLessThan,
      [OperatorType.LessOrEq]: MdiLessThanOrEqual,
      [OperatorType.Greater]: MdiGreaterThan,
      [OperatorType.GreaterOrEq]: MdiGreaterThanOrEqual,
      [OperatorType.MultipleOf]: MdiMultiplication,
      // Array
      [OperatorType.Contains]: MdiContain,
      [OperatorType.MinItems]: MdiMinusBox,
      [OperatorType.MaxItems]: MdiPlusBox,
      [OperatorType.UniqueItems]: MdiVectorArrangeAbove,
      // Object
      [OperatorType.HasProperty]: MdiPageNextOutline,
      [OperatorType.Property]: MdiFileTree,
  }

	const ctx = getBuilderContext();
	const entries: {
		id: string;
		factory: () => Node;
		title: string;
		nodeType: NodeType;
		operatorType?: OperatorType;
	}[] = $derived.by(() => {
		if (ctx.selectedNode?.type === NodeType.Predicate) {
			// NOTE: Affected node should be always defined
			const ops = detectApplicableOperators(ctx.affectedNode ?? ctx.selectedNode);
			return OPERATOR_TYPES.filter((t) => ops.has(t)).map((t) => ({
				id: `op::${t}`,
				factory: () => createOperatorNode(t),
				title: OPERATOR_TITLES[t],
				nodeType: NodeType.Operator,
				operatorType: t
			}));
		}
		return ctx.availableCustomizableNodeTypes.map((t) => ({
			id: `node::${t}`,
			factory: () => createNode(t),
			title: CUSTOMIZABLE_TYPE_TITLES[t],
			nodeType: t
		}));
	});
</script>

<div class="flex flex-col gap-2">
	{#each entries as { id, factory, title, nodeType, operatorType } (id)}
		<NodeFactory createNode={factory} {title}>
			{#snippet icon()}
				{@const Icon = operatorType ? OPERATOR_ICONS[operatorType] : NODE_ICONS[nodeType]}
        <Icon />
			{/snippet}
		</NodeFactory>
	{/each}
</div>
