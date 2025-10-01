import type { PathTrieRef } from '@sjsf/form'
import { getContext, setContext, type Snippet } from 'svelte'

export interface TabsNode {
  readonly tabs: Snippet[]
  selectedTab: number
}

export type TabsContext = PathTrieRef<TabsNode>

const TABS_CONTEXT = Symbol()

export function getTabsContext(): TabsContext {
  return getContext(TABS_CONTEXT)
}

export function setTabsContext(ctx: TabsContext) {
  setContext(TABS_CONTEXT, ctx)
}

export function createTabsNode(initialTab: number): TabsNode {
  let selectedTab = $state(initialTab)
  return {
    tabs: [],
    get selectedTab() {
      return selectedTab
    },
    set selectedTab(v) {
      selectedTab = v
    }
  }
}
