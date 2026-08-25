# Repository Guidelines

## 项目结构与模块组织

核心组件位于 `src/packages/`：地图、图层、控件和交互按功能分目录，公共类型集中在 `src/packages/types/`，统一从 `src/packages/index.ts` 导出。`src/examples/` 是本地演示，`src/stories/` 存放 Storybook stories 与 MDX 文档；新增或调整公开组件时同步更新对应示例或 story。VitePress 文档位于 `docs/`，静态数据位于 `public/`。`dist/`、`lib/`、`es/` 和 `storybook-static/` 均为生成产物，不要手工修改。

## 构建、测试与开发命令

先执行 `nvm use` 切换到 `.nvmrc` 指定的 Node 20，再运行 `pnpm install`。

- `pnpm dev`：在 `localhost:8989` 启动 Vite 示例站点。
- `pnpm build`：构建生产示例到 `dist/`。
- `pnpm build:lib`：执行 `vue-tsc`，并生成库文件及类型声明。
- `pnpm docs:dev` / `pnpm docs:build`：开发或构建 VitePress 文档。
- `pnpm storybook` / `pnpm build-storybook`：启动或静态构建组件文档。
- `pnpm exec eslint "src/**/*.{ts,vue}"`：检查源码。当前 `pnpm lint`、`pnpm fix` 仍引用不存在的 `./packages`，修正脚本前不要依赖它们。

## 编码风格与命名约定

使用 Vue 3 `<script setup lang="ts">`、TypeScript 严格模式和 2 空格缩进。Prettier 配置要求双引号、120 字符行宽，并省略单参数箭头函数括号。组件名使用 `OlMap`、`OlTile` 形式；组件目录使用小写功能名，公开类型文件使用 PascalCase（如 `types/Tile.ts`），story 命名为 `OlMap.stories.ts`。优先复用 OpenLayers 原生 API，并在两个入口文件中维护公开导出。

## 测试指南

仓库目前没有 `test` 脚本、覆盖率门槛或完整测试框架。提交前至少运行源码 ESLint 和 `pnpm build:lib`。交互或视觉变更应在 Storybook 中验证相关 story；文档变更运行 `pnpm docs:build`。在 PR 中明确记录手工验证的浏览器、示例路径和结果。

## 提交与 Pull Request 指南

近期提交主要采用 `feat(scope): ...`、`fix(scope): ...`、`refactor(scope): ...` 和 `chore(scope): ...`；主题保持简短并说明行为变化。PR 应说明受影响的组件、兼容性风险和验证命令，关联对应 issue；地图渲染、控件或文档 UI 变化需附前后截图。不要提交环境密钥、部署凭据或本地生成产物；`pnpm ssh-deploy` 仅用于获授权的发布流程。
