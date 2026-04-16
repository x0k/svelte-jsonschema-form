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

export const EXTRA_PKG = {
  ajvFormat: {
    name: "avj-format",
    version: "^3.0.0",
    dev: false,
  },
  jsonSchemaToTs: {
    name: "json-schema-to-ts",
    version: "^3.0.0",
    dev: true,
  },
} as const satisfies Record<string, AbstractPackage>;

export const OPTIONAL_PKG = {
  skeletonSvelte: "@skeletonlabs/skeleton-svelte",
  internationalizedDate: "@internationalized/date",
  standardSchemaSpec: "@standard-schema/spec",
  cally: "cally",
  pikaday: "pikaday",
};

const DEV_PACKAGES_REGISTRY = new Set([
  "@tailwindcss/forms",
  "flowbite",
  "@picocss/pico",
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
