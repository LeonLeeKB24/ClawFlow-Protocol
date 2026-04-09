#!/bin/bash

# CFP Protocol Railway 部署脚本
# 部署ClawFlow Protocol到Railway平台

set -e

echo "🚀 开始部署 ClawFlow Protocol 到 Railway..."

# 检查必要文件
if [ ! -f "package.json" ]; then
    echo "❌ package.json 文件不存在！"
    exit 1
fi

if [ ! -f "index.js" ]; then
    echo "❌ index.js 文件不存在！"
    exit 1
fi

# 安装依赖
echo "📦 安装 Node.js 依赖..."
npm install

# 检查依赖安装
if [ ! -d "node_modules" ]; then
    echo "❌ 依赖安装失败！"
    exit 1
fi

# 创建 Railway 配置文件
echo "🚂 创建 Railway 配置..."
cat > railway.json << EOF
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install",
    "startCommand": "npm start"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health",
    "env": {
      "NODE_ENV": "production",
      "DATABASE_URL": "\$DATABASE_URL",
      "JWT_SECRET": "\$JWT_SECRET",
      "PORT": "\$PORT"
    }
  }
}
EOF

echo "✅ Railway 配置文件已创建"

# 创建环境变量文件
if [ ! -f ".env" ]; then
    echo "📋 创建环境变量文件..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件设置正确的数据库连接字符串"
fi

# 运行测试（如果有测试文件）
if [ -f "package.json" ] && grep -q "test" package.json; then
    echo "🧪 运行测试..."
    npm test || {
        echo "❌ 测试失败！"
        exit 1
    }
fi

echo "✅ 所有检查通过，准备部署"

# 显示部署说明
echo ""
echo "📝 部署说明："
echo "1. 确保已安装 Railway CLI：npm install -g @railway/cli"
echo "2. 登录 Railway：railway login"
echo "3. 初始化项目：railway init --name clawflow-protocol"
echo "4. 部署：railway up"
echo "5. 设置环境变量：railway variables set DATABASE_URL 'your_database_url'"
echo ""

echo "🚀 部署准备完成！"
echo "🎯 下一步：运行 'railway init' 开始部署流程"