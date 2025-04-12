import type { Id } from '@sjsf/form'
import { getContext, setContext, type Snippet } from 'svelte'

export interface TabsNode {
  children: TabsContext
  readonly tabs: Snippet[]
  selectedTab: number
}

export type TabsContext = Map<Id, TabsNode>

const TABS_CONTEXT = Symbol()

export function getTabsContext(): TabsContext {
  return getContext(TABS_CONTEXT)
}

export function setTabsContext(ctx: TabsContext) {
  setContext(TABS_CONTEXT, ctx)
}

const TABS_NODE_CONTEXT = Symbol()

export function getTabsNodeContext(): TabsNode {
  return getContext(TABS_NODE_CONTEXT)
}

export function setTabsNodeContext(ctx: TabsNode) {
  setContext(TABS_NODE_CONTEXT, ctx)
}

export function createTabsNode(initialTab: number): TabsNode {
  const tabs = $state<Snippet[]>([])
  let selectedTab = $state(initialTab)
  return {
    children: new Map(),
    get tabs() {
      return tabs
    },
    get selectedTab() {
      return selectedTab
    },
    set selectedTab(v) {
      selectedTab = v
    }
  }
}
