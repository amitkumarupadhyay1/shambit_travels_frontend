# Railway Frontend Deployment Guide

## Prerequisites
- Your backend is already deployed on Railway at: `https://shambit.up.railway.app`
- Your frontend code is pushed to GitHub
- You have a Railway account

## Step-by-Step Deployment

### 1. Create New Railway Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your frontend repository
5. Select the `frontend/shambit-frontend` folder as the root directory

### 2. Configure Build Settings
Railway should auto-detect Next.js with Nixpacks (since we removed Dockerfile):
- **Root Directory**: `frontend/shambit-frontend`
- **Build Command**: `npm run build:railway` (installs all deps then builds)
- **Start Command**: `npm start`
- **Install Command**: `npm ci`

**Important**: The project now uses Nixpacks instead of Docker to properly handle TypeScript dependencies. The Dockerfile has been renamed to Dockerfile.backup.

### 3. Set Environment Variables
In Railway project settings, add these environment variables:

```bash
# REQUIRED - Update with your actual backend URL
NEXT_PUBLIC_API_URL=https://shambit.up.railway.app/api

# REQUIRED - Update after deployment with your frontend URL
NEXT_PUBLIC_APP_URL=https://your-frontend-app.up.railway.app

# App Configuration
NEXT_PUBLIC_APP_NAME=ShamBit
NEXT_PUBLIC_SUPPORT_EMAIL=support@shambit.com
NEXT_PUBLIC_WHATSAPP_NUMBER=919005457111

# Social Media
NEXT_PUBLIC_FACEBOOK_URL=https://fb.com/shambitofficial
NEXT_PUBLIC_INSTAGRAM_URL=https://instagram.com/shambitofficial

# Production Settings
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### 4. Deploy
1. Click "Deploy" in Railway
2. Wait for the build to complete
3. Note your Railway frontend URL (something like `https://shambit-frontend.up.railway.app`)

### 5. Update Backend CORS (IMPORTANT!)
After getting your frontend URL, update the backend CORS settings:

1. Go to your backend Railway project
2. Update the environment variable or redeploy with the new frontend URL in CORS_ALLOWED_ORIGINS
3. The backend production.py already includes: `https://shambit-frontend.up.railway.app`
4. If your actual URL is different, update it in the backend settings

### 6. Update Frontend Environment Variables
1. Go back to your frontend Railway project
2. Update `NEXT_PUBLIC_APP_URL` with your actual frontend URL
3. Redeploy the frontend

### 7. Test the Deployment
1. Visit your frontend URL
2. Check browser console for any CORS errors
3. Test API calls to ensure backend connectivity
4. Verify all features work as expected

## Troubleshooting

### CORS Issues
- Ensure your frontend URL is added to backend CORS_ALLOWED_ORIGINS
- Check that both HTTP and HTTPS versions are allowed if needed
- Verify the backend is redeployed after CORS changes

### Build Issues
- Check Railway build logs for specific errors
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### API Connection Issues
- Verify NEXT_PUBLIC_API_URL is correct
- Check network tab in browser dev tools
- Ensure backend is running and accessible

## Files Created/Modified
- `railway.json` - Railway deployment configuration
- `.env.railway` - Environment variables template
- `next.config.ts` - Updated with standalone output and Railway image domains
- `backend/backend/settings/production.py` - Updated CORS settings

## Next Steps
After successful deployment:
1. Set up custom domain (optional)
2. Configure monitoring and alerts
3. Set up staging environment if needed
4. Update CI/CD pipeline to include frontend deployment