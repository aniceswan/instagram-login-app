#!/bin/bash

echo "🚀 Login Page - Quick Start Setup"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✓ Node.js version: $(node --version)"
echo "✓ npm version: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install
npm install --workspace=frontend
npm install --workspace=backend

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please update .env with your MongoDB URI and JWT_SECRET"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "1. Update .env with your MongoDB connection string"
echo "2. Run 'npm run dev' to start development servers"
echo "3. Visit http://localhost:3000 for frontend"
echo "4. Visit http://localhost:5000 for backend API"
echo ""
echo "📖 For deployment instructions, see DEPLOYMENT.md"
