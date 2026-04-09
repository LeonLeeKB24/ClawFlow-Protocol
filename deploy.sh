#!/bin/bash

# ClawFlow Protocol Deployment Script
# This script prepares and deploys the ClawFlow Protocol to Railway

set -e

echo "🚀 Starting ClawFlow Protocol deployment..."

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found!"
    exit 1
fi

if [ ! -f "index.js" ]; then
    echo "❌ index.js not found!"
    exit 1
fi

if [ ! -f "database.sql" ]; then
    echo "❌ database.sql not found!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Copy environment file
if [ ! -f ".env" ]; then
    echo "📋 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration before deployment"
fi

# Create Railway configuration
echo "🚂 Creating Railway configuration..."
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
      "JWT_SECRET": "\$JWT_SECRET"
    }
  }
}
EOF

echo "✅ Railway configuration created"

# Create deployment instructions
cat > DEPLOY_INSTRUCTIONS.md << EOF
# ClawFlow Protocol Deployment Instructions

## Prerequisites
- Railway account
- Railway CLI installed
- Database (Supabase or Railway PostgreSQL)

## Deployment Steps

1. **Login to Railway**
   \`\`\`bash
   railway login
   \`\`\`

2. **Create Railway Project**
   \`\`\`bash
   railway init --name clawflow-protocol
   \`\`\`

3. **Set Environment Variables**
   \`\`\`bash
   railway variables set DATABASE_URL "your_database_url"
   railway variables set JWT_SECRET "your_jwt_secret"
   railway variables set NODE_ENV "production"
   \`\`\`

4. **Deploy**
   \`\`\`bash
   railway up
   \`\`\`

5. **Set Custom Domain**
   - Go to Railway dashboard
   - Add domain: clawflow-ai.xyz
   - Configure DNS accordingly

## Database Setup
1. Create PostgreSQL database on Railway or Supabase
2. Run database.sql script to create tables
3. Update DATABASE_URL with your database connection string

## Post-Deployment
1. Test API endpoints
2. Monitor logs
3. Set up domain binding
4. Configure SSL certificates
EOF

echo "📝 Deployment instructions created"
echo "✅ Deployment preparation completed!"
echo ""
echo "Next steps:"
echo "1. Review and update .env file"
echo "2. Run railway init to create project"
echo "3. Set environment variables"
echo "4. Deploy with railway up"
echo "5. Configure domain binding"