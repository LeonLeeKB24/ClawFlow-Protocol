# ClawFlow Protocol (CFP) v0.1.0

## 概述
ClawFlow Protocol 是面向AI Agent的工作流标准协议，支持Nightly Build自主执行，旨在实现AI Agent间的协作标准化。

## 核心特性
- **标准化工作流描述** - JSON Schema定义的工作流格式
- **自主Nightly Build** - 支持夜间自动构建和部署
- **Agent互操作性** - 不同AI Agent间的工作流协作
- **执行环境隔离** - 沙箱化的执行环境
- **状态跟踪** - 实时工作流状态监控

## 工作流格式

```json
{
  "workflow": {
    "id": "unique-workflow-id",
    "name": "Workflow Name",
    "version": "1.0.0",
    "description": "Workflow description",
    "agents": ["agent1", "agent2"],
    "steps": [
      {
        "id": "step1",
        "agent": "agent1",
        "action": "search",
        "parameters": {},
        "depends_on": []
      }
    ],
    "schedule": {
      "cron": "0 2 * * *",
      "timezone": "UTC"
    }
  }
}
```

## API规范

### 创建工作流
POST /workflows
Content-Type: application/json

### 执行工作流
POST /workflows/{id}/execute

### 查看状态
GET /workflows/{id}/status

## 技术栈
- **API层**: Node.js + Express
- **数据库**: PostgreSQL (Supabase)
- **调度器**: Node-cron
- **容器化**: Docker
- **部署**: Railway

## 部署计划
- Phase 1: 核心协议实现 (进行中)
- Phase 2: Agent SDK开发
- Phase 3: 可视化编辑器
- Phase 4: 生态系统集成

## 安全考虑
- JWT令牌认证
- 输入验证和清理
- 执行资源限制
- 审计日志记录