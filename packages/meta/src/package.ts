type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

interface RawPackage {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
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
  dependencies: PackageDependency[];
}

const DEV_PACKAGES_REGISTRY = new Set([
  "@picocss/pico",
  "json-schema-to-ts",
  "flowbite",
]);

export function fromPackageJson({
  name,
  version,
  peerDependencies = {},
  peerDependenciesMeta = {},
}: RawPackage): Package {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return {
    name,
    version: `^${version}`,
    dev: DEV_PACKAGES_REGISTRY.has(name),
    dependencies: Object.entries(peerDependencies).map(([name, version]) => ({
      name,
      version: formatPeerDependencyVersion(version),
      optional: isOptional(name),
      dev: DEV_PACKAGES_REGISTRY.has(name),
    })),
  };
}

function formatPeerDependencyVersion(version: string) {
  return version.replace("workspace:", "").split("||").at(-1)!.trim();
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

export type IncludeOptional = boolean | Set<string>;

export function* filterPackageDependencies(
  dependencies: Iterable<PackageDependency>,
  includeOptional: IncludeOptional = false,
): Iterable<PackageDependency> {
  const isBoolFilter = typeof includeOptional === "boolean";
  for (const d of dependencies) {
    if (
      d.optional &&
      !(isBoolFilter ? includeOptional : includeOptional.has(d.name))
    ) {
      continue;
    }
    yield d;
  }
}
