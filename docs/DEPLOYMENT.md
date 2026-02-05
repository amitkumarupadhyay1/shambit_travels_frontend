# Deployment Guide

This document outlines the CI/CD pipeline and deployment process for ShamBit Frontend.

## Overview

The project uses GitHub Actions for automated CI/CD with the following workflow:

- **Quality Checks**: TypeScript, ESLint, and backend connectivity tests
- **Build**: Application build and artifact creation
- **Deploy**: Automated deployment to staging and production
- **Monitoring**: Performance audits and security scans

## Environments

### Staging
- **Branch**: `develop`
- **URL**: Auto-generated Vercel preview URL
- **Purpose**: Testing and validation before production

### Production
- **Branch**: `main`
- **URL**: Your production domain
- **Purpose**: Live application for users

## Required Secrets

Configure these secrets in your GitHub repository settings:

### Vercel Deployment
```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### Environment Variables
```
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_APP_NAME=ShamBit
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_SUPPORT_EMAIL=support@shambit.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919005457111
```

### Optional (for enhanced features)
```
SNYK_TOKEN=your_snyk_token (for security scanning)
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token (for performance audits)
```

## Deployment Process

### Automatic Deployment

1. **Push to `develop`**: Triggers staging deployment
2. **Push to `main`**: Triggers production deployment
3. **Pull Request**: Runs quality checks and security scans

### Manual Deployment

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production
```

## Docker Deployment

### Build Docker Image
```bash
npm run docker:build
```

### Run Docker Container
```bash
npm run docker:run
```

### Production Docker Deployment
```bash
# Build for production
docker build -t shambit-frontend .

# Run with environment variables
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com/api \
  -e NEXT_PUBLIC_APP_URL=https://your-domain.com \
  shambit-frontend
```

## Health Checks

After deployment, run health checks to verify everything is working:

```bash
npm run health-check
```

This will test:
- Homepage accessibility
- API connectivity
- Critical page functionality

## Performance Monitoring

### Lighthouse Audits
- Automatically run on every push to main
- Performance, accessibility, SEO, and best practices
- Results uploaded as GitHub artifacts

### Metrics Tracked
- **Performance**: Page load times, Core Web Vitals
- **Accessibility**: WCAG compliance
- **SEO**: Search engine optimization
- **Best Practices**: Security headers, HTTPS usage

## Rollback Process

### Vercel Rollback
1. Go to Vercel dashboard
2. Select your project
3. Choose previous deployment
4. Click "Promote to Production"

### Git Rollback
```bash
# Revert to previous commit
git revert HEAD

# Push to trigger new deployment
git push origin main
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check TypeScript errors: `npm run type-check`
   - Check linting errors: `npm run lint`
   - Verify environment variables are set

2. **Deployment Failures**
   - Verify Vercel tokens are correct
   - Check build logs in GitHub Actions
   - Ensure all required secrets are configured

3. **Runtime Errors**
   - Check API connectivity: `npm run test-backend`
   - Verify environment variables in deployment platform
   - Run health checks: `npm run health-check`

### Debug Commands

```bash
# Check build locally
npm run build

# Test production build locally
npm run start

# Verify all quality checks
npm run type-check && npm run lint
```

## Security

### Automated Security Scanning
- npm audit on every build
- Snyk security scanning on pull requests
- Dependency updates via automated PRs

### Security Headers
Configured in `vercel.json`:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy

## Monitoring and Alerts

### GitHub Actions Notifications
- Build failures notify via GitHub
- Deployment status updates
- Security scan results

### Recommended Monitoring
- Set up Vercel deployment notifications
- Configure Slack/Discord webhooks for critical alerts
- Monitor Core Web Vitals in production

## Best Practices

1. **Always test in staging first**
2. **Use feature branches for development**
3. **Keep dependencies updated**
4. **Monitor performance metrics**
5. **Review security scan results**
6. **Test rollback procedures regularly**

## Support

For deployment issues:
- Check GitHub Actions logs
- Review Vercel deployment logs
- Contact: support@shambit.com