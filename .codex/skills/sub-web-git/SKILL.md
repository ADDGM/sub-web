---
name: sub-web-git
description: Project-specific Git workflow for the sub-web repository. Use when Codex needs to inspect status, plan commits and commit messages, manage branches, sync upstream, prepare release tags, validate CI expectations, or advise on safe Git operations in this Vue 2.7 + Vite project.
---

# Sub Web Git

## Core Rules

Operate as a repository-aware Git assistant for `ADDGM/sub-web`.

- Keep ordinary development on `develop`.
- Treat `master` as the upstream mirror branch. Do not place local application changes there.
- Never commit, push, reset hard, delete branches, delete tags, or rewrite history unless the user explicitly asks and confirms the exact operation.
- Before any Git write operation, inspect `git status --short --branch` and protect unrelated user changes.
- Prefer read-only Git commands while investigating: `git status`, `git diff`, `git log`, `git branch`, `git tag`, `git remote`.
- Keep generated outputs such as `dist/`, `node_modules/`, `.env.local`, and `.env.*.local` out of commits.
- Do not create branches or commits just because code changed. Wait for an explicit request.

## Repository Facts

- Primary repo: `origin` should be `https://github.com/ADDGM/sub-web.git`.
- Upstream repo: `upstream` should be `https://github.com/CareyWang/sub-web.git`.
- Main development branch: `develop`.
- Upstream mirror branch: `master`.
- Runtime stack: Vue 2.7, Vite 8, Element UI 2, Node 24.x.
- Package manager: Yarn.
- CI validates with `yarn install --frozen-lockfile`, `yarn lint:check`, and `yarn build`.

## Status Checklist

Start Git tasks with:

```bash
git status --short --branch
git remote -v
git branch --show-current
```

When release context matters, also inspect:

```bash
git tag --list "v*" --sort=-version:refname
git log --oneline --decorate -n 20
```

Use `git diff --stat` before proposing commits. Use focused diffs for files that may be committed:

```bash
git diff -- path/to/file
```

## Branch Workflow

Use this default policy:

- Work on `develop` for local custom changes.
- Keep `master` aligned with upstream only.
- To sync upstream, fetch first, then update `master` from `upstream/master`, then merge `master` into `develop`.
- Do not perform the sync automatically unless the user asks for it.
- If the working tree is dirty, pause before branch switches or merges unless the dirty files are known and safely handled.
- If `git merge --ff-only upstream/master` fails on `master`, stop and report the divergence. Do not auto-merge, rebase, reset, or force-push.

A safe sync plan to propose:

```bash
git fetch upstream
git fetch origin
git switch master
git merge --ff-only upstream/master
git switch develop
git merge master
```

If `master` has local divergence, do not force it into shape without explicit confirmation.

## Commit Workflow

When the user asks for a commit:

1. Inspect status and diffs.
2. Identify which files belong to the requested change.
3. Do not stage unrelated files.
4. Decide whether the changes should be one commit or split commits.
5. Run validation appropriate to the change.
6. Draft a Chinese commit message using this project's format.
7. Before committing, state the exact files to be staged, the commit message, and the validation result.

Split commits when independent changes touch different concerns, especially:

- Workflow or release automation changes.
- Application source changes under `src/`.
- Remote config or environment default changes.
- Documentation or skill-only changes.
- Dependency or lockfile changes.

Keep changes together only when they are required to make one behavior work and can be validated together.

### Commit Message Rules

Use Chinese commit messages. Keep the first line concise and consistent with recent history.

- Summary: 20 Chinese characters or fewer; English words and numbers count by readable length; use a verb-object phrase; do not end with punctuation.
- Scope: choose one primary affected area. Use `工作流`, `配置`, `视图`, `发布`, `Docker`, `文档`, `依赖`, or `技能`.
- Details: explain what changed and why it was needed.
- Validation: record commands run and results, or explicitly state why validation was skipped.
- Avoid vague summaries such as `更新代码`, `修复问题`, or `调整逻辑`.
- Avoid including unrelated changes in one commit just to reuse the same message.

Default to a single-line commit title when the change is small:

```text
修复Docker发布工作流中的标签描述格式
完善自动发布流程
更新发布标签规范
```

Use a multi-line commit message when the change has multiple files, release impact, CI impact, or non-obvious reasoning:

```text
优化发布工作流说明

范围：发布

详情：
- 调整 Release 说明生成格式
- 保持 Docker Hub 与 GHCR 标签描述一致

验证：
- yarn lint:check 通过
- yarn build 通过
```

For `git commit`, prefer this shape:

```bash
git commit -m "优化发布工作流说明" -m "范围：发布" -m "详情：调整 Release 说明生成格式，并保持 Docker Hub 与 GHCR 标签描述一致。" -m "验证：yarn lint:check 通过；yarn build 通过。"
```

If validation was not run:

```text
验证：未运行，原因：仅更新文档/仅规划 Git 操作/环境缺少依赖。
```

Before running `git commit`, report this template to the user:

```text
准备提交：
- 文件：
- 概述：
- 范围：
- 详情：
- 验证：
```

### Validation Policy

Choose validation by changed files:

- Skill-only or documentation-only changes: inspect the affected files and run lightweight format checks when available.
- `src/` changes: run `yarn lint:check` and `yarn build`.
- `.github/workflows/` or release changes: read the full affected workflow, check YAML indentation and shell snippets, then run `yarn lint:check` and `yarn build` when the workflow builds project assets.
- `package.json` or lockfile changes: run `yarn install --frozen-lockfile` only when dependency integrity must be verified, then run `yarn lint:check` and `yarn build`.
- If validation cannot run, record the exact reason in the commit details or final report.

## Release Workflow

Release tags drive `.github/workflows/docker-build-push.yml`.

- Stable tag format: `vX.Y.Z`, for example `v0.1.4`.
- Release candidate format: `vX.Y.Z-rc.N`, for example `v0.1.4-rc.3`.
- Keep `package.json` `version` aligned with the stable tag without the `v` prefix.
- Before choosing a tag, fetch tags and inspect existing tags. Never reuse an existing local or remote tag.
- Stable tags must be greater than the latest stable `vX.Y.Z` tag.
- RC tags must target the intended stable version and increment `N` from the highest existing `vX.Y.Z-rc.N` for that version.
- If the latest stable tag is `v0.1.4`, the next stable tag should normally be `v0.1.5`, `v0.2.0`, or another explicitly justified SemVer increment.
- If existing RC tags include `v0.1.5-rc.1` and `v0.1.5-rc.2`, the next RC for that version must be `v0.1.5-rc.3`.
- Validate from `develop` with `yarn lint:check` and `yarn build` before creating release tags.
- RC tags publish only the exact tag and create prereleases.
- Stable tags also publish `latest` and create latest GitHub Releases.
- Docker Hub publishing requires repository variable `DOCKER_IMAGE` plus secrets `DOCKERHUB_USERNAME` and `DOCKERHUB_PASSWORD`.
- GHCR publishing uses `GITHUB_TOKEN` with `packages: write`.
- Before creating or pushing any release tag, restate the impact: `vX.Y.Z-rc.N` triggers Docker and GitHub prerelease without `latest`; `vX.Y.Z` triggers Docker `latest` and latest GitHub Release.

A release preparation sequence to propose:

```bash
git status --short --branch
git fetch --tags origin
Select-String -Path "package.json" -Pattern "\"version\""
yarn lint:check
yarn build
git tag --list "v*" --sort=-version:refname
```

Only create a tag after the user confirms the exact tag:

```bash
git tag vX.Y.Z-rc.N
git push origin vX.Y.Z-rc.N
```

or:

```bash
git tag vX.Y.Z
git push origin vX.Y.Z
```

## CI And Workflow Changes

For changes under `.github/workflows/`:

- Read the affected workflow fully before editing.
- Preserve existing trigger behavior unless the user asks to change it.
- Check shell snippets for YAML indentation and Bash syntax.
- Keep release asset names and checksum generation consistent.
- Avoid changing secret or variable names unless explicitly requested.
- Mention that GitHub Actions validation is ultimately remote.

Local validation cannot fully prove workflow behavior, but still run project validation when workflow changes affect build or release assets.

## Safety Responses

For destructive or publishing operations, require explicit confirmation with operation, scope, and risk:

```text
危险操作检测：
操作类型：git push/tag/delete/reset 等
影响范围：说明分支、标签、远端或文件范围
风险评估：说明是否会发布镜像、触发 Release、改写历史或丢失改动
```

If the user asks for a risky command ambiguously, ask for the exact branch, tag, remote, or commit hash before acting.

For tag operations, confirmation must include the exact tag and expected publish behavior:

```text
危险操作检测：
操作类型：创建/推送发布标签
影响范围：标签 vX.Y.Z 或 vX.Y.Z-rc.N，远端 origin
风险评估：vX.Y.Z 会触发 Docker latest 与 GitHub latest Release；vX.Y.Z-rc.N 只创建候选发布且不更新 latest
```
