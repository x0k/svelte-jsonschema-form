import flowbitePackage from "@sjsf/flowbite-icons/package.json" with { type: "json" };
import lucidePackage from "@sjsf/lucide-icons/package.json" with { type: "json" };
import movingPackage from "@sjsf/moving-icons/package.json" with { type: "json" };
import radixPackage from "@sjsf/radix-icons/package.json" with { type: "json" };

import {
  peerDependencies,
  type Package,
  type PeerDependenciesOptions,
} from "./package.js";
import type { AtRule, AtRuleOptions } from "./css.js";

const ICON_SETS = ["flowbite", "lucide", "moving", "radix"] as const;

export type IconSet = (typeof ICON_SETS)[number];

const ICONS = [...ICON_SETS];

const ICON_SET_TITLES: Record<IconSet, string> = {
  flowbite: "Flowbite",
  lucide: "lucide",
  moving: "moving",
  radix: "Radix",
};

const ICON_SET_PACKAGES = {
  flowbite: flowbitePackage,
  lucide: lucidePackage,
  moving: movingPackage,
  radix: radixPackage,
} satisfies Record<IconSet, Package>;

const ICON_SET_AT_RULES: Partial<
  Record<IconSet, (options: AtRuleOptions) => AtRule[]>
> = {
  flowbite: ({ nodeModulesPath }) => [
    {
      name: "source",
      params: `${nodeModulesPath}/${iconSetPackage("flowbite").name}/dist`,
    },
  ],
};

export function iconSets(): IconSet[] {
  return ICONS;
}

export function iconSetTitle(iconSet: IconSet) {
  return ICON_SET_TITLES[iconSet];
}

export function iconSetPackage(iconSet: IconSet): Package {
  return ICON_SET_PACKAGES[iconSet];
}

export function iconSetDependencies(
  iconSet: IconSet,
  options?: PeerDependenciesOptions,
) {
  return peerDependencies(ICON_SET_PACKAGES[iconSet], options);
}

export function iconSetAtRules(iconSet: IconSet, options: AtRuleOptions) {
  return ICON_SET_AT_RULES[iconSet]?.(options) ?? [];
}
