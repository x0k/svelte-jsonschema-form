import type { Id } from '@sjsf/form'
import { getContext, setContext, type Snippet } from 'svelte'

export interface Tabs {
  readonly tabs: Snippet[]
  selectedTab: number
}

export type TabsContext = Map<Id, Tabs>

const TABS_CONTEXT = Symbol()

export function getTabsContext(): TabsContext {
  return getContext(TABS_CONTEXT)
}

export function setTabsContext(ctx: TabsContext) {
  setContext(TABS_CONTEXT, ctx)
}

export function createTabs(initialTab: number): Tabs {
  const tabs = $state<Snippet[]>([])
  let selectedTab = $state(initialTab)
  return {
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
