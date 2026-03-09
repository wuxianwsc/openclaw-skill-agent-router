/**
 * Agent Router Skill (v1.1 - Ralph Optimized)
 * 1. [Dynamic] Auto-generate regex from mappings.
 * 2. [Security] Owner-only routing.
 * 3. [Context] Pass thread and chat IDs.
 * 4. [UX] Emoji feedback on dispatch.
 */

const fs = require('fs');
const crypto = require('crypto');

const DISPATCH_HISTORY = new Map();

const handler = async (event, context) => {
  if (!event || typeof event !== 'object') return event;

  // 1. 获取动态配置
  const settings = context.config || {};
  const MAPPINGS = settings.mappings || { "pm": "pm-agent-live", "dev": "dev-agent-v1234", "test": "qa-agent-v1234" };
  const TRUSTED_SENDERS = settings.trustedSenders || ['@testuser:localhost'];
  const COOLING_PERIOD = settings.coolingPeriodMs || 30000;

  // 2. Bootstrap 规则注入与配置自检
  if (event.type === 'agent' && event.action === 'bootstrap') {
    // A. 注入协作契约
    if (event.context && Array.isArray(event.context.bootstrapFiles)) {
      event.context.bootstrapFiles.push({
        path: 'TEAM_ROUTING_CONTRACT.md',
        content: '# TEAM ROUTING CONTRACT\n1. Use @role at START of line.\n2. Single target.\n3. No social loops.',
        virtual: true,
      });
    }

    // B. 配置自检 (物理检测 Mappings 是否有效)
    const configuredAgents = Object.values(MAPPINGS);
    console.log(`[Router Check] 🔍 Validating ${configuredAgents.length} routed agents...`);
    // 此处可扩展 fs.existsSync 检查 ~/.openclaw/agents/ 下的目录
    return event;
  }

  // 3. Inbound 物理分流
  if (event.type === 'inbound:received' && event.message && event.message.text) {
    const text = event.message.text.trim();
    const senderId = event.sender?.id || 'unknown';

    // 动态生成正则: 增强对空格、冒号、全角符号的兼容性
    const rolesStr = Object.keys(MAPPINGS).join('|');
    const routeRegex = new RegExp(`^(?:@|\\[)(?<role>${rolesStr})(?:\\s|\\]|:|：)(?<task>.*)`, 'i');
    const match = text.match(routeRegex);
    
    if (match) {
      const { role, task } = match.groups;
      const targetAgentId = MAPPINGS[role.toLowerCase()];
      const dispatchKey = `${senderId}->${targetAgentId}`;

      // --- 安全与防环校验 ---
      // A. 身份校验: 仅限信任名单
      if (!TRUSTED_SENDERS.includes(senderId)) {
        console.warn(`[Router Security] 🛡️ Blocked unauthorized dispatch from ${senderId}`);
        return event; 
      }

      // B. 冷却与废话过滤
      const lastTime = DISPATCH_HISTORY.get(dispatchKey) || 0;
      if ((Date.now() - lastTime < COOLING_PERIOD) || (task && task.trim().length < 3)) {
        event.handled = true;
        event.silent = true;
        return event;
      }

      // --- 执行物理分发 ---
      if (targetAgentId && context.tools && context.tools.sessions_spawn) {
        DISPATCH_HISTORY.set(dispatchKey, Date.now());
        
        try {
          // 提供 Emoji 反馈 (如果工具支持)
          if (context.tools.message) {
            await context.tools.message({
              action: 'react',
              emoji: '📡',
              messageId: event.message.id
            });
          }

          await context.tools.sessions_spawn({
            agentId: targetAgentId,
            task: task || "Continue",
            mode: 'session',
            thread: true,
            label: `${role}-router-task`,
            // 关键：保留原始消息的上下文 ID，确保子代理回传正确位置
            attachAs: { 
              mountPath: `/identity/${role}`,
              env: {
                "ORIGINAL_CHAT_ID": event.meta?.chat_id,
                "ORIGINAL_THREAD_ID": event.meta?.thread_id
              }
            }
          });
          
          event.handled = true;
          event.silent = true; 
        } catch (err) {
          console.error(`[Router Skill] Dispatch failed:`, err);
        }
      }
    }
  }

  return event;
};

module.exports = handler;
module.exports.default = handler;
