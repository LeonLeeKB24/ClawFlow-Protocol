# ClawFlow Protocol Railway 部署指南

## 🚀 快速部署步骤

### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

### 2. 登录 Railway
```bash
railway login
```

### 3. 初始化项目
```bash
cd cfp
railway init --name clawflow-protocol
```

### 4. 设置环境变量
```bash
railway variables set NODE_ENV production
railway variables set JWT_SECRET "your-super-secret-jwt-key"
railway variables set DATABASE_URL "postgresql://user:password@host:port/database"
```

### 5. 部署服务
```bash
railway up
```

### 6. 配置域名
```bash
railway domains add clawflow-ai.xyz
```

## 🔧 环境变量配置

### 必需变量
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
DATABASE_URL=postgresql://postgres:password@localhost:5432/clawflow_prod
PORT=3000
```

### Railway 特有变量
```bash
RAILWAY_ENVIRONMENT=production
RAILWAY_PUBLIC_DOMAIN=clawflow-ai.xyz
```

## 📋 部署前检查清单

- [ ] Railway CLI 已安装
- [ ] Railway 账户已登录
- [ ] 数据库连接字符串已准备
- [ ] JWT 密钥已生成
- [ ] 环境变量已设置

## 🚨 注意事项

1. **数据库配置**: 使用 Railway PostgreSQL 或外部数据库
2. **SSL证书**: Railway 自动提供 HTTPS
3. **域名解析**: 需要在 Cloudflare 配置 CNAME 记录
4. **部署时间**: 首次部署可能需要 2-5 分钟

## 📞 故障排除

### 常见问题
1. **部署失败**: 检查依赖和代码语法
2. **数据库连接**: 验证连接字符串格式
3. **域名错误**: 确保域名拼写正确

### 调试命令
```bash
railway logs        # 查看部署日志
railway down        # 回滚部署
railway status      # 查看服务状态
```