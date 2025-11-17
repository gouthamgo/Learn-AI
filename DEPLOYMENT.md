# 🚀 Deployment Guide - Deploy Your AI Learning Platform

This guide will walk you through deploying your Learn-AI platform to Vercel (FREE hosting!).

## 📋 Prerequisites

- GitHub account (free)
- Vercel account (free)
- Git installed on your computer

## 🎯 Step-by-Step Deployment

### Step 1: Push Your Code to GitHub

#### 1.1 Create a GitHub Repository

1. Go to [github.com](https://github.com)
2. Click the **"+"** icon → **"New repository"**
3. Fill in the details:
   - Repository name: `Learn-AI`
   - Description: "My personal AI learning platform"
   - Choose **Public** (required for free GitHub Pages)
   - Don't initialize with README (we already have one)
4. Click **"Create repository"**

#### 1.2 Push Your Local Code

```bash
# Navigate to your project directory
cd /path/to/Learn-AI

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Week 1 complete - Python basics lessons and website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR-USERNAME/Learn-AI.git

# Push to GitHub
git push -u origin claude/checkout-r-01V8FN9vWEjf6sSkUfKsbh4h

# If you want to push to main branch instead:
# git checkout -b main
# git push -u origin main
```

**Important**: Replace `YOUR-USERNAME` with your actual GitHub username!

---

### Step 2: Deploy to Vercel

#### 2.1 Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"** (recommended)
4. Authorize Vercel to access your GitHub account

#### 2.2 Import Your Project

1. Click **"Add New..."** → **"Project"**
2. You'll see a list of your GitHub repositories
3. Find **"Learn-AI"** and click **"Import"**

#### 2.3 Configure Your Project

Vercel will auto-detect that it's a static site. You don't need to change anything!

- **Framework Preset**: Leave as detected (or choose "Other")
- **Root Directory**: `./` (default)
- **Build Command**: Leave empty (it's a static HTML site)
- **Output Directory**: Leave empty

#### 2.4 Deploy!

1. Click **"Deploy"**
2. Wait 1-2 minutes while Vercel builds and deploys
3. **🎉 Done!** You'll get a URL like: `https://learn-ai-xyz.vercel.app`

---

### Step 3: Update Colab Links

Your notebooks need to point to YOUR GitHub repository.

#### 3.1 Edit index.html Locally

Open `index.html` and find all instances of:
```html
https://colab.research.google.com/github/YOUR-USERNAME/Learn-AI/blob/main/...
```

Replace `YOUR-USERNAME` with your actual GitHub username:
```html
https://colab.research.google.com/github/johndoe/Learn-AI/blob/main/...
```

**Tip**: Use Find & Replace (Ctrl+H or Cmd+H) to replace all at once!

#### 3.2 Push the Update

```bash
git add index.html
git commit -m "Update Colab links with correct GitHub username"
git push
```

Vercel will **automatically redeploy** in 1-2 minutes!

---

### Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://your-site.vercel.app`
2. Click on **"Open in Google Colab"** for Day 1
3. It should open the notebook in Google Colab
4. Sign in with Google and run the code!

**If it doesn't work:**
- Check that your GitHub repository is **public**
- Verify the Colab link points to your username
- Make sure the file path is correct

---

## 🎨 Customize Your Domain (Optional)

### Option 1: Use a Custom Vercel URL

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add a custom Vercel domain like: `my-ai-journey.vercel.app`

### Option 2: Use Your Own Domain

1. Buy a domain (e.g., from Namecheap, Google Domains)
2. In Vercel: **Settings** → **Domains** → Add your domain
3. Update your DNS records as instructed by Vercel
4. Wait for DNS propagation (5-60 minutes)

---

## 🔄 Auto-Deploy on GitHub Push

**Good news!** Vercel automatically redeploys when you push to GitHub.

Your workflow:
```bash
# Make changes locally
# Edit files, add new lessons, etc.

# Commit and push
git add .
git commit -m "Added Week 2 lessons"
git push

# Vercel auto-deploys in 1-2 minutes! 🎉
```

---

## 📊 Monitor Your Deployment

### Vercel Dashboard

Check your deployment status:
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. See:
   - Live URL
   - Deployment history
   - Analytics (visits, page views)
   - Logs (for debugging)

---

## 🐛 Troubleshooting

### Issue: "404 Not Found" on Vercel

**Solution**: Make sure `index.html` is in the root directory, not in a subfolder.

```
Learn-AI/
├── index.html          ✅ Correct
├── style.css
└── ...

NOT:
Learn-AI/
└── website/
    ├── index.html      ❌ Wrong
    └── style.css
```

### Issue: Colab Links Don't Work

**Solutions**:
1. Check GitHub repository is **public**
2. Verify the file path: `Phase-1-Foundations/Week-1-Python-Basics/Day-1...`
3. Make sure you replaced `YOUR-USERNAME` with your actual username
4. Check the branch name (usually `main` or `master`)

Example working link:
```
https://colab.research.google.com/github/johndoe/Learn-AI/blob/main/Phase-1-Foundations/Week-1-Python-Basics/Day-1-Variables-and-Data-Types.ipynb
```

### Issue: CSS Not Loading

**Solution**: Make sure `style.css` is in the same directory as `index.html`.

### Issue: Changes Not Showing Up

**Solutions**:
1. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
2. Check Vercel deployment completed successfully
3. Wait 2-3 minutes for propagation

---

## 📱 Share Your Platform!

Once deployed, share your learning platform:

1. **Twitter/X**:
   ```
   Just built my AI learning platform! 🧠🚀

   Following a 20-week roadmap from Python to Deep Learning.
   100% free, 100% hands-on!

   Check it out: [your-url]

   #100DaysOfCode #AI #MachineLearning
   ```

2. **LinkedIn**:
   ```
   Excited to share my AI learning journey! 🎓

   I've built a complete learning platform with:
   • Interactive Jupyter notebooks
   • Hands-on projects
   • 20-week structured curriculum

   Check it out: [your-url]
   ```

3. **Reddit** (r/learnmachinelearning, r/learnprogramming):
   - Share your platform
   - Ask for feedback
   - Help others learn!

---

## 🎯 Next Steps

After deployment:

1. ✅ **Star your own repo** (to track it)
2. ✅ **Complete Week 1** lessons
3. ✅ **Track your progress** in `my-progress.md`
4. ✅ **Add Week 2** content as you learn
5. ✅ **Share with friends** who want to learn AI

---

## 💰 Cost Breakdown

Everything is **100% FREE**!

| Service | Cost |
|---------|------|
| GitHub | Free (unlimited public repos) |
| Vercel | Free (hobby plan, unlimited deployments) |
| Google Colab | Free (with generous usage limits) |
| Domain (optional) | $10-15/year (if you want custom domain) |

**Total: $0** (or $10-15/year for custom domain)

---

## 🆘 Need Help?

1. Check this troubleshooting guide
2. Read [Vercel Documentation](https://vercel.com/docs)
3. Open an issue on GitHub
4. Search on Stack Overflow

---

**Congratulations!** 🎉

You now have:
- ✅ A live website deployed to the internet
- ✅ Interactive AI lessons accessible anywhere
- ✅ A portfolio piece you can show employers
- ✅ Your own learning platform!

**Now go learn some AI!** 🧠🚀

---

*Last updated: 2024*
