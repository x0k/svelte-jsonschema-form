type PeerDependenciesMeta = Record<string, { optional?: boolean }>;

export interface Package {
  name: string;
  version: string;
  peerDependencies?: Record<string, string>;
  peerDependenciesMeta?: PeerDependenciesMeta;
}

function formatPeerDependencyVersion(version: string) {
  return version.replace("workspace:", "").split("||").at(-1)!.trim();
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

export type PeerDependenciesOptions = boolean | Set<string>;

export function* peerDependencies(
  { peerDependencies = {}, peerDependenciesMeta = {} }: Package,
  includeOptional: PeerDependenciesOptions = false,
): Generator<[name: string, version: string]> {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  const isBoolFilter = typeof includeOptional === "boolean";
  for (const [name, version] of Object.entries(peerDependencies)) {
    if (
      isOptional(name) &&
      !(isBoolFilter ? includeOptional : includeOptional.has(name))
    ) {
      continue;
    }
    yield [name, formatPeerDependencyVersion(version)];
  }
}

export interface PeerDependency {
  name: string;
  version: string;
  optional: boolean;
}

export function peerDependenciesMetadata({
  peerDependencies = {},
  peerDependenciesMeta = {},
}: Package): PeerDependency[] {
  const isOptional = createMetaExtractor(peerDependenciesMeta);
  return Object.entries(peerDependencies).map(([name, version]) => ({
    name,
    version: formatPeerDependencyVersion(version),
    optional: isOptional(name),
  }));
}
