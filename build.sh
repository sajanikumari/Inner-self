#!/bin/bash
# Build script for deployment platforms

echo "🔨 Building InnerSelf Backend..."

# Navigate to server directory
cd server

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Build completed successfully!"
