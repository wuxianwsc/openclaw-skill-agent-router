---
name: agent-router
description: Enterprise-grade Matrix multi-agent routing daemon with physical intercept and anti-loop protection.
homepage: https://github.com/wuxianwsc/openclaw-skill-agent-router
metadata: {"openclaw":{"emoji":"📡","category":"automation","requires":{"config":["matrix"]}}}
---

# 📡 Matrix Agent Router

让您的 Matrix 机器人拥有"一呼百应"的团队协作能力。

## 📖 3步极速上手

### 1. 安装
将 `agent-router` 文件夹放入 `~/.openclaw/workspace/skills/` 目录。

### 2. 配置
在 `~/.openclaw/config.yaml` 中添加以下内容（根据您的 Agent ID 修改）：

```yaml
skills:
  agent-router:
    settings:
      mappings:
        pm: "pm-agent-live"
        dev: "dev-agent-v1234"
        test: "qa-agent-v1234"
      trustedSenders: ["@your_id:localhost"] # 填入您的 Matrix ID
```

### 3. 使用
在 Matrix 房间里，直接像指挥官一样下令：
*   `@dev 帮我检查当前 Git 分支`
*   `@pm 整理一下刚才的讨论要点`

---

## 💡 核心契约 (必看)
为了让团队有序工作，请遵循 **"句首指令"** 原则：
- ✅ **有效路由**：`@dev 部署代码` (指令在句首)
- ❌ **普通聊天**：`我刚才问了 @dev，他说没问题` (指令在句中，不触发路由)

## 🛡️ 智能保护
- **防刷屏**：同一个角色在 30 秒内只能被同一人调度一次（除非是 Boss）。
- **即时反馈**：当指令被成功受理时，消息下方会出现 📡 图标。
