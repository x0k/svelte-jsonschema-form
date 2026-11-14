# Release scripts

Helpers for publishing packages with npm trusted publishing (OIDC).

npm only allows a trusted publisher to be configured for a package that
already exists. A package added to this workspace cannot be published by the
release workflow until it has been bootstrapped once.

## Check registry prerequisites

```sh
pnpm release:check
pnpm release:check @sjsf/new-validator
pnpm release:check --json
```

Checks every publishable workspace package (or only the named packages) against
npm. Missing packages are reported with the bootstrap command to run.

The release workflow runs the check before the changesets action, so a missing
package blocks both the release PR and the publish run. The script is
dependency-free and can run before `pnpm install`.

## Bootstrap a new package

```sh
pnpm release:bootstrap @sjsf/new-validator
```

The script:

1. Verifies the package is a publishable workspace package.
2. Stages a throwaway `0.0.0-bootstrap` version under the `bootstrap` tag. This
   creates the package name without publishing a real version.
3. Configures the GitHub Actions trusted publisher for
   `version-and-publish.yaml`.
4. Prints the remaining release and cleanup steps.

Use `--dry-run` to print the commands without running them, or `--no-trust` to
only stage the package.

The first real release can then be published by the normal **Version and
Publish** workflow. Keep the bootstrap stage alive until that release succeeds;
rejecting the only staged version would remove the package and its trusted
publisher configuration.

### Authentication

`npm stage publish` needs an authenticated npm session but does not require
2FA. `npm trust github` prompts for 2FA and cannot be automated in CI. Run the
bootstrap command from a terminal where you are logged in as a package owner.

The script defaults to the repository and workflow file in
`.changeset/config.json` and `.github/workflows/version-and-publish.yaml`.

## Clean up after the first release

```sh
pnpm release:cleanup @sjsf/new-validator
```

After a real version is published, this rejects the staged
`0.0.0-bootstrap` entry. If the registry keeps the `0.0.0-stage` placeholder,
the script also removes that exact version. It refuses to clean up when no real
version exists, because rejecting the only staged version deletes the package.

Cleanup is destructive and asks for confirmation. Use `--yes` in a
non-interactive shell, or `--dry-run` to print the commands.

## Limitations

- The preflight only checks package existence. npm does not expose trusted
  publisher configuration without an authenticated 2FA request, so CI cannot
  verify that every package has a trusted publisher.
- `npm stage publish` and `npm trust` need registry write access. Fork PRs can
  run the preflight check, but only maintainers can bootstrap packages.
- The scripts use the registry from `npm_config_registry`, falling back to
  `https://registry.npmjs.org/`.
