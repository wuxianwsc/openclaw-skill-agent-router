# 📡 Matrix Agent Router

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![OpenClaw](https://img.shields.io/badge/OpenClaw-2026.3%2B-blue)](https://openclaw.ai)
[![Version](https://img.shields.io/badge/version-1.2.0-green)]()

> **Enterprise-grade routing daemon for OpenClaw multi-agent collaboration.**  
> Physical intercept · Anti-loop protection · Identity retention

---

## 🌟 What Is This?

**Agent Router** transforms your Matrix channel into a high-performance multi-agent orchestration hub. Instead of agents talking in chaos, you now have a **physical routing layer** that intercepts `@dev`, `@pm`, `@test` mentions and dispatches them to the right agent—before the message even hits the LLM.

**Why physical?** Because Prompt-based routing is unreliable. Code-level intercept is **instant, deterministic, and loop-proof**.

---

## ✨ Features

- 🚀 **Physical Layer Routing**: Regex-based intercept before LLM processing
- 🛡️ **Anti-Loop Protection**: 30s cooling period + depth limit to prevent agent ping-pong
- 🎭 **Identity Retention**: Sub-agents reply with their own Matrix accounts (preserves team feel)
- ⚙️ **Dynamic Configuration**: Define role mappings in `config.yaml` (no code edits needed)
- 📡 **Real-time Feedback**: Emoji confirmation (📡) when tasks are dispatched
- 🔒 **Access Control**: Whitelist-based security (only trusted senders can route)

---

## 🚀 Quick Start

### 1. Install

```bash
git clone https://github.com/wuxianwsc/openclaw-skill-agent-router.git \
  ~/.openclaw/workspace/skills/agent-router
```

### 2. Configure

Add to `~/.openclaw/config.yaml`:

```yaml
skills:
  agent-router:
    settings:
      mappings:
        pm: "pm-agent-live"
        dev: "dev-agent-v1234"
        test: "qa-agent-v1234"
      trustedSenders: ["@your_matrix_id:localhost"]
      coolingPeriodMs: 30000
```

### 3. Restart & Verify

```bash
openclaw gateway restart
tail -f ~/.openclaw/workspace/ROUTER_ACTIVE.log
```

### 4. Use It

In your Matrix channel:

```
@dev Check current Git branch
@pm Summarize the discussion
@test Run integration tests
```

✅ You'll see a 📡 emoji appear under your message—task dispatched!

---

## 📋 Core Contract

For orderly collaboration, follow the **"Start-of-Line Rule"**:

✅ **Valid routing**:  
`@dev Deploy code`  
(Command at the start triggers the router)

❌ **Regular chat**:  
`I just asked @dev about it`  
(Mention in the middle is ignored—treated as normal conversation)

---

## 🛠️ Configuration Reference

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `mappings` | Object | See example | Role → Agent ID mapping |
| `trustedSenders` | Array | `[]` | Matrix IDs allowed to route tasks |
| `coolingPeriodMs` | Number | `30000` | Anti-spam cooldown (ms) |
| `maxDepth` | Number | `2` | Max routing nesting depth |

---

## 🔒 Security

**Why `trustedSenders`?**  
Without it, any Matrix user could dispatch tasks to your agents (privilege escalation risk). The whitelist ensures only you (or your team) can orchestrate agents.

**How to find your Matrix ID?**  
Run `/whoami` in your Matrix client, or check `~/.openclaw/logs/gateway.log`.

---

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

MIT © 2026 OpenClaw Team

---

## 🙏 Credits

Built with ❤️ by Boss & Alpha  
Powered by [OpenClaw](https://openclaw.ai)
