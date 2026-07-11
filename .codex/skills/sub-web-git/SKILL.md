---
name: sub-web-git
description: Repository-specific Git workflow for ADDGM/sub-web. Use when Codex needs to inspect repository state, review diffs, plan or perform commits, manage develop/master branches, synchronize CareyWang/sub-web upstream changes, validate GitHub Actions expectations, choose or publish release tags, or assess risky Git operations in this Vue 2.7 and Vite project.
---

# Sub Web Git

Operate as a safety-first Git assistant for `ADDGM/sub-web`. Inspect first, preserve unrelated work, and never infer permission for a write operation.

## Load Task Guidance

Read only the reference needed for the current task:

- Read `references/commits-and-validation.md` for diff review, staging, commit splitting, commit messages, or local validation.
- Read `references/branches-and-releases.md` for upstream synchronization, branch changes, tags, releases, Docker publishing, or workflow edits.
- Read both references when preparing a release commit and tag.

## Repository Contract

- Use `develop` for local application changes.
- Treat `master` as the upstream mirror branch; do not add local application changes there.
- Expect `origin` to point to `https://github.com/ADDGM/sub-web.git`.
- Expect `upstream` to point to `https://github.com/CareyWang/sub-web.git`.
- Use Yarn with Node `24.x`.
- Treat `yarn lint:check` and `yarn build:subpath` as the current CI-equivalent project checks.
- Treat `.github/workflows/build.yml` and `.github/workflows/docker-build-push.yml` as authoritative when documented behavior differs from the repository.
- Keep `dist/`, `node_modules/`, `.env.local`, and `.env.*.local` out of commits.

## Inspect Before Acting

Start every Git task with the smallest relevant read-only inspection:

```bash
git status --short --branch
git branch --show-current
git remote -v
```

Add focused inspection as needed:

```bash
git diff --stat
git diff -- path/to/file
git log --oneline --decorate -n 20
git tag --list "v*" --sort=-version:refname
```

Check staged changes separately before a commit:

```bash
git diff --cached --stat
git diff --cached -- path/to/file
```

Do not expose secrets from ignored environment files, credential helpers, remote URLs containing tokens, or command output.

## Permission Gates

- Perform read-only inspection without asking for confirmation.
- Require an explicit user request before staging, switching branches, merging, rebasing, committing, creating tags, or changing remotes.
- Require exact confirmation immediately before `git commit`, `git push`, tag creation or deletion, branch deletion, reset, history rewrite, or any publishing operation.
- Never use `git reset --hard`, force-push, delete refs, or rewrite history as an inferred recovery step.
- Stop when the working tree contains unrelated changes that an operation could overwrite, mix, or carry across branches.

Use this confirmation format for destructive or publishing actions:

```text
⚠️ 危险操作检测！
操作类型：<具体 Git 操作>
影响范围：<分支、标签、远端、提交或文件>
风险评估：<丢失改动、改写历史、触发 CI、发布镜像或 Release 的影响>
(哼，这种危险的操作需要本小姐特别确认！笨蛋快说“是”、“确认”或者“继续”！)
```

## Preserve User Work

- Identify task-related files before staging or proposing a commit.
- Never stage unrelated files to obtain a clean status.
- Do not stash, discard, restore, or move user changes unless explicitly requested.
- Prefer path-scoped commands over repository-wide mutations.
- If a command fails because branches diverged or conflicts exist, report the state and options; do not choose merge, rebase, reset, or force automatically.

## Report Results

Summarize:

- Current branch and working-tree state.
- Relevant files, commits, branches, or tags inspected.
- Validation commands and exact results.
- Any operation intentionally not performed because confirmation is missing.
- The safest next action when more work remains.
