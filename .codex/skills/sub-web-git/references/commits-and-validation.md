# Commits And Validation

## Review Changes

Inspect before proposing a commit:

```bash
git status --short --branch
git diff --stat
git diff -- path/to/file
git diff --cached --stat
git diff --cached -- path/to/file
git log --oneline -n 20
```

Identify which files implement the requested change. Keep unrelated changes unstaged and mention them explicitly.

## Split Commits

Split independent concerns when they can be reviewed or reverted separately, especially:

- Application code under `src/`.
- GitHub Actions or release automation.
- Dependencies and lockfiles.
- Configuration or environment defaults.
- Documentation or skill-only changes.

Keep files together when they are required for one behavior and share the same validation evidence.

## Write Commit Messages

Follow recent repository history instead of imposing a generic convention:

- Default to a concise Chinese verb-object title.
- Describe the observable change, not the editing activity.
- Avoid vague titles such as `更新代码`, `修复问题`, or `调整逻辑`.
- Preserve established technical terms such as `Docker`, `Release`, `CI`, and `Git` when clearer than translation.
- Add a body only when the reason, migration impact, release impact, or validation result is not obvious from the title.

Examples matching the repository style:

```text
完善项目Git工作流
修复子路径构建产物
更新订阅配置源
优化Docker发布稳定性
```

Before committing, report:

```text
准备提交：
- 文件：<exact staged paths>
- 提交信息：<exact title and optional body>
- 变更范围：<what is intentionally included>
- 未包含：<unrelated working-tree changes, if any>
- 验证：<commands and results>
```

Run `git diff --cached` after staging and before requesting final commit confirmation.

## Choose Validation

Match validation to the changed files:

- Skill-only or documentation-only changes: run the skill validator or another focused format check; do not run the application build without a reason.
- `src/`, `public/`, build scripts, or Vite configuration: run `yarn lint` and `yarn build:subpath`.
- `.github/workflows/build.yml`: inspect the full YAML and shell blocks, then run `yarn lint` and `yarn build:subpath` when project build behavior is affected.
- `.github/workflows/docker-build-push.yml`: inspect the full YAML, tag parsing, Docker tags, release assets, and shell blocks; run `yarn lint` and `yarn build:subpath` when release assets or build behavior is affected.
- `package.json` or `yarn.lock`: run `yarn install --frozen-lockfile` when dependency integrity changed, followed by `yarn lint` and `yarn build:subpath`.

`yarn lint` is the read-only validation command. Use a separate explicit ESLint command with `--fix` only when intentionally repairing formatting.

## Current CI Baseline

Treat the checked-in workflows as authoritative. At the time this skill was updated:

- `.github/workflows/build.yml` runs on pushes and pull requests targeting `develop`.
- CI installs with `yarn install --frozen-lockfile`.
- CI runs `yarn lint` and `yarn build:subpath`.
- GitHub Actions remains the final authority for workflow behavior that cannot be reproduced locally.
