# 🔧 Troubleshooting Guide

## 🚨 Common Issues & Solutions

---

## ✅ **FIXED: GitHub Actions Failures**

### Issue
All GitHub Actions workflows were failing with errors.

### What Went Wrong

The auto-merge workflow had a critical flaw:
- **Problem:** When PRs were manually merged (like you did), the workflow still tried to auto-merge them
- **Result:** Workflow failed because it tried to merge an already-merged PR
- **Error:** The workflow didn't check if PR was already merged before attempting merge

### What Was Fixed

**Updated `auto-merge-to-main.yml` workflow with:**

1. **Check if PR already merged**
   ```yaml
   - Check PR state before attempting merge
   - Exit gracefully if already merged
   - Show "Already merged ✅" message
   ```

2. **Better error handling**
   ```yaml
   - Handle manually merged PRs
   - Detect if PR was merged during workflow run
   - Graceful exit instead of failure
   ```

3. **Improved status checks**
   ```yaml
   - Check PR state: OPEN, MERGED, or CLOSED
   - Skip merge if already done
   - Clear status messages in summary
   ```

### Status
✅ **FIXED** - Workflow now handles all edge cases properly!

---

## 📋 Other Common Issues

### Issue: "403 Permission Denied" when pushing

**Symptom:**
```bash
error: RPC failed; HTTP 403
fatal: the remote end hung up unexpectedly
```

**Cause:** Branch name doesn't match session ID pattern

**Solution:**
Branch names MUST follow this pattern:
```bash
claude/your-feature-name-r-01V8FN9vWEjf6sSkUfKsbh4h
```

**Correct examples:**
```bash
✅ claude/week-2-r-01V8FN9vWEjf6sSkUfKsbh4h
✅ claude/fix-bug-r-01V8FN9vWEjf6sSkUfKsbh4h
✅ claude/add-feature-r-01V8FN9vWEjf6sSkUfKsbh4h
```

**Wrong examples:**
```bash
❌ feature/week-2
❌ main
❌ develop
```

---

### Issue: Workflow triggers but doesn't merge

**Symptom:** PR created but auto-merge doesn't happen

**Possible Causes:**

1. **GitHub Actions permissions not enabled**
   - Go to: Settings → Actions → General
   - Enable: "Read and write permissions"
   - Check: "Allow GitHub Actions to create and approve pull requests"

2. **Validation checks failing**
   - Check Actions tab for "Validate Code" workflow
   - Look for errors in notebooks, HTML, or secrets scan

3. **PR already manually merged**
   - This is now handled gracefully ✅
   - Workflow will exit with success

**Solution:**
```bash
# Check Actions tab for detailed logs
https://github.com/gouthamgo/Learn-AI/actions

# Look for red ❌ marks
# Click the failed workflow
# Read error messages
```

---

### Issue: Can't push to main directly

**Symptom:**
```bash
error: RPC failed; HTTP 403
```

**This is expected!** You shouldn't push to main directly.

**Instead:**
```bash
# Create a claude/ branch
git checkout -b claude/my-feature-r-01V8FN9vWEjf6sSkUfKsbh4h

# Push the branch (triggers auto-merge)
git push -u origin claude/my-feature-r-01V8FN9vWEjf6sSkUfKsbh4h

# Auto-merge will handle merging to main!
```

---

### Issue: Validation checks failing

**Symptom:** Auto-merge blocked by failed checks

**Common causes:**

1. **Invalid Jupyter notebook**
   ```bash
   # Check notebook format
   python -m nbformat.validate your-notebook.ipynb
   ```

2. **Missing HTML tags**
   ```html
   <!-- Make sure you have: -->
   <!DOCTYPE html>
   <html>
   <body>
   ...
   </body>
   </html>
   ```

3. **Secrets detected**
   ```bash
   # Don't commit:
   - API keys
   - Passwords
   - Tokens
   - .env files with real secrets
   ```

4. **Large files**
   ```bash
   # Files > 10MB trigger warnings
   # Files > 100MB blocked by GitHub
   # Solution: Use Git LFS or reduce file size
   ```

**Solution:**
```bash
# Run validation locally
./verify-setup.sh

# Fix errors
# Commit and push again
```

---

### Issue: Multiple workflows running

**Symptom:** See many workflows in Actions tab

**This is normal!**
- One workflow per branch push
- Multiple branches = multiple workflows
- All will auto-merge independently

**Example:**
```
Branch A → Workflow A → Merges independently
Branch B → Workflow B → Merges independently
Branch C → Workflow C → Merges independently
```

---

### Issue: Branch not deleted after merge

**Possible causes:**

1. **Manual merge** - Auto-delete only works with auto-merge
2. **Permissions** - GitHub Actions needs write permissions
3. **Protected branch** - Can't delete protected branches

**Solution:**
```bash
# Delete manually
git branch -d branch-name
git push origin --delete branch-name

# Or use GitHub UI
# Go to Branches tab → Delete
```

---

## 🔍 Debugging Steps

### 1. Check Actions Tab
```
https://github.com/gouthamgo/Learn-AI/actions

Look for:
- ❌ Red X = Failed
- ✅ Green checkmark = Success
- ⏸️ Yellow dot = Running
```

### 2. Click Failed Workflow
```
- Click the failed workflow
- Expand failed step
- Read error message
- Google the error if unclear
```

### 3. Check PR Status
```
https://github.com/gouthamgo/Learn-AI/pulls

Look for:
- Open PRs waiting to merge
- Merged PRs (already done)
- Closed PRs (rejected)
```

### 4. Run Local Verification
```bash
./verify-setup.sh
# Check configuration

./test-pipeline.sh
# Test end-to-end
```

### 5. Check Permissions
```
Settings → Actions → General → Workflow permissions

Must have:
✅ Read and write permissions
✅ Allow GitHub Actions to create and approve pull requests
```

---

## 📞 Getting Help

### Check These First:
1. This troubleshooting guide
2. [CI-CD-GUIDE.md](CI-CD-GUIDE.md) - Complete pipeline docs
3. [QUICK-START.md](QUICK-START.md) - Setup guide
4. Actions tab error logs

### Still Stuck?

1. **Check the error message** - It usually tells you what's wrong
2. **Google the error** - Someone else likely had the same issue
3. **Review workflow files** - See what the workflow is trying to do
4. **Test locally** - Run scripts to verify setup

### Common Error Messages:

| Error | Meaning | Solution |
|-------|---------|----------|
| `403 Forbidden` | Permission denied | Use claude/ branch name |
| `404 Not Found` | Resource doesn't exist | Check repo/branch exists |
| `merge conflict` | Conflicting changes | Resolve conflicts manually |
| `validation failed` | Code quality issues | Fix errors in code |
| `already merged` | PR already done | This is OK now! ✅ |

---

## ✅ Verification Checklist

After fixing issues, verify:

```bash
# 1. Verify setup
./verify-setup.sh
# Should show all green ✅

# 2. Test pipeline
./test-pipeline.sh
# Should auto-merge successfully

# 3. Check Actions
# All recent workflows should be green ✅

# 4. Check PRs
# Should be merged or merging

# 5. Try a real feature
git checkout -b claude/test-r-01V8FN9vWEjf6sSkUfKsbh4h
echo "test" > test.txt
git add test.txt
git commit -m "Test"
git push -u origin claude/test-r-01V8FN9vWEjf6sSkUfKsbh4h
# Should auto-merge!
```

---

## 🎉 Success Indicators

You know it's working when:

✅ Branch pushed successfully
✅ PR auto-created in <10 seconds
✅ Validation checks pass (green ✅)
✅ Auto-merge completes in ~1-2 minutes
✅ Branch deleted automatically
✅ Code appears in main branch

---

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [YAML Syntax Guide](https://yaml.org/spec/1.2/spec.html)

---

**Last Updated:** After fixing the auto-merge workflow ✅

**Status:** All known issues resolved! 🎉
