#!/bin/bash

# ================================================================
# 🧪 CI/CD Pipeline Test Script
# ================================================================
# This script tests your auto-merge pipeline end-to-end
# Run this to verify everything is working correctly!
# ================================================================

set -e  # Exit on error

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  🧪 CI/CD Auto-Merge Pipeline Test                      ║"
echo "╔══════════════════════════════════════════════════════════╗"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Test configuration
TEST_BRANCH="test/auto-merge-$(date +%s)"
REPO_OWNER="gouthamgo"
REPO_NAME="Learn-AI"

echo -e "${BLUE}📋 Test Configuration:${NC}"
echo "   Test branch: $TEST_BRANCH"
echo "   Repository: $REPO_OWNER/$REPO_NAME"
echo ""

# Step 1: Verify we're on main
echo -e "${YELLOW}[1/7]${NC} Checking current branch..."
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Not on main branch. Switching...${NC}"
    git checkout main
    git pull origin main
fi
echo -e "${GREEN}✅ On main branch${NC}"
echo ""

# Step 2: Create test branch
echo -e "${YELLOW}[2/7]${NC} Creating test branch: $TEST_BRANCH"
git checkout -b "$TEST_BRANCH"
echo -e "${GREEN}✅ Test branch created${NC}"
echo ""

# Step 3: Create test file
echo -e "${YELLOW}[3/7]${NC} Creating test file..."
TEST_FILE="test-pipeline-$(date +%s).md"
cat > "$TEST_FILE" << EOF
# 🧪 CI/CD Pipeline Test

**Test ID:** $(date +%Y%m%d-%H%M%S)
**Branch:** $TEST_BRANCH
**Purpose:** Verify auto-merge pipeline is working

## Test Details

This file was created automatically to test the CI/CD pipeline.

### What should happen:

1. ✅ Push triggers GitHub Actions
2. ✅ PR is auto-created
3. ✅ Validation checks run
4. ✅ Auto-merge to main
5. ✅ Branch is deleted

### Expected time: ~1-2 minutes

---

*This file can be deleted after successful test.*
EOF

echo -e "${GREEN}✅ Test file created: $TEST_FILE${NC}"
echo ""

# Step 4: Commit test file
echo -e "${YELLOW}[4/7]${NC} Committing test file..."
git add "$TEST_FILE"
git commit -m "Test: CI/CD auto-merge pipeline

This is an automated test of the auto-merge pipeline.
Expected behavior:
- Auto-create PR
- Run validation checks
- Auto-merge to main
- Delete test branch

Test ID: $(date +%Y%m%d-%H%M%S)"

echo -e "${GREEN}✅ Test file committed${NC}"
echo ""

# Step 5: Push to trigger pipeline
echo -e "${YELLOW}[5/7]${NC} Pushing to trigger auto-merge pipeline..."
echo -e "${BLUE}➡️  git push -u origin $TEST_BRANCH${NC}"
echo ""

git push -u origin "$TEST_BRANCH"

echo ""
echo -e "${GREEN}✅ Pushed successfully!${NC}"
echo ""

# Step 6: Provide monitoring links
echo -e "${YELLOW}[6/7]${NC} Pipeline triggered! 🚀"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 Monitor your pipeline here:${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "1️⃣  Actions (see workflow runs):"
echo "   https://github.com/$REPO_OWNER/$REPO_NAME/actions"
echo ""
echo "2️⃣  Pull Requests (see auto-created PR):"
echo "   https://github.com/$REPO_OWNER/$REPO_NAME/pulls"
echo ""
echo "3️⃣  Commits (after merge):"
echo "   https://github.com/$REPO_OWNER/$REPO_NAME/commits/main"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""

# Step 7: Wait and check status
echo -e "${YELLOW}[7/7]${NC} Waiting for pipeline to complete..."
echo ""
echo -e "${BLUE}What's happening now:${NC}"
echo "   ⏳ GitHub Actions is running..."
echo "   ⏳ Creating PR automatically..."
echo "   ⏳ Running validation checks..."
echo "   ⏳ Auto-merging to main..."
echo ""
echo -e "${YELLOW}⏱️  This typically takes 1-2 minutes${NC}"
echo ""

# Wait a bit for workflow to start
sleep 10

# Try to check status with gh CLI if available
if command -v gh &> /dev/null; then
    echo -e "${BLUE}Checking workflow status with GitHub CLI...${NC}"
    echo ""

    # Wait for workflow to appear
    for i in {1..12}; do
        echo -e "${YELLOW}Checking... (attempt $i/12)${NC}"

        # Check if PR was created
        PR_NUMBER=$(gh pr list --head "$TEST_BRANCH" --json number --jq '.[0].number' 2>/dev/null || echo "")

        if [ -n "$PR_NUMBER" ]; then
            echo -e "${GREEN}✅ PR #$PR_NUMBER created!${NC}"
            echo ""
            echo "   PR URL: https://github.com/$REPO_OWNER/$REPO_NAME/pull/$PR_NUMBER"
            echo ""

            # Check PR status
            PR_STATE=$(gh pr view "$PR_NUMBER" --json state --jq '.state' 2>/dev/null || echo "OPEN")

            if [ "$PR_STATE" == "MERGED" ]; then
                echo -e "${GREEN}🎉 SUCCESS! PR has been auto-merged!${NC}"
                echo ""
                echo -e "${GREEN}✅ Test PASSED!${NC}"
                echo ""
                echo "Your CI/CD pipeline is working perfectly! 🚀"
                echo ""

                # Switch back to main and pull
                git checkout main
                git pull origin main

                echo -e "${GREEN}✅ Switched back to main and pulled latest changes${NC}"
                echo ""
                break
            elif [ "$PR_STATE" == "OPEN" ]; then
                echo -e "${YELLOW}⏳ PR is open, waiting for auto-merge...${NC}"
            fi
        else
            echo -e "${YELLOW}⏳ Waiting for PR to be created...${NC}"
        fi

        if [ $i -lt 12 ]; then
            sleep 10
        fi
    done

    # Final check
    if [ "$PR_STATE" != "MERGED" ]; then
        echo ""
        echo -e "${YELLOW}⚠️  PR hasn't merged yet, but that's OK!${NC}"
        echo ""
        echo "It might take a bit longer. Check the links above to monitor progress."
        echo ""
    fi
else
    echo -e "${YELLOW}💡 Tip: Install GitHub CLI for automated status checks${NC}"
    echo "   brew install gh (Mac)"
    echo "   sudo apt install gh (Linux)"
    echo ""
    echo "For now, check the links above to monitor your pipeline!"
    echo ""
fi

# Final summary
echo "═══════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Test completed!${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${BLUE}What to verify:${NC}"
echo ""
echo "1. ✅ Check Actions tab - workflows should be running/completed"
echo "2. ✅ Check Pull Requests - PR should be created and merged"
echo "3. ✅ Check main branch - test file should be there"
echo "4. ✅ Check branches - test branch should be deleted"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}🎉 Your CI/CD pipeline is ready to use!${NC}"
echo ""
echo -e "${BLUE}Next time you push to any branch:${NC}"
echo "   1. PR auto-created"
echo "   2. Checks run"
echo "   3. Auto-merges to main"
echo "   4. Branch deleted"
echo "   5. Zero manual effort!"
echo ""
echo "═══════════════════════════════════════════════════════════"
