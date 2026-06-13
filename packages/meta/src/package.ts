import { EXTRA_PACKAGES } from "./packages.generated.ts";

type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

interface RawPackage {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
  repository?: {
    directory?: string;
  };
}

export interface AbstractPackage {
  name: string;
  version: string;
  dev: boolean;
}

export interface PackageDependency extends AbstractPackage {
  optional: boolean;
}

export interface Package extends AbstractPackage {
  directory: string;
  dependencies: PackageDependency[];
}

export type ExtraPackage = keyof typeof EXTRA_PACKAGES;

const OPTIONAL_PKG = {
  skeletonSvelte: "@skeletonlabs/skeleton-svelte",
  internationalizedDate: "@internationalized/date",
  standardSchemaSpec: "@standard-schema/spec",
  cally: "cally",
  pikaday: "pikaday",
};

export type OptionalPackage = keyof typeof OPTIONAL_PKG;

const DEV_PACKAGES_REGISTRY = new Set([
  "esm-env",
  "@tailwindcss/forms",
  "flowbite",
  "@picocss/pico",
]);

export function fromPackageJson({
  name,
  version,
  peerDependencies = {},
  peerDependenciesMeta = {},
  repository: { directory = "" } = {},
}: RawPackage): Package {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return {
    name,
    version,
    dev: DEV_PACKAGES_REGISTRY.has(name),
    directory,
    dependencies: Object.entries(peerDependencies).map(([name, version]) => ({
      name,
      version: formatPeerDependencyVersion(version),
      optional: isOptional(name),
      dev: DEV_PACKAGES_REGISTRY.has(name),
    })),
  };
}

export type Version = [number, number, number];

export function createVersion(versionStr: string) {
  const t = versionStr.split(".").map(Number);
  if (t.length !== 3 || t.some(isNaN)) {
    throw new Error(`Unexpected version format: "${versionStr}"`);
  }
  return t as Version;
}

const VERSION_MODIFIERS = ["^", "~", "<=", "<"] as const;

export function resolveExactVersion(versionStr: string): string {
  const m = VERSION_MODIFIERS.find((m) => versionStr.startsWith(m));
  if (m) {
    versionStr = versionStr.slice(m.length);
  }
  const ver = createVersion(versionStr);
  if (m === "<") {
    ver[ver[0] === 0 ? 1 : 0]--;
  }
  return ver.join(".");
}

function formatPeerDependencyVersion(version: string) {
  const str = version.replace("workspace:", "").split(" ").at(-1)!.trim();
  return resolveExactVersion(str);
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

// `true` filter is redundant
export type IncludeOptional = false | Iterable<string>;

export function* filterPackageDependencies(
  dependencies: Iterable<PackageDependency>,
  includeOptional: IncludeOptional,
): Iterable<PackageDependency> {
  let isIncluded: (d: PackageDependency) => boolean;
  if (typeof includeOptional === "boolean") {
    isIncluded = () => includeOptional;
  } else {
    const toInclude = new Set(includeOptional);
    isIncluded = (d) => toInclude.has(d.name);
  }
  for (const d of dependencies) {
    if (!d.optional || isIncluded(d)) {
      yield d;
    }
  }
}

export function extraPackage(extraPkg: ExtraPackage): AbstractPackage {
  return EXTRA_PACKAGES[extraPkg];
}

export function optionalPackageName(optionalPkg: OptionalPackage): string {
  return OPTIONAL_PKG[optionalPkg];
}
