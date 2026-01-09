# Vercel Production Deployment Guide

This guide ensures your Schweitzer PTA website is properly configured for production deployment on Vercel.

## Pre-Deployment Checklist

### 1. Environment Variables

Ensure the following environment variables are set in Vercel:

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

**Optional (if using):**
- `STRIPE_SECRET_KEY` - For Stripe payment processing
- `STRIPE_PUBLISHABLE_KEY` - For Stripe payment processing
- Any other API keys your application uses

**To set in Vercel:**
1. Go to your project → Settings → Environment Variables
2. Add each variable for Production, Preview, and Development environments
3. Redeploy after adding new variables

### 2. Build Configuration

The project is configured with:
- ✅ Optimized Next.js config for production
- ✅ Image optimization with AVIF and WebP support
- ✅ Console log removal in production (errors/warnings preserved)
- ✅ Proper Vercel function timeout settings
- ✅ Native dependency installation via postinstall script

### 3. Database Setup

Ensure your Supabase database is set up:
1. Run all migrations in `supabase/migrations/`
2. Run the schema from `supabase/schema.sql`
3. Verify RLS policies are in place
4. Create at least one admin user

### 4. Build Process

Vercel will automatically:
1. Run `npm install` (which triggers `postinstall` for native deps)
2. Run `npm run build`
3. Deploy the optimized build

## Deployment Steps

1. **Push to GitHub** (if using Git integration)
   ```bash
   git push origin main
   ```

2. **Deploy via Vercel Dashboard**
   - Go to your Vercel project
   - Click "Deployments" → "Redeploy" or push to trigger auto-deploy

3. **Monitor Build Logs**
   - Check for any build errors
   - Verify environment variables are loaded
   - Ensure native dependencies install correctly

## Troubleshooting

### Build Fails with Native Dependency Errors

The `postinstall` script automatically installs platform-specific dependencies. If it fails:
- Check that npm has proper permissions
- Verify the platform is supported in `scripts/install-native-deps.js`
- Check Vercel build logs for specific errors

### Environment Variables Not Working

- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Verify variables are set for the correct environment (Production/Preview/Development)
- Redeploy after adding new variables

### Image Loading Issues

- Verify Supabase storage bucket is configured
- Check image remote patterns in `next.config.ts`
- Ensure CORS is properly configured in Supabase

### API Routes Timing Out

- Default timeout is 30 seconds (configured in `vercel.json`)
- For longer operations, consider using background jobs or increasing timeout

## Production Optimizations Applied

1. **Next.js Config:**
   - React Strict Mode enabled
   - Image optimization (AVIF/WebP)
   - Console log removal in production
   - Experimental features for stability

2. **Vercel Config:**
   - Function timeouts set to 30s
   - Region set to `iad1` (US East)
   - Proper framework detection

3. **Build Process:**
   - Native dependencies auto-installed
   - TypeScript compilation
   - Production optimizations enabled

## Post-Deployment

1. **Test the live site:**
   - Verify all pages load correctly
   - Test authentication flows
   - Check API endpoints
   - Verify image loading

2. **Monitor:**
   - Check Vercel Analytics
   - Monitor error logs
   - Check Supabase dashboard for database activity

3. **Set up custom domain** (if needed):
   - Go to Vercel project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Support

For issues specific to:
- **Vercel**: Check Vercel documentation or support
- **Next.js**: Check Next.js documentation
- **Supabase**: Check Supabase documentation
- **Project-specific**: Review `README_ADMIN.md` and `SUPABASE_SETUP.md`

