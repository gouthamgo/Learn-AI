#!/bin/bash

# ================================================================
# ✅ CI/CD Setup Verification Script
# ================================================================
# Checks if everything is configured correctly for auto-merge
# ================================================================

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ✅ CI/CD Pipeline Setup Verification                   ║"
echo "╔══════════════════════════════════════════════════════════╗"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Git repository
echo -e "${BLUE}[1/6]${NC} Checking Git repository..."
if git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Git repository detected${NC}"
else
    echo -e "${RED}❌ Not a Git repository${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 2: Workflow files exist
echo -e "${BLUE}[2/6]${NC} Checking workflow files..."
WORKFLOW_DIR=".github/workflows"

if [ -d "$WORKFLOW_DIR" ]; then
    echo -e "${GREEN}✅ Workflows directory exists${NC}"

    # Check individual workflows
    WORKFLOWS=(
        "auto-merge-to-main.yml"
        "validate-code.yml"
        "quick-merge-to-main.yml"
    )

    for workflow in "${WORKFLOWS[@]}"; do
        if [ -f "$WORKFLOW_DIR/$workflow" ]; then
            echo -e "${GREEN}   ✅ $workflow${NC}"
        else
            echo -e "${RED}   ❌ $workflow missing${NC}"
            ERRORS=$((ERRORS + 1))
        fi
    done
else
    echo -e "${RED}❌ Workflows directory not found${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 3: Main branch exists
echo -e "${BLUE}[3/6]${NC} Checking main branch..."
if git show-ref --verify --quiet refs/heads/main || git show-ref --verify --quiet refs/remotes/origin/main; then
    echo -e "${GREEN}✅ Main branch exists${NC}"
else
    echo -e "${YELLOW}⚠️  Main branch not found locally${NC}"
    WARNINGS=$((WARNINGS + 1))
    echo -e "${YELLOW}   Fetching from origin...${NC}"
    git fetch origin main:main 2>/dev/null || echo -e "${RED}   ❌ Could not fetch main${NC}"
fi
echo ""

# Check 4: GitHub remote
echo -e "${BLUE}[4/6]${NC} Checking GitHub remote..."
REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")

if [ -n "$REMOTE_URL" ]; then
    echo -e "${GREEN}✅ Git remote configured${NC}"
    echo -e "${BLUE}   Remote: $REMOTE_URL${NC}"

    # Check if it's GitHub
    if echo "$REMOTE_URL" | grep -q "github.com"; then
        echo -e "${GREEN}   ✅ GitHub remote detected${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Remote is not GitHub${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${RED}❌ No git remote configured${NC}"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# Check 5: GitHub CLI (optional but helpful)
echo -e "${BLUE}[5/6]${NC} Checking GitHub CLI (optional)..."
if command -v gh &> /dev/null; then
    echo -e "${GREEN}✅ GitHub CLI installed${NC}"

    # Check if authenticated
    if gh auth status &> /dev/null; then
        echo -e "${GREEN}   ✅ Authenticated${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Not authenticated${NC}"
        echo -e "${YELLOW}      Run: gh auth login${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
else
    echo -e "${YELLOW}⚠️  GitHub CLI not installed (optional)${NC}"
    echo -e "${YELLOW}   Install: brew install gh (Mac) or sudo apt install gh (Linux)${NC}"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# Check 6: Documentation files
echo -e "${BLUE}[6/6]${NC} Checking documentation..."
DOCS=(
    "CI-CD-GUIDE.md"
    ".github/AUTO-MERGE-QUICKSTART.md"
    "README.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo -e "${GREEN}✅ $doc${NC}"
    else
        echo -e "${YELLOW}⚠️  $doc missing${NC}"
        WARNINGS=$((WARNINGS + 1))
    fi
done
echo ""

# Summary
echo "═══════════════════════════════════════════════════════════"
echo -e "${BLUE}📊 Verification Summary${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ Perfect! Everything is configured correctly!${NC}"
    echo ""
    echo -e "${GREEN}🚀 You're ready to use auto-merge!${NC}"
    echo ""
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo -e "${GREEN}✅ But core setup is OK - auto-merge should work!${NC}"
    echo ""
else
    echo -e "${RED}❌ $ERRORS error(s) found${NC}"
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found${NC}"
    echo ""
    echo -e "${RED}Please fix the errors above before using auto-merge${NC}"
    echo ""
fi

# Next steps
echo "═══════════════════════════════════════════════════════════"
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "═══════════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo "1️⃣  Configure GitHub Actions permissions:"
    echo "   → Go to: https://github.com/gouthamgo/Learn-AI/settings/actions"
    echo "   → Enable: 'Read and write permissions'"
    echo "   → Check: 'Allow GitHub Actions to create and approve pull requests'"
    echo "   → Click: Save"
    echo ""
    echo "2️⃣  Test the pipeline:"
    echo "   → Run: ./test-pipeline.sh"
    echo ""
    echo "3️⃣  Start using it:"
    echo "   → git checkout -b feature/my-feature"
    echo "   → git add . && git commit -m 'My changes'"
    echo "   → git push -u origin feature/my-feature"
    echo "   → Watch it auto-merge! 🎉"
    echo ""
else
    echo "1️⃣  Fix the errors listed above"
    echo "2️⃣  Run this script again: ./verify-setup.sh"
    echo "3️⃣  Then test the pipeline: ./test-pipeline.sh"
    echo ""
fi

echo "═══════════════════════════════════════════════════════════"
echo ""

# Exit with error code if there are errors
if [ $ERRORS -gt 0 ]; then
    exit 1
else
    exit 0
fi
