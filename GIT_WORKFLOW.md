# Git Workflow & Deployment Guide for FitPathway Organizer

> **📌 Important**: This repository uses `main` as the default branch. For information about branch management and switching branches, see [BRANCH_MANAGEMENT_GUIDE.md](./BRANCH_MANAGEMENT_GUIDE.md) or [QUICK_FIX.md](./QUICK_FIX.md).

## 🚀 Quick Start: Git Best Practices

### 1. **Feature Branch Workflow**

Always create a new branch for each feature or fix:

```bash
# Create and switch to a new feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. **Making Changes**

```bash
# Check status
git status

# Add specific files
git add src/specific-file.tsx

# Or add all changes (be careful)
git add .

# Commit with descriptive message
git commit -m "feat: add multi-provider AI system with fallbacks"
```

### 3. **Pushing to GitHub**

```bash
# Push your feature branch
git push origin feature/ai-provider-enhancement

# If it's your first push of this branch
git push -u origin feature/ai-provider-enhancement
```

### 4. **Creating a Pull Request**

1. Go to your GitHub repository
2. Click "Pull requests" → "New pull request"
3. Select your feature branch to merge into `main`
4. Add a descriptive title and description
5. Request review if needed
6. Merge when approved

### 5. **Syncing with Lovable**

Lovable automatically syncs with your GitHub repository:
- Changes merged to `main` will appear in Lovable
- The sync happens within minutes
- Check the Lovable project page for status

## 📋 Current Changes Summary

### Files Modified:
1. **`.env`** - Added AI provider documentation
2. **`tsconfig.json`** - Fixed corrupted configuration
3. **`vite.config.ts`** - Updated build configuration
4. **`src/hooks/useSecurityContext.tsx`** - Fixed TypeScript errors
5. **`supabase/functions/ai-fitness-coach/index.ts`** - Implemented multi-provider AI system

### AI Provider Setup (Priority Order):

1. **Groq (Recommended)**
   - URL: https://console.groq.com/
   - Free Tier: 14,400 requests/day
   - Model: `llama-3.1-8b-instant`
   - No credit card required

2. **OpenRouter (Fallback)**
   - URL: https://openrouter.ai/
   - Model: `meta-llama/llama-3.2-3b-instruct:free`
   - Free models available

## 🔧 Supabase Configuration

### Required Environment Variables:

Add these to your Supabase Edge Function secrets:

```bash
# In Supabase Dashboard > Edge Functions > Secrets
GROQ_API_KEY=your_groq_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Database Schema Verification:

The database includes all necessary tables:
- ✅ profiles (user management)
- ✅ exercises (workout library)
- ✅ workout_schedules
- ✅ trainer_athletes (relationships)
- ✅ messages
- ✅ achievements
- ✅ audit_logs
- ✅ goals
- ✅ device_tokens (push notifications)

## 🚀 Deployment Steps

### 1. Commit Current Changes:

```bash
# Add all modified files
git add .

# Commit with descriptive message
git commit -m "feat: implement multi-provider AI system and fix build issues

- Fixed corrupted tsconfig.json
- Implemented Groq and OpenRouter fallback system
- Enhanced error handling and rate limiting
- Fixed TypeScript errors in useSecurityContext
- Added comprehensive AI provider documentation"
```

### 2. Push to GitHub:

```bash
git push origin feature/ai-provider-enhancement
```

### 3. Create Pull Request:

1. Go to: https://github.com/[your-username]/fit-pathway-organizer
2. Click "Compare & pull request"
3. Review changes
4. Merge to main

### 4. Deploy Edge Functions:

```bash
# Deploy the updated AI function
supabase functions deploy ai-fitness-coach
```

## 📊 Testing Checklist

Before merging, ensure:
- [ ] Build passes: `npm run build`
- [ ] Dev server runs: `npm run dev`
- [ ] AI chat works with Groq API
- [ ] Fallback to OpenRouter works
- [ ] Error handling displays user-friendly messages
- [ ] Rate limiting prevents abuse

## 🔍 Monitoring

After deployment:
1. Check Supabase Edge Function logs
2. Monitor AI provider usage
3. Track error rates in audit_logs table
4. Verify Lovable sync status

## 💡 Next Steps

1. **Add more free AI providers**:
   - Together AI (free tier)
   - Replicate (pay-per-use)
   - Hugging Face Inference API

2. **Implement caching**:
   - Cache common fitness questions
   - Reduce API calls

3. **Add streaming responses**:
   - Better UX for long responses
   - Real-time typing effect

## 🆘 Troubleshooting

### If Lovable doesn't sync:
1. Check GitHub webhook settings
2. Verify main branch protection rules
3. Contact Lovable support

### If AI doesn't work:
1. Check API keys in Supabase
2. Verify Edge Function deployment
3. Check browser console for errors
4. Review Edge Function logs

---

**Remember**: Always test locally before pushing to production!