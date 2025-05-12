<script lang="ts" module>
  import type { Snippet } from "svelte";

  export const ORIENTATION = {
    Vertical: "vertical",
    Horizontal: "horizontal",
  } as const;

  export type Orientation = (typeof ORIENTATION)[keyof typeof ORIENTATION];

  export interface TreeNodeProps {}

  export type TreeNodeLeaf = {
    initialSize?: number;
    render: Snippet;
  };

  export type TreeNodeRoot = {
    children: TreeNode[];
  };

  export type TreeNode = TreeNodeRoot | TreeNodeLeaf;

  export interface ResizerProps {}

  export type Resizer = Snippet<[ResizerProps]>;

  export interface ContainerProps {
    children: Snippet;
  }

  export type Container = Snippet<[ContainerProps]>;
</script>

<script lang="ts">
  import Self from "./panes-tree.svelte";

  interface Props {
    nodes: TreeNode[];
    resizer: Resizer;
    container: Container;
  }

  const { nodes, container, resizer }: Props = $props();
</script>

{#snippet node(index: number)}
  {@const n = nodes[index]!}
  {#if "render" in n}
    {@render n.render()}
  {:else}
    <Self nodes={n.children} {container} {resizer} />
  {/if}
{/snippet}
{#snippet children()}
  {#if nodes.length > 0}
    {@render node(0)}
    {#each { length: nodes.length - 1 }, i}
      {@render resizer({})}
      {@render node(i + 1)}
    {/each}
  {/if}
{/snippet}

{@render container({ children })}
