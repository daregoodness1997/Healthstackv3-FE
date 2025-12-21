#!/bin/bash

# Script to find xlsx usage in the codebase
# Run: chmod +x find-xlsx-usage.sh && ./find-xlsx-usage.sh

echo "🔍 Searching for xlsx usage in the codebase..."
echo ""

echo "📦 Files importing xlsx:"
echo "======================="
grep -r "from 'xlsx'" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | grep -v node_modules | grep -v ".md" || echo "None found"
echo ""

grep -r "from \"xlsx\"" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | grep -v node_modules | grep -v ".md" || echo "None found"
echo ""

echo "📝 Files using XLSX methods:"
echo "============================"
grep -r "XLSX\." src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | grep -v node_modules | wc -l | xargs echo "Total occurrences:"
echo ""

echo "📄 Detailed file list:"
echo "====================="
grep -r "XLSX\." src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" -l | grep -v node_modules | sort | uniq
echo ""

echo "✅ Files that need migration:"
echo "============================"
grep -r "from 'xlsx'\|from \"xlsx\"\|import.*xlsx" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" -l | grep -v node_modules | sort | uniq
echo ""

echo "📊 Summary:"
echo "==========="
total_files=$(grep -r "from 'xlsx'\|from \"xlsx\"\|import.*xlsx" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" -l | grep -v node_modules | wc -l)
echo "Total files to migrate: $total_files"
