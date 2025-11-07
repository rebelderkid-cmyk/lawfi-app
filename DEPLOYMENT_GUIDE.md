# LawFI Deployment Guide

## The Problem You're Experiencing

After deploying, you see this error:
```
Anthropic API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.
```

**Why?** Your `.env.local` file (containing your API key) is NOT on GitHub for security reasons. When you deploy, the deployed version doesn't have your API key.

---

## Solution: Add Environment Variables to Your Deployment

### For Vercel (Recommended)

#### Step 1: Access Environment Variables
1. Go to: https://vercel.com/dashboard
2. Click on your **lawfi-app** project
3. Click **Settings** (top navigation)
4. Click **Environment Variables** (left sidebar)

#### Step 2: Add Your API Key
Click **Add New** and enter:

```
Name: ANTHROPIC_API_KEY
Value: [Your API key from .env.local]
Environment: ✅ Production ✅ Preview ✅ Development
```

**Your API key starts with:** `sk-ant-api03-...`

#### Step 3: Redeploy
1. Go to **Deployments** tab
2. Find your latest deployment
3. Click the **⋯** (three dots) menu
4. Click **Redeploy**
5. Wait for deployment to complete (1-2 minutes)

#### Step 4: Test
Visit your deployed URL and try the chat. It should work now!

---

### For Other Platforms

#### Netlify
1. Go to: Site settings → Environment variables
2. Add: `ANTHROPIC_API_KEY` with your key value
3. Redeploy from: Deploys → Trigger deploy

#### Railway
1. Go to: Project → Variables
2. Add: `ANTHROPIC_API_KEY` with your key value
3. Redeploy automatically happens

#### Render
1. Go to: Dashboard → Your Service → Environment
2. Add: `ANTHROPIC_API_KEY` with your key value
3. Click **Save** (auto-redeploys)

---

## Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already done)
- Add environment variables directly in deployment platform
- Use different API keys for development and production
- Rotate API keys regularly

### ❌ DON'T:
- Commit `.env.local` to GitHub
- Share API keys in code or screenshots
- Use same API key across multiple projects
- Store keys in frontend code

---

## How to Find Your API Key

Your API key is stored locally in:
```
/Users/rinne/Documents/Rinne_Vault/LawFI/lawfi-app/.env.local
```

To view it:
```bash
cat .env.local
```

Or open the file in VS Code.

---

## Verifying Environment Variables

### Local Development
```bash
# In your project directory
cat .env.local
```

### Deployed Version (Vercel)
1. Go to: Settings → Environment Variables
2. You'll see: `ANTHROPIC_API_KEY` (value is hidden for security)
3. Click 👁️ icon to reveal value

---

## Troubleshooting

### Error: "API key not configured"
**Solution:** Follow Step 2 above to add the environment variable

### Error: "Invalid API key"
**Solution:**
1. Check your API key at: https://console.anthropic.com/settings/keys
2. Make sure it's still active
3. Update it in your deployment platform

### Error: "Model not available"
**Solution:**
- Check your Anthropic account has credits
- Verify your account tier supports Claude 3 Haiku
- Go to: https://console.anthropic.com/settings/plans

### Changes not showing after redeploy
**Solution:**
1. Do a **hard refresh** in browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
2. Clear browser cache
3. Try incognito/private browsing mode

---

## Environment Variables You Need

### Required
```env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Optional (for future features)
```env
# Database (when you add user accounts)
DATABASE_URL=postgresql://...

# Authentication (when you add login)
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-here

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-...
```

---

## Quick Reference

### Get Your Deployed URL
- **Vercel:** https://lawfi-app-rebelderkid-cmyk.vercel.app (or similar)
- **Netlify:** https://lawfi-app.netlify.app (or similar)

### Check Deployment Status
- **Vercel:** Dashboard → lawfi-app → Deployments
- **Netlify:** Site overview → Production deploys

### View Logs
- **Vercel:** Deployments → [Your deployment] → Functions → View logs
- **Netlify:** Deploys → [Your deployment] → Deploy log

---

## Testing After Deployment

1. Visit your deployed URL
2. Go to `/chat` page
3. Ask a question like: "What are my rights if I'm being sued?"
4. You should see Claude respond with legal guidance

---

## Need Help?

- **Vercel Docs:** https://vercel.com/docs/environment-variables
- **Anthropic Support:** https://console.anthropic.com/
- **GitHub Issues:** https://github.com/rebelderkid-cmyk/lawfi-app/issues

---

## Summary

**The Error is Normal!** It happens because:
1. ✅ Your API key is safely excluded from GitHub
2. ❌ Your deployment doesn't have the API key yet
3. ✅ You need to add it manually to the deployment platform

**Quick Fix:**
1. Go to your deployment platform settings
2. Add `ANTHROPIC_API_KEY` environment variable
3. Redeploy
4. Test!

**Your code is secure. Now just add the environment variable to your deployment!** 🔒🚀
