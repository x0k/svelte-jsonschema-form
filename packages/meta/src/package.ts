type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

export interface AbstractPackage {
  name: string;
  version: string;
}

export interface PackageDependency extends AbstractPackage {
  optional: boolean;
  dev: boolean;
}

export interface Package extends AbstractPackage {
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
}

const DEV_PACKAGES_REGISTRY = new Set([
  "@picocss/pico",
  "json-schema-to-ts",
  "flowbite",
]);

function formatPeerDependencyVersion(version: string) {
  return version.replace("workspace:", "").split("||").at(-1)!.trim();
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

export type PeerDependenciesOptions = boolean | Set<string>;

export function* filterPackageDependencies(
  dependencies: Iterable<PackageDependency>,
  includeOptional: PeerDependenciesOptions = false,
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

export function peerDependencies(
  { peerDependencies = {}, peerDependenciesMeta = {} }: Package,
  includeOptional?: PeerDependenciesOptions,
): Iterable<PackageDependency> {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return filterPackageDependencies(
    Object.entries(peerDependencies).map(([name, version]) => ({
      name,
      version,
      optional: isOptional(name),
      dev: DEV_PACKAGES_REGISTRY.has(name),
    })),
    includeOptional,
  );
}

export function peerDependenciesMetadata({
  peerDependencies = {},
  peerDependenciesMeta = {},
}: Package): Iterable<PackageDependency> {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return Object.entries(peerDependencies).map(([name, version]) => ({
    name,
    version: formatPeerDependencyVersion(version),
    optional: isOptional(name),
    dev: DEV_PACKAGES_REGISTRY.has(name),
  }));
}
