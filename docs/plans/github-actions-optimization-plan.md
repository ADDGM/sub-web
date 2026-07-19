# sub-web GitHub Actions 优化方案与决策留档

> 文档性质：实施、评估与取舍留档，不再作为未经核对即可执行的任务清单  
> 评估日期：2026-07-16  
> 适用分支：`develop` 及从 `develop` 创建的版本 Tag  
> 分支约束：`master` 仅用于同步上游，不运行自定义构建  
> 当前版本源：`package.json`  
> 权威说明：第 0 节记录当前结论；第 1–12 节保留为历史设计依据，冲突时以第 0 节和实际 Workflow 为准

## 0. 2026-07-16 评估与决策记录

### 0.1 总体结论

当前工作流规模与项目相称：前端 CI 保持单平台检查，Release 使用一个发布 Job 完成双架构镜像和静态资产发布，再由独立通知 Job 汇总结果。现阶段没有必要引入多平台前端矩阵、分架构 Manifest 编排或更多跨 Job 资产传递。

应优先保留的能力是：Tag/源码版本一致性、CI 与 Release concurrency、最小权限、发布 Digest 校验、产物缺失失败、可直接使用的校验文件、actionlint 和独立通知。完成这些后，继续堆叠 Workflow 结构的边际收益已经较低；下一项真正重要的质量建设是为纯函数增加单元测试并纳入 CI。

### 0.2 评估依据

- 当前分支为 `develop`，基线提交为 `37114a2`，同时是 `v0.1.6-rc.1`。
- `d592f33` 完成 Telegram 通知拆分；`efc6788` 完成权限、并发、版本门禁和 Workflow Lint；`b872024` 完成镜像 Digest 与发布可追溯性；`8d7c19c` 完成 Docker 缓存稳定性优化。
- [Build #29428044894](https://github.com/ADDGM/sub-web/actions/runs/29428044894) 在 `37114a2` 上成功。
- [Release #29429460030](https://github.com/ADDGM/sub-web/actions/runs/29429460030) 通过 `v0.1.6-rc.1` Tag 成功：主发布 Job 用时 2 分 24 秒，其中 Docker 构建与推送约 1 分 43 秒；通知 Job 成功。
- [Workflow Lint #29410946917](https://github.com/ADDGM/sub-web/actions/runs/29410946917) 在 `8d7c19c` 上成功。
- 2026-07-16 查询 actionlint 官方 Release，`v1.7.12` 仍为最新稳定版；当前版本与 SHA256 固定方式无需调整。

### 0.3 已完成基线与验证范围

下表记录已经落地的基线能力。只有 0.2 明确列出运行链接和路径的事项可视为已在线验证；其余事项表示代码已实现并通过审查，不能据此推断稳定版、故意失败、并发冲突或重复发布等所有分支都已在线覆盖。

| 能力 | 必要性 | 状态与结论 |
| --- | --- | --- |
| CI 只监听 `develop`，支持手动触发并取消同 Ref 旧运行 | 高 | 已完成；符合 `master` 仅同步上游的分支策略 |
| `yarn install --frozen-lockfile`、`yarn lint`、`yarn test`、`yarn build:subpath` | 高 | 已完成；是当前 CI 的基础质量门禁 |
| Tag 核心版本与 `package.json` 一致性校验 | 高 | 已实现；RC 匹配路径已验证，故意不匹配路径未在线验证 |
| CI/Release concurrency | 高 | 已实现；配置符合预期，同 Ref 取消和同 Tag 并发冲突未专门在线制造验证 |
| 顶层只读、发布 Job 写权限、通知 Job 空权限 | 高 | 已完成；当前单发布 Job 下已达到合理边界 |
| 双仓库、双架构发布及 Manifest Digest 一致性校验 | 高 | 已完成并由 RC 验证；应保留 |
| RC 不更新 `latest`，稳定版更新 `latest` | 高 | 已实现；RC 路径已验证，当前版本的稳定版路径尚未验证 |
| Release 可重跑、覆盖同名资产并记录提交、运行和 Digest | 高 | 已实现；提交、运行和 Digest 已验证，当前版本的重复发布路径尚未验证 |
| Telegram 独立汇总、Secrets 预检查、失败不影响主流程 | 中 | 已完成；结构清晰，无需继续拆分 |
| Dockerfile 依赖层缓存与 `$BUILDPLATFORM` 构建 | 高 | 已完成；发布耗时已恢复到数分钟级 |
| 固定 Scope、有限超时和容错的 GHA Docker 缓存 | 高 | 已完成；此前缓存问题曾导致 20 分钟级失败，不应回退 |
| 专用 actionlint Workflow | 高 | 已完成并在线通过；不安装前端依赖、不重复构建 |

当前版本规则明确为：

- `v0.1.6` 对应 `package.json` 的 `0.1.6`。
- `v0.1.6-rc.1` 同样对应 `package.json` 的核心版本 `0.1.6`，版本字段不包含 `-rc.1`。

### 0.4 当前工作区已实现、待提交后在线验证

以下内容已经出现在 2026-07-16 的工作区差异中，但不应在提交和 GitHub Actions 成功前记为“线上完成”：

| 事项 | 必要性 | 评估结论 | 验收要求 |
| --- | --- | --- | --- |
| `upload-artifact` 增加 `if-no-files-found: error` | 高 | 应保留；防止 `dist/` 路径回归时 CI 假成功 | 正常 Build 上传成功；不存在路径时步骤失败 |
| 在 `release-assets` 内生成 `checksums.txt` | 高 | 应保留；下载两个资产到同一目录后应可直接校验 | `sha256sum -c checksums.txt` 直接通过 |
| 手动发布描述强调 Existing Tag，并禁止版本数字前导零 | 中 | 应保留；减少误操作并统一 SemVer 输入 | 接受正常稳定版/RC，拒绝前导零和其他预发布类型 |
| `AGENTS.md` 同步构建、发布和版本规则 | 高 | 应保留；避免文档再次指导错误命令或触发条件 | 与三个实际 Workflow 逐项一致 |
| Workflow Lint 从 10 分钟收紧到 5 分钟 | 低 | 合理；历史运行约十秒，5 分钟仍有充足余量 | 线上运行无超时 |
| Workflow Lint 移除 `paths` 过滤 | 中 | 建议保留；检查耗时极低，并可为每次 Push/PR 稳定报告 required check | Build 与 Workflow Lint 在普通提交上都能报告状态 |
| 删除基于 Python 字符串扫描的策略断言 | 中 | 建议按“已废弃”处理；详见 0.6 | actionlint 通过，关键政策继续由 Workflow、`AGENTS.md` 和评审核对 |

### 0.5 后续事项优先级

| 事项 | 优先级 | 必要性判断 | 决策 |
| --- | --- | --- | --- |
| 为 URL 构建、解析、校验、格式化和存储 TTL 增加单元测试 | 已实施 | 高；补齐原 CI 最大缺口 | Vitest 4.0.18、48 个纯函数测试已本地通过并接入 Build，待提交后在线验证 |
| 第三方 Action 固定到 Commit SHA，并配置 Dependabot/Renovate | P1 | 中；提升供应链可控性，但增加维护成本 | 保留评估，建议“固定 SHA + 自动更新”成对实施 |
| 自动生成用户可读的提交/PR 变更记录 | P2 | 中低；当前 Release Notes 已满足发布追溯 | 延后，先设计重跑时不重复、不覆盖元数据的规则 |
| 进一步拆分 `resolve-release`、镜像发布和 GitHub Release Job | P2 | 低；当前发布仅数分钟，拆分会增加 Artifact 和权限编排 | 暂缓，只有发布复杂度或审计要求明显上升时再做 |
| 增加 `X.Y.Z`、`X.Y` 或 `vX.Y` Docker 别名 | P2 | 低；现有用户已有精确 `vX.Y.Z` 和 `latest` | 暂不实施；只有出现明确订阅 Minor 更新需求时再扩展公开契约 |
| SBOM、Provenance、Cosign 签名 | P2 | 条件性；取决于镜像分发范围和可信发布要求 | 保留评估，不作为当前小型前端项目的常规门禁 |
| 把 Tag/渠道解析抽成脚本 | P2 | 当前无必要 | 仅当预发布类型或标签渠道继续增长时重启 |

### 0.6 已废弃或明确不采用

| 项目 | 决策 | 原因 |
| --- | --- | --- |
| Workflow Lint 中基于 `split`、正则和字符串位置的 Python 策略检查 | 废弃 | 它不解析 YAML 语义，紧耦合 Job 名称和文本顺序，易产生误报/漏报；对当前三个小型 Workflow 的维护成本高于收益 |
| RC 要求 `package.json` 写成完整 `0.1.6-rc.1` | 废弃 | 当前版本源使用核心 SemVer；RC 序号属于发布渠道而非包版本 |
| 仅在 `.github/workflows/**` 变化时运行 Workflow Lint | 废弃 | 若将其设为 required check，路径跳过会造成状态不稳定；当前 actionlint 运行成本很低 |
| Linux 386、ARMv7、macOS、Windows 前端构建矩阵 | 不采用 | 本项目发布静态前端与 linux/amd64、linux/arm64 容器，无对应交付物 |
| 按架构拆分构建、上传 Digest、再合并 Manifest 的多 Job 流程 | 不采用 | 当前单次双架构构建已足够快，复杂编排没有实际收益 |
| 让 `master` 运行自定义 CI | 不采用 | 与上游镜像分支职责冲突 |
| 自动创建、移动、复用发布 Tag | 不采用 | 会削弱发布不可变性；手动触发只允许使用现有 Tag |
| 回退 Action 主版本或移除 Docker 缓存超时/容错 | 不采用 | 会损害 Node 24 兼容性或重新引入已发生的缓存阻塞问题 |

废弃自定义策略脚本不等于放弃关键政策。当前明确接受 actionlint 不覆盖仓库治理政策的残余风险，以下不变量改由 Workflow 修改评审核对：所有 Job 有超时、CI 顶层只读、发布写权限只授予发布 Job、Release 不监听普通分支、通知 Job 使用 `always()`/空权限/容错、Docker 缓存保留 Scope 与超时、构建产物缺失必须失败。若未来这些政策成为强制审计要求，应改用真正的 YAML 解析器或仓库规则测试，不恢复字符串扫描脚本。

### 0.7 当前批次完成标准

1. 对工作区中的三个 Workflow 运行 actionlint。
2. 运行 `yarn lint`、`yarn test` 与 `yarn build:subpath`。
3. 验证 Tag 正则接受 `v0.1.6`、`v1.0.0`、`v0.1.6-rc.1`，拒绝无 `v`、前导零、`rc.01` 和 `beta`。
4. 验证 `checksums.txt` 只记录资产文件名，并能在同目录直接校验。
5. 提交后观察 Build 与 Workflow Lint；发布相关改动使用递增 RC Tag 验证，不复用或移动 `v0.1.6-rc.1`。
6. 验证成功后，将 0.4 对应事项更新为“已完成并经线上验证”，并记录运行链接和目标提交。

### 0.8 本地验证记录

2026-07-16 已对当前工作区完成以下验证：

- actionlint `1.7.12` 通过；Windows amd64 工具归档先按官方校验文件验证 SHA256，归档哈希为 `6e7241b51e6817ea6a047693d8e6fed13b31819c9a0dd6c5a726e1592d22f6e9`。
- `yarn lint` 与 `yarn test` 通过。
- `yarn build:subpath` 通过，Vite 成功构建并将产物移动到 `dist/sub-web/`。
- 使用 Git for Windows Bash 复现 Workflow 的 Tag 正则：三个接受样例和六个拒绝样例均符合预期。
- 在临时目录按 Workflow 方式生成压缩包与 `checksums.txt`，`sha256sum -c checksums.txt` 直接通过，校验文件只记录 `sub-web-v0.1.6-rc.2-dist.tar.gz`，不含目录前缀。
- Vitest `4.0.18` 共 6 个测试文件、50 个测试全部通过，覆盖 URL 构建/解析往返、TTL 边界与损坏缓存、CRLF、校验器、格式化和搜索；解析测试同时覆盖重复导入时清理旧表单值，以及多条虚假订阅链接的回车/`|`转换。
- Build Workflow 已加入 `yarn test`，顺序为安装、Lint、单元测试、构建；该 CI 改动待提交后在线验证。
- Vitest `4.1.10` 虽支持 Vite 8，但触发 Yarn 1 已知链接错误；当前固定 `4.0.18` 以保持 Yarn 1 安装稳定。测试仅使用 Node 环境，生产构建仍由项目现有 Vite 8 执行。升级包管理器后再评估 Vitest 4.1+。

上述结果证明当前差异可进入提交评审，但不能替代 GitHub Hosted Runner 和真实 RC 发布。当前未执行提交、推送、Tag 或发布操作。

## 1. 历史方案：目标（以下内容已失效，不可直接执行）

在保持 `sub-web` 前端流水线简洁、快速的基础上，提高版本一致性、并发控制、权限隔离、通知可靠性和发布可恢复性。

本项目不需要照搬 `subconverter` 的八平台矩阵和分离式 Manifest 编排；应借鉴的是它已经具备的强门禁、独立通知、并发策略、最小权限和稳定版/Beta 语义管理。

## 2. 当前基线

### CI

- 实际 YAML 仅监听 `develop` 的 Push、Pull Request，并支持手动触发。
- Ubuntu 单 Job。
- Node.js 24。
- 执行依赖安装、`yarn lint`、`yarn test`、`yarn build:subpath`。
- 上传单一 `dist/` Artifact，保留 7 天。

### Release

- 由 `v*` Tag 或手动输入 Tag 触发。
- 支持 `vX.Y.Z` 和 `vX.Y.Z-rc.N`。
- 一次 Buildx 构建同时推送 Docker Hub 与 GHCR。
- 支持 linux/amd64、linux/arm64。
- 已使用 GHA Docker 缓存。
- 稳定版更新完整版本标签和 `latest`；RC 不更新 `latest`。
- 生成 dist 压缩包、`checksums.txt` 和 GitHub Release。
- 已存在 Release 时更新说明并覆盖同名资产。
- Telegram 作为发布 Job 的最后一步执行。

## 3. 已发现的不一致

1. `AGENTS.md` 描述 `build.yml` 监听 `master/develop`，但实际 YAML 只监听 `develop`。实际行为符合当前分支策略，文档需要修正。
2. `AGENTS.md` 要求 Tag 与 `package.json` 版本一致，但工作流尚未进行机器校验。
3. CI/Release 缺少明确的 concurrency 策略。
4. Telegram 通知没有像 `subconverter` 那样先检查 Secrets，也没有独立汇总 Job。
5. Docker 标签保留 `v`，与 `subconverter` 的无 `v` 容器标签不同。这不是错误，但两个项目应明确各自规范，避免使用者误解。

## 4. 核心判断

`sub-web` 是 Vue 2.7 + Vite 8 的静态前端，工作流本质是“单平台前端质量检查 + 多架构容器发布”。保持线性、快速比引入复杂矩阵更重要。

真正值得从 `subconverter` 借鉴的是：

1. Tag 与源码版本文件的硬性一致性校验。
2. CI 自动取消旧运行，Release 禁止自动取消。
3. CI 最小权限，Release 按 Job 精确授权。
4. Telegram Secrets 预检查与独立汇总。
5. 更明确的稳定版/预发布版 Docker 标签规则。

## 5. 优化优先级

### P0：优先实施

#### 5.1 强制校验 Tag 与 `package.json` 版本

**涉及文件**：`.github/workflows/docker-build-push.yml`

**规则**：

- `v0.1.6` 必须对应 `package.json` 的 `0.1.6`。
- `v0.1.6-rc.1` 必须对应 `package.json` 的 `0.1.6-rc.1`。
- 手动触发也必须 Checkout 目标 Tag 后再读取版本，不能读取默认分支的 `package.json`。
- 不一致时在构建和推送镜像前失败。

**借鉴来源**：`subconverter` 的 Tag 与 `src/version.h` 一致性门禁。

**收益**：避免镜像/Release Tag 与前端内声明版本不一致。

**验收**：至少覆盖稳定版匹配、RC 匹配、稳定版不匹配、RC 不匹配四种样例。

#### 5.2 增加 CI concurrency

**涉及文件**：`.github/workflows/build.yml`

**建议**：按 Workflow + Ref 分组，`cancel-in-progress: true`。

**收益**：同一分支连续 Push 时只保留最新 CI，减少无效 Runner 消耗。

**注意**：Pull Request 与 Push 的 Group 应避免意外互相取消，可把事件类型或 PR 编号纳入 Group。

#### 5.3 增加 Release concurrency

**涉及文件**：`.github/workflows/docker-build-push.yml`

**建议**：按 Release Workflow + Tag 分组，`cancel-in-progress: false`。

**收益**：防止同一 Tag 的并行手动触发互相覆盖 Release 资产或 Manifest，同时避免正在发布的流程被新运行自动取消。

#### 5.4 明确最小权限

**涉及文件**：两个 workflow。

**建议**：

- CI：顶层仅 `contents: read`。
- Release：默认只读；需要推 GHCR 的 Job 获得 `packages: write`，创建 Release 的 Job 获得 `contents: write`。
- 如果仍采用单 Job，应在顶层声明完成发布所需的最小集合；若后续拆 Job，则改为 Job 级授权。

**验收**：Fork PR 不获得写权限，Tag Release 仍可正常推送 GHCR 并创建 Release。

#### 5.5 修正文档与实际触发条件

**涉及文件**：`AGENTS.md`

将 CI 描述改为只监听 `develop`，明确 `master` 不执行自定义 CI。这是低风险但必要的治理项。

### P1：第二阶段实施

#### 5.6 独立 Telegram 汇总 Job

**涉及文件**：`.github/workflows/docker-build-push.yml`

**借鉴来源**：`subconverter`。

**建议结构**：

- 主发布 Job 只负责构建与发布。
- `notify` 使用 `if: always()` 并通过 `needs` 获取主 Job 状态。
- 仅当 `TELEGRAM_TO` 和 `TELEGRAM_TOKEN` 均存在时执行。
- `continue-on-error: true`，通知失败不改变发布结果。

**收益**：主 Job 在中间失败时仍可发送通知；缺少 Secrets 时不会产生误导性失败。

**注意**：单 Job 当前也能在多数失败情况下执行带 `always()` 的通知步骤，但独立 Job 的状态汇总和权限隔离更清晰。

#### 5.7 为关键 Job 设置超时

**涉及文件**：两个 workflow。

**建议**：

- CI：15–20 分钟。
- Docker/Release：30–60 分钟。
- 通知：5 分钟。

应根据实际历史耗时调整，避免因冷缓存导致误杀。

#### 5.8 增加次版本 Docker 标签

**涉及文件**：`.github/workflows/docker-build-push.yml`

**可选策略**：稳定版 `v0.1.6` 发布：

- `v0.1.6`
- `v0.1`
- `latest`

RC 仅发布：

- `v0.1.6-rc.1`

**借鉴来源**：`subconverter` 的 `X.Y` 标签。

**决策提示**：如果使用者通常只订阅 `latest` 或精确版本，次版本标签收益有限，可暂缓。若希望自动获得同一 minor 下的补丁更新，则建议加入。

#### 5.9 增加工作流静态检查

**建议新增文件**：`.github/workflows/workflow-lint.yml`，或加入 CI。

**检查内容**：

- actionlint。
- Release Tag 正则与版本解析样例。
- Docker 标签输出样例。
- Shell 脚本语法检查。

#### 5.10 改善依赖安装与 Docker 缓存层

**涉及文件**：

- `Dockerfile`
- 可能涉及 `yarn.lock`

**现状**：Dockerfile 先 `COPY . .` 再安装依赖，任意源码变化都可能使依赖安装层失效。

**建议结构**：

1. 先复制 `package.json`、`yarn.lock`。
2. 执行 `yarn install --frozen-lockfile`。
3. 再复制剩余源码。
4. 执行 `yarn build:subpath`。

**收益**：即使已使用 GHA BuildKit Cache，也能获得更稳定、直观的 Docker Layer Cache。

**风险**：必须确认构建安装阶段不依赖仓库中的其他安装脚本文件；修改后需对比生成的 `dist/`。

### P2：长期优化

#### 5.11 增加前端测试门禁

当前没有自动化测试。建议从最稳定、最有业务价值的纯函数开始：

- URL 参数构建。
- URL 解析。
- 校验器。
- 格式化与存储 TTL 逻辑。

待测试框架稳定后，CI 顺序建议为：安装 → Lint → Unit Test → Build。

不要为了工作流“看起来完整”而一开始引入大规模组件测试。

#### 5.12 加强供应链安全

可选功能：

- 锁定关键第三方 Action 到 Commit SHA。
- Dependabot/Renovate 更新 Actions 和 npm 依赖。
- 容器 provenance、SBOM、Cosign 签名。
- Release Notes 增加镜像 Digest。

#### 5.13 将发布解析逻辑独立为可测试脚本

当 YAML 中 Tag 解析、Docker 标签和 Release 类型判断继续增长时，可抽成 `scripts/resolve-release.mjs`，由本地测试和 Actions 共用。

当前逻辑仍较小，不建议立即抽象；只有在加入次版本标签、更多预发布类型或渠道后再实施。

## 6. 建议实施阶段

### 阶段 A：版本与治理门禁

1. Tag/`package.json` 版本强校验。
2. CI 与 Release concurrency。
3. 最小权限。
4. 修正 `AGENTS.md` 的触发条件描述。
5. 添加超时。

**验证**：先在 `develop` CI 验证；Release 使用新的 RC Tag，不复用旧 Tag。

### 阶段 B：通知与可观测性

1. 拆分 Telegram 汇总 Job。
2. Secrets 缺失时明确跳过。
3. Job Summary 记录版本、Commit、Docker 标签、资产和 Release 链接。

### 阶段 C：性能与标签体验

1. 优化 Dockerfile 缓存层。
2. 评估并决定是否增加 `vX.Y` 标签。
3. 对比冷缓存、热缓存构建耗时。

### 阶段 D：测试与供应链

1. 为纯函数增加单元测试。
2. CI 增加测试门禁。
3. 锁定关键 Action，并评估 SBOM/签名。

## 7. 文件级改造地图

| 文件 | 规划改动 | 优先级 |
| --- | --- | --- |
| `.github/workflows/build.yml` | concurrency、权限、超时、可选工作流检查 | P0/P1 |
| `.github/workflows/docker-build-push.yml` | 版本门禁、Release concurrency、通知拆分、标签策略 | P0/P1 |
| `Dockerfile` | 依赖清单优先复制，优化缓存层 | P1 |
| `AGENTS.md` | 修正 CI 触发条件与发布规则说明 | P0 |
| `package.json` | 后续增加测试脚本；版本继续作为发布源 | P2 |
| `.github/dependabot.yml` | Actions/npm 更新策略 | P2 |
| `.github/workflows/workflow-lint.yml` | actionlint 与发布解析检查 | P1 |

## 8. 明确不做

- 不让自定义 CI 监听 `master`。
- 不把前端构建扩展为无意义的 OS/架构矩阵。
- 不为 `dist/` 分拆多个平台资产。
- 不在 RC 发布时更新 `latest` 或次版本标签。
- 不自动把 `master` 合并到 `develop`。
- 不自动生成或移动 Git Tag。
- 不因为 `subconverter` 使用无 `v` Docker 标签，就强制本项目立即改变已有标签习惯。

## 9. Docker 标签规范建议

本项目已有 Docker 标签保留 `v` 的历史。建议短期保持：

- 稳定版：`vX.Y.Z`、可选 `vX.Y`、`latest`。
- RC：仅 `vX.Y.Z-rc.N`。

原因：避免对现有用户造成不必要的拉取路径变化。若未来希望与 `subconverter` 统一为无 `v`，应经过独立迁移期，同时发布有 `v` 和无 `v` 两套别名，再逐步弃用旧格式；当前没有必要实施。

## 10. 风险与回滚

### 风险控制

- 版本校验必须放在 Docker 登录、构建、推送之前。
- concurrency Group 必须包含 Tag，避免不同版本互相阻塞。
- 通知 Job 不获得 `packages: write` 或 `contents: write`。
- Dockerfile 缓存层改造后需比较 `dist/` 内容和 Nginx 运行结果。

### 回滚方式

- CI 治理项失败：回退对应 Workflow 提交。
- RC 发布失败：修复后创建递增 RC Tag；不要移动已推送 Tag。
- 正式版发布错误：发布新的补丁版本，不覆盖已有版本源码。
- Docker 标签策略变更引发兼容问题：保留旧标签别名并在后续版本迁移。

## 11. 完成标准

- `develop` Push 与 PR CI 正常，旧运行可自动取消。
- `master` 不触发自定义 CI。
- Tag 与 `package.json` 不一致时，在任何镜像推送前失败。
- 同一 Tag 不会并发执行两个发布流程。
- CI 使用只读权限，发布权限最小化。
- Telegram 缺少 Secrets 时明确跳过，通知失败不影响 Release。
- 稳定版与 RC 的 `latest` 语义没有回归。
- Dockerfile 改造后热缓存耗时下降，最终静态资源一致。
- GitHub Release 重跑后资产不重复，校验文件正确。

## 12. 推荐执行顺序

先实施 **阶段 A**，因为版本一致性门禁和并发控制是成本低、收益高的改动。随后做通知拆分与 Dockerfile 缓存层优化。次版本标签、测试体系和供应链签名应根据实际使用需求逐步引入，避免把简单的前端发布流水线过度工程化。
