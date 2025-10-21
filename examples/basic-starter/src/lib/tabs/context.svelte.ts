import type { PathTrieRef } from "@sjsf/form";
import { createContext, type Snippet } from "svelte";

export interface TabsNode {
  readonly tabs: Snippet[];
  selectedTab: number;
}

export type TabsContext = PathTrieRef<TabsNode>;

export const [getTabsContext, setTabsContext] = createContext<TabsContext>();

export function createTabsNode(initialTab: number): TabsNode {
  let selectedTab = $state(initialTab);
  return {
    tabs: [],
    get selectedTab() {
      return selectedTab;
    },
    set selectedTab(v) {
      selectedTab = v;
    },
  };
}
