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

const EXTRA_PACKAGES = {
  ajvFormat: {
    name: "ajv-formats",
    version: "3.0.0",
    dev: false,
  },
  jsonSchemaToTs: {
    name: "json-schema-to-ts",
    version: "3.0.0",
    dev: true,
  },
  esbuild: {
    name: "esbuild",
    version: "0.28.0",
    dev: true,
  },
  devalue: {
    name: "devalue",
    version: "5.7.0",
    dev: true,
  },
  pico: {
    name: "@picocss/pico",
    version: "2.1.0",
    dev: true,
  },
  vite: {
    name: "vite",
    version: "8.0.10",
    dev: true,
  },
  typescript: {
    name: "typescript",
    version: "6.0.0",
    dev: true,
  },
  svelteVitePlugin: {
    name: "@sveltejs/vite-plugin-svelte",
    version: "7.1.2",
    dev: true,
  },
  svelteAdapterAuto: {
    name: "@sveltejs/adapter-auto",
    version: "7.0.1",
    dev: true,
  },
  tailwindcss3: {
    name: "tailwindcss",
    version: "3.4.17",
    dev: true,
  },
  postcss: {
    name: "postcss",
    version: "8.5.6",
    dev: true,
  },
  autoprefixer: {
    name: "autoprefixer",
    version: "10.5.0",
    dev: true,
  },
  tailwindcss4: {
    name: "tailwindcss",
    version: "4.3.0",
    dev: true,
  },
  tailwindcss4Vite: {
    name: "@tailwindcss/vite",
    version: "4.3.0",
    dev: true,
  },
  typebox: {
    name: "typebox",
    version: "1.0.7",
    dev: false,
  },
  arktype: {
    name: "arktype",
    version: "2.1.21",
    dev: false,
  },
  jsonSchemaTyped: {
    name: "json-schema-typed",
    version: "8.0.0",
    dev: true,
  },
  svelteExmarkdown: {
    name: "svelte-exmarkdown",
    version: "5.0.2",
    dev: false,
  },
} as const satisfies Record<string, AbstractPackage>;

export type ExtraPackage = keyof typeof EXTRA_PACKAGES;

const OPTIONAL_PKG = {
  skeletonSvelte: "@skeletonlabs/skeleton-svelte",
  internationalizedDate: "@internationalized/date",
  standardSchemaSpec: "@standard-schema/spec",
  cally: "cally",
  pikaday: "pikaday",
  fontsourceVariableInter: "@fontsource-variable/inter",
  tailwindcssAnimate: "tailwindcss-animate",
  twAnimateCss: "tw-animate-css",
};

export type OptionalPackage = keyof typeof OPTIONAL_PKG;

const DEV_PACKAGES_REGISTRY = new Set([
  "esm-env",
  "@tailwindcss/forms",
  "flowbite",
  "@picocss/pico",
  "@fontsource-variable/inter",
  "tw-animate-css",
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

type Version = [number, number, number];

function createVersion(versionStr: string) {
  const t = versionStr.split(".").map(Number);
  if (t.length !== 3 || t.some(isNaN)) {
    throw new Error(`Unexpected version format: "${versionStr}"`);
  }
  return t as Version;
}

const VERSION_MODIFIERS = ["^", "~", "<=", "<"] as const;
function formatPeerDependencyVersion(version: string) {
  let str = version.replace("workspace:", "").split(" ").at(-1)!.trim();
  const m = VERSION_MODIFIERS.find((m) => str.startsWith(m));
  if (m) {
    str = str.slice(m.length);
  }
  const ver = createVersion(str);
  if (m === "<") {
    ver[ver[0] === 0 ? 1 : 0]--;
  }
  return ver.join(".");
}

function createMetaExtractor(peerDependenciesMeta: PeerDependenciesMeta) {
  return (name: string) => Boolean(peerDependenciesMeta[name]?.optional);
}

export type IncludeOptional = boolean | Iterable<string>;

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
