# AGENTS.md

## 核心原则

1. **语言**：所有交流、思考、注释及文档均使用**中文**。代码（变量名、函数名）、文件名除外。
2. **三思而后行**：
   - 编码前，先理解需求，评估影响范围。
   - 删除或修改代码前，必须确认其用途及依赖，避免破坏现有功能。
3. **共情与预判**：主动理解我的深层需求，预测可能的后续问题，提前给出建议或备选方案。

## 技术栈

- **运行时**: Node.js
- **主要语言**: JavaScript / TypeScript
- **包管理**: npm / yarn / pnpm
- **框架**: Astro（如适用）

## 开发规范

### 通用
- 遵循 ESLint 和 Prettier 通用标准配置。
- 优先使用 `async/await`，避免回调地狱。
- 捕获所有异步操作的异常，提供用户友好的错误信息。
- 保持函数单一职责，模块划分清晰。

### Astro 项目特定
- **启动开发服务器**：使用后台模式 `astro dev --background`
- **服务器管理**：`astro dev stop`（停止）、`astro dev status`（状态）、`astro dev logs`（日志）
- **路由**：动态路由和中间件参考 [Routing Guide](https://docs.astro.build/en/guides/routing/)
- **组件**：Astro 组件语法参考 [Astro Components](https://docs.astro.build/en/basics/astro-components/)
- **框架集成**：React/Vue/Svelte 等参考 [Framework Components](https://docs.astro.build/en/guides/framework-components/)
- **内容管理**：内容集合参考 [Content Collections](https://docs.astro.build/en/guides/content-collections/)
- **样式**：Tailwind 等参考 [Styling Guide](https://docs.astro.build/en/guides/styling/)
- **多语言**：i18n 参考 [Internationalization](https://docs.astro.build/en/guides/internationalization/)

## 工作流程

1. **理解**：收到任务后，先复述需求，确认理解无误。
2. **方案**：提供 1-2 种实现方案，推荐最优解并说明理由。
3. **实现**：编写代码，添加必要的中文注释。
4. **验证**：逻辑自检，确保代码健壮性；涉及 Astro 项目时，确认服务器运行正常。
5. **交付**：输出最终代码，附上简短的修改说明。

## 注意事项

- 遇到不确定的操作，先提问再执行。
- 涉及删除操作，务必二次确认。
- 涉及 Astro 配置变更，建议先备份或查看官方文档确认。