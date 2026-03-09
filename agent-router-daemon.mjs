/**
 * Agent Router Daemon (v1.0)
 * 物理层拦截与分发逻辑
 */

import fs from 'fs';
import path from 'path';

// 路由表与配置
const configPath = path.join(process.cwd(), 'router-config.json');
let config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

export const handler = async (event, context) => {
  if (!event || event.type !== 'inbound:received') return event;

  const { message, meta } = event;
  if (!message || !message.text) return event;

  const text = message.text.trim();
  
  // 1. 正则匹配：支持 @role 或 [role]
  const match = text.match(/^\[(?<role>pm|dev|qa|test)\]\s+(?<task>.*)/i) || 
                text.match(/^@(?<role>pm|dev|qa|test)\s+(?<task>.*)/i);
  
  if (match) {
    const { role, task } = match.groups;
    const targetAgentId = config.mappings[role.toLowerCase()];
    
    if (targetAgentId) {
      console.log(`[Router Daemon] 🎯 匹配到角色: ${role}, 路由至: ${targetAgentId}`);

      try {
        // 2. 物理转发：调用 sessions_spawn 发起后台子任务
        if (context.tools && context.tools.sessions_spawn) {
          await context.tools.sessions_spawn({
            agentId: targetAgentId,
            task: task,
            mode: 'session',
            thread: true,
            label: `router-${role}-task`
          });

          // 3. 拦截主代理响应：标记事件为 Handled，防止 Alpha 重复回复
          event.handled = true;
          event.silent = true; 
          console.log(`[Router Daemon] ✅ 路由任务已成功下发。已拦截主代理。`);
        }
      } catch (err) {
        console.error(`[Router Daemon] ❌ 路由下发失败:`, err);
      }
    }
  }

  return event;
};

export default handler;
