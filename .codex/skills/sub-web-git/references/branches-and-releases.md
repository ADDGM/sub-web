# Branches And Releases

## Synchronize Upstream

Keep `master` as an upstream mirror and merge it into `develop` for local development.

Inspect first:

```bash
git status --short --branch
git remote -v
git branch -vv
```

After explicit user approval, use the safe sequence:

```bash
git fetch upstream
git fetch origin
git switch master
git merge --ff-only upstream/master
git switch develop
git merge master
```

Stop if the working tree is dirty and branch switching could affect those changes. If the fast-forward fails, report divergence; do not rebase, reset, force-push, or create a merge on `master` automatically.

Do not push `master` or `develop` unless the user explicitly requests the exact remote and branch.

## Prepare Release Tags

Use these accepted formats:

- Stable: `vX.Y.Z`
- Release candidate: `vX.Y.Z-rc.N`

Before recommending a tag:

```bash
git status --short --branch
git branch --show-current
git fetch --tags origin
git tag --list "v*" --sort=-version:refname
Select-String -Path "package.json" -Pattern '"version"'
yarn lint:check
yarn build:subpath
```

Apply these rules:

- Prepare releases from `develop` unless the user explicitly defines another source.
- Keep `package.json` `version` aligned with the tag's `X.Y.Z` core, including RC tags.
- Never reuse an existing local or remote tag.
- Increment RC numbers for the same target version.
- Choose stable version increments according to SemVer and the actual change scope; do not assume every release is a patch.
- Confirm the tag points to the intended commit before creation and again before push.

## Understand Publishing Impact

Treat `.github/workflows/docker-build-push.yml` as authoritative:

- Pushing `vX.Y.Z-rc.N` publishes only versioned Docker Hub and GHCR tags and creates or updates a GitHub prerelease; it does not update `latest`.
- Pushing `vX.Y.Z` also publishes Docker Hub and GHCR `latest` tags and creates or updates the latest GitHub Release.
- Releases build multi-architecture images for `linux/amd64` and `linux/arm64`.
- Releases attach the subpath build archive and SHA256 checksum file.
- Manual dispatch expects a valid release tag and is suitable for rerunning or repairing publication; do not treat it as permission to invent or move a tag.
- Docker Hub requires `DOCKER_IMAGE`, `DOCKERHUB_USERNAME`, and `DOCKERHUB_PASSWORD`; GHCR uses `GITHUB_TOKEN` with `packages: write`.

Before tag creation or push, state the exact tag, target commit, remote, and whether `latest` will change. Then use the dangerous-operation confirmation template from `SKILL.md`.

## Review Workflow Changes

For `.github/workflows/` changes:

- Read the entire affected workflow before editing.
- Preserve triggers, permissions, secret names, variable names, image tags, asset names, and checksum behavior unless the user requests a change.
- Check YAML indentation and embedded Bash independently.
- Verify action version changes against their official repositories when current-version accuracy matters.
- Explain which behavior can only be verified by GitHub Actions.

Do not create or move a release tag merely to test a workflow without explicit publishing approval.
