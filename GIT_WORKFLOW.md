# Git Workflow & Deployment Guide for FitPathway Organizer

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
6. Merge when approved (see merge strategies below)

## 🔀 Understanding GitHub Merge Strategies

When merging a pull request on GitHub, you'll see different merge options. Here's what each one does:

### **Squash and Merge** ⭐ (Recommended)

**What it does:**
- Combines ALL commits from your feature branch into ONE single commit on `main`
- Creates a clean, linear history
- Example: If you have 7 commits on your feature branch, they all become 1 commit on `main`

**When to use:**
- ✅ For most feature branches (recommended default)
- ✅ When you have many small "work in progress" commits
- ✅ When you want to keep `main` branch history clean and easy to read
- ✅ When commits in your feature branch are not meaningful individually

**Pros:**
- Clean, linear git history
- Easier to revert entire features (just revert one commit)
- Easier to read `git log` on main branch
- Hides messy development commits like "fix typo" or "WIP"

**Cons:**
- Loses individual commit history from feature branch
- Can't see the detailed development process

**Example:**
```
Before merge (feature branch):
- commit 1: "Add login button"
- commit 2: "Fix typo"
- commit 3: "Update styles"
- commit 4: "Fix lint errors"
- commit 5: "Add tests"
- commit 6: "Fix test"
- commit 7: "Update docs"

After squash merge (main branch):
- commit 1: "feat: implement login feature with tests and docs"
```

### **Create a Merge Commit** (Traditional Merge)

**What it does:**
- Keeps ALL individual commits from your feature branch
- Creates a merge commit to connect the branches
- Preserves complete development history
- Example: If you have 7 commits, all 7 will appear in `main` history + 1 merge commit = 8 commits total

**When to use:**
- ✅ When each commit is meaningful and well-structured
- ✅ For long-running feature branches with logical commit progression
- ✅ When you need to preserve detailed history for auditing
- ✅ When working with complex features where commit-by-commit history matters

**Pros:**
- Complete history preserved
- Can see exact development progression
- Each commit can be reviewed individually
- Good for collaborative branches with multiple contributors

**Cons:**
- Can make main branch history messy with many small commits
- Harder to read `git log` on main branch
- More difficult to revert (need to revert multiple commits)

**Example:**
```
After merge commit (main branch):
- commit 1: "Add login button"
- commit 2: "Fix typo"
- commit 3: "Update styles"
- commit 4: "Fix lint errors"
- commit 5: "Add tests"
- commit 6: "Fix test"
- commit 7: "Update docs"
- commit 8: "Merge pull request #123 from feature/login"
```

### **Rebase and Merge** (Advanced)

**What it does:**
- Replays your commits on top of `main` branch
- No merge commit created
- Creates a linear history without merge commits

**When to use:**
- ✅ When you want to keep individual commits but maintain linear history
- ✅ When commits are well-structured and meaningful
- ✅ Advanced users comfortable with rebasing

**Note:** This option requires your branch to be up-to-date with main.

### 📊 Quick Decision Guide

```
Do you have many small "WIP" commits?
    ↓ YES → Use "Squash and Merge" ⭐
    ↓ NO
    ↓
Are your commits well-structured and meaningful?
    ↓ YES → Consider "Create a Merge Commit" or "Rebase and Merge"
    ↓ NO → Use "Squash and Merge" ⭐
    ↓
Do you need to preserve detailed commit history?
    ↓ YES → Use "Create a Merge Commit"
    ↓ NO → Use "Squash and Merge" ⭐
```

### 💡 Best Practice for This Project

**For FitPathway Organizer, we recommend:**
- **Default: Use "Squash and Merge"** for most features
- **Use "Create a Merge Commit"** only for:
  - Release branches
  - Major feature branches with well-structured commits
  - When you need detailed history for debugging

**Why Squash is Better for This Project:**
- Keeps main branch clean and readable
- Makes it easier to understand what each PR accomplished
- Simplifies rollbacks if needed
- Aligns with modern development practices

### 📋 Comparison Table

| Feature | Squash and Merge ⭐ | Create a Merge Commit | Rebase and Merge |
|---------|-------------------|---------------------|------------------|
| **Number of commits on main** | 1 commit | All commits + 1 merge commit | All commits |
| **History clarity** | Very clean | Can be messy | Clean |
| **Preserves individual commits** | ❌ No | ✅ Yes | ✅ Yes |
| **Easy to revert** | ✅ Very easy | ⚠️ Moderate | ⚠️ Moderate |
| **Good for "WIP" commits** | ✅ Yes | ❌ No | ❌ No |
| **Learning curve** | Easy | Easy | Advanced |
| **Recommended for beginners** | ✅ Yes | ⚠️ Sometimes | ❌ No |

### ❓ FAQ: Common Questions

**Q: I have 7 commits on my branch. What happens with squash?**  
A: All 7 commits will be combined into 1 single commit on the main branch. You'll be able to edit the commit message before merging.

**Q: Will I lose my work if I squash?**  
A: No! Your work is safe. The only thing that changes is how commits appear in the main branch history. Your feature branch keeps all commits.

**Q: Can I change the merge strategy after merging?**  
A: No, once merged you cannot change the strategy. However, you could revert and re-merge if absolutely necessary (not recommended).

**Q: Which one should I use for my 7-commit feature branch?**  
A: If those 7 commits are small incremental changes (like "fix typo", "update style", etc.), use **Squash and Merge**. If each commit is a significant, well-documented change, you could use **Create a Merge Commit**.

**Q: What do other projects use?**  
A: Many modern projects (including large open-source projects) use Squash and Merge as the default because it keeps history clean.

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