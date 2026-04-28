import _flowbitePackageJson from "@sjsf/flowbite-icons/package.json" with { type: "json" };
import _lucidePackageJson from "@sjsf/lucide-icons/package.json" with { type: "json" };
import _movingPackageJson from "@sjsf/moving-icons/package.json" with { type: "json" };
import _radixPackageJson from "@sjsf/radix-icons/package.json" with { type: "json" };

import { fromPackageJson, type Package } from "./package.ts";
import type { AtRule, AtRuleOptions } from "./css.ts";

const ICON_SETS = ["flowbite", "lucide", "moving", "radix"] as const;

export type IconSet = (typeof ICON_SETS)[number];

const ICON_SET_TITLES: Record<IconSet, string> = {
  flowbite: "Flowbite",
  lucide: "lucide",
  moving: "moving",
  radix: "Radix",
};

const ICON_SET_PACKAGES = {
  flowbite: fromPackageJson(_flowbitePackageJson),
  lucide: fromPackageJson(_lucidePackageJson),
  moving: fromPackageJson(_movingPackageJson),
  radix: fromPackageJson(_radixPackageJson),
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

export function iconSets(): Iterable<IconSet> {
  return ICON_SETS;
}

export function iconSetTitle(iconSet: IconSet) {
  return ICON_SET_TITLES[iconSet];
}

export function iconSetPackage(iconSet: IconSet): Package {
  return ICON_SET_PACKAGES[iconSet];
}

export function iconSetAtRules(iconSet: IconSet, options: AtRuleOptions) {
  return ICON_SET_AT_RULES[iconSet]?.(options) ?? [];
}
