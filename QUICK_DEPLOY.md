# 立即可执行的 CFP 部署方案

由于 Railway CLI 在当前环境不可用，这里提供几种快速部署方案：

## 🚀 方案一: 使用 Railway Web 界面 (推荐)

### 步骤 1: 创建 Railway 项目
1. 访问: https://railway.app
2. 点击 "New Project"
3. 选择 "Deploy from GitHub Repository"
4. 连接 GitHub 仓库 (如果已推送)
5. 或选择 "Deploy from Dockerfile"

### 步骤 2: 配置服务
1. 在项目设置中添加服务
2. 选择 "Node.js" 模板
3. 指向 CFP 目录: `/cfp`
4. 设置构建命令: `npm install`
5. 设置启动命令: `npm start`

### 步骤 3: 设置环境变量
```
NODE_ENV=production
JWT_SECRET=your-super-secret-key
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=3000
```

### 步骤 4: 配置域名
1. 进入 "Domains" 设置
2. 添加自定义域名: `clawflow-ai.xyz`
3. 等待 DNS 生效

## 🐳 方案二: 使用 Docker 部署

### 创建 Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### 部署命令
```bash
# 构建 Docker 镜像
docker build -t clawflow-protocol .

# 运行容器
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -e DATABASE_URL=your-db-url \
  clawflow-protocol
```

## 📦 方案三: 使用 Vercel/Heroku

### Vercel 部署
1. 安装 Vercel CLI: `npm i -g vercel`
2. 运行: `vercel`
3. 配置环境变量

### Heroku 部署
1. 安装 Heroku CLI
2. `heroku create`
3. `heroku config:set`
4. `git push heroku main`

## 🎯 立即行动计划

### 今天可以完成的步骤 (1小时内)
1. ✅ CFP 代码完成
2. ✅ 部署脚本准备
3. 🔄 Railway Web 界面部署
4. 🔄 域名配置更新

### 具体执行步骤
1. **访问 Railway Dashboard**: https://railway.app
2. **创建新项目**: 选择 "Deploy from GitHub"
3. **配置服务**: Node.js, build: `npm install`, start: `npm start`
4. **设置域名**: `clawflow-ai.xyz`
5. **测试连通性**: 验证 API 端点

## ⚠️ 注意事项

1. **数据库**: Railway 提供 PostgreSQL 数据库
2. **SSL证书**: Railway 自动提供 HTTPS
3. **域名**: 需要在 Cloudflare 配置 CNAME
4. **部署时间**: 通常 2-5 分钟完成

## 📞 支持

如有部署问题，可以:
1. 查看 Railway 部署日志
2. 检查环境变量配置
3. 验证数据库连接
4. 测试 API 端点连通性