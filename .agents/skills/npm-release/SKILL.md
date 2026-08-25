---
name: npm-release
description: Use when explicitly asked to release this repository's accumulated functional, architectural, bug-fix, or compatibility changes to npm, especially after EOTP or repeated 2FA prompts.
---

# NPM Release

Release `v3-ol-map` only after the source commit is safely pushed. Explicit `$npm-release` invocation authorizes the version edit, Git commit/push, and `npm publish`.

## Persistent Authentication

Require a package-scoped npm **Granular Access Token** with read/write permission and **Bypass two-factor authentication** enabled. `npm whoami` alone does not prove that the token can bypass 2FA.

Before changing the version, run `bash .agents/skills/npm-release/scripts/configure-auth.sh --check`. If it fails, stop and give the user these one-time steps:

1. Open npm **Access Tokens**, generate a granular token, restrict it to `v3-ol-map`, grant read/write access, enable **Bypass two-factor authentication**, and choose an expiry.
2. Run `bash .agents/skills/npm-release/scripts/configure-auth.sh` in the repository. The helper accepts the token with hidden input and stores it only in the user's npm configuration. Never ask the user to paste it into chat and never place it in the repository.

Token creation and package policy changes remain interactive npm account actions. If the package disallows tokens, report that non-interactive local publishing is unavailable.

If the current or immediately preceding release attempt returned `EOTP`, ignore a successful `--check`: stop before version edits or publication and require the helper to be rerun with a newly created token whose Bypass 2FA setting was explicitly enabled.

## Preconditions

1. Read `AGENTS.md`, `package.json`, Git status/diffs, branch, upstream, and remote. Stop for conflicts, detached HEAD, missing upstream, unrelated or ambiguous changes, suspected secrets, or credential fields in a tracked/staged `.npmrc`.
2. Read package name/version without printing npm configuration. Use the persistent-authentication check above. Do not use `npm login` as the durable solution or print, create, or commit credentials.
3. Get the published version with `npm view <name> version`. Stop if the local version is lower. If local is higher, allow only a clean-worktree retry whose HEAD is already pushed and whose exact version is not published.
4. For a normal release, require package-affecting changes. Documentation-only or generated-output-only changes do not justify a release.

## Choose the Version

Inspect all tracked and untracked changes and choose the highest applicable SemVer level:

| Level | Use when |
| --- | --- |
| `major` | A public export, component, prop, event, method, parameter, return value, or default behavior becomes incompatible. |
| `minor` | A backward-compatible public capability is added. |
| `patch` | A bug, compatibility issue, typing, dependency, performance, or internal architecture is improved without breaking public behavior. |

State the chosen level and concrete reason. When local equals the registry version, run `npm version <level> --no-git-tag-version`. For a verified retry, keep the existing local version.

## Verify, Commit, Publish

Run in order and stop on the first failure:

1. `nvm use`
2. `pnpm test`
3. `pnpm exec eslint "src/**/*.{ts,vue}"`
4. `pnpm build:lib`
5. `npm pack --dry-run`
6. **REQUIRED SUB-SKILL:** Read and follow the installed `commit` skill to commit all intended changes and push the current branch.
7. Confirm the worktree is clean and HEAD is present on its upstream.
8. Run `npm publish` exactly once, without `--otp`; npm automatically uses the locally configured granular token.
9. Verify with `npm view <name>@<version> version`.

Do not tag, amend, force-push, unpublish, automatically retry publication, or roll back user changes. Do not request, read, generate, or store a TOTP code. If publication returns `EOTP`, report that the active token either lacks Bypass 2FA or the package disallows tokens; preserve the pushed version for a later verified retry.

## Report

Return the version decision, validation results, commit hash/branch, published package/version, and any remaining manual action. Never include npm identity, token, or `.npmrc` contents.
