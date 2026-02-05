#!/bin/bash

# Deployment script for ShamBit Frontend
set -e

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if environment is provided
if [ -z "$1" ]; then
    print_error "Environment not specified. Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENVIRONMENT=$1

# Validate environment
if [ "$ENVIRONMENT" != "staging" ] && [ "$ENVIRONMENT" != "production" ]; then
    print_error "Invalid environment. Use 'staging' or 'production'"
    exit 1
fi

print_status "Deploying to $ENVIRONMENT environment..."

# Check if required tools are installed
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run quality checks
print_status "Running quality checks..."
npm run type-check
npm run lint

# Build the application
print_status "Building application..."
npm run build

# Deploy based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    print_status "Deploying to staging..."
    # Add staging deployment commands here
    # Example: vercel --env staging
elif [ "$ENVIRONMENT" = "production" ]; then
    print_status "Deploying to production..."
    # Add production deployment commands here
    # Example: vercel --prod
fi

print_status "✅ Deployment to $ENVIRONMENT completed successfully!"

# Optional: Run post-deployment tests
print_status "Running post-deployment checks..."
# Add health checks here

echo ""
print_status "🎉 Deployment process completed!"
print_status "Environment: $ENVIRONMENT"
print_status "Timestamp: $(date)"