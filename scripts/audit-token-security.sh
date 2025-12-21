#!/bin/bash

# Token Security Audit Script
# Finds all instances of insecure token access in the codebase

echo "🔍 TOKEN SECURITY AUDIT REPORT"
echo "=============================="
echo ""

# Count total violations
echo "📊 VIOLATION COUNTS:"
echo ""

TOTAL_LOCALSTORAGE=$(grep -r "localStorage.getItem.*feathers-jwt" src/ | wc -l | tr -d ' ')
echo "Direct localStorage.getItem('feathers-jwt'): $TOTAL_LOCALSTORAGE instances"

TOTAL_BEARER=$(grep -r "Authorization.*Bearer.*token" src/ --include="*.jsx" --include="*.tsx" --include="*.js" --include="*.ts" | wc -l | tr -d ' ')
echo "Manual Bearer token headers: $TOTAL_BEARER instances"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Files by category
echo "📁 FILES BY CATEGORY:"
echo ""

echo "1️⃣  UPLOAD/FILE OPERATIONS (High Priority):"
grep -l "axios.*upload" src/hsmodules/Client/UploadDocument.jsx \
  src/hsmodules/Client/clients/UpdateClientPassport.jsx \
  src/hsmodules/ProviderRelationship/UploadDocument.jsx \
  src/hsmodules/ManagedCare/components/lead/LeadUpload.jsx \
  src/hsmodules/CRM/components/lead/LeadUpload.jsx \
  src/hsmodules/CRM/components/templates/TemplateCreate.jsx \
  src/hsmodules/CRM/components/templates/TemplateCreateForDocument.jsx 2>/dev/null | sed 's|src/|  - |'

echo ""
echo "2️⃣  PRINT/PDF OPERATIONS (Medium Priority):"
grep -l "localStorage.getItem.*feathers-jwt" \
  src/hsmodules/ManagedCare/components/PrintBarcode.jsx \
  src/hsmodules/ManagedCare/components/PrintId.jsx \
  src/hsmodules/ManagedCare/components/Printout.jsx \
  src/hsmodules/ManagedCare/components/invoice/InvoicePrintOut.jsx \
  src/hsmodules/Corporate/components/PrintId.jsx \
  src/hsmodules/Corporate/components/Printout.jsx \
  src/hsmodules/Admin/employee/EmployeeIdCard.jsx \
  src/hsmodules/clientForm/forms/PrintBarcode.jsx 2>/dev/null | sed 's|src/|  - |'

echo ""
echo "3️⃣  POLICY/BENEFICIARY OPERATIONS (Medium Priority):"
grep -l "localStorage.getItem.*feathers-jwt" \
  src/hsmodules/ManagedCare/ClientPolicy.jsx \
  src/hsmodules/ManagedCare/OrgPolicy.jsx \
  src/hsmodules/ManagedCare/Policy.jsx \
  src/hsmodules/ManagedCare/Beneficiary.jsx \
  src/hsmodules/ManagedCare/ClientBeneficiary.jsx \
  src/hsmodules/Corporate/Policy.jsx \
  src/hsmodules/Corporate/Beneficiary.jsx 2>/dev/null | sed 's|src/|  - |'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Top 10 worst offenders
echo "🎯 TOP 10 FILES (Most Violations):"
echo ""
grep -r "localStorage.getItem.*feathers-jwt" src/ --include="*.jsx" --include="*.tsx" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -10 | \
  awk '{printf "  %2d violations - %s\n", $1, $2}' | sed 's|src/||'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Recently fixed files
echo "✅ RECENTLY FIXED:"
echo "  - src/hsmodules/helpers/getUploadUrl.jsx"
echo "  - src/components/profilemenu/index.tsx"
echo "  - src/hsmodules/Client/ClientIdCard.jsx"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Progress calculation
TOTAL_FILES=$(grep -rl "localStorage.getItem.*feathers-jwt" src/ --include="*.jsx" --include="*.tsx" | wc -l | tr -d ' ')
FIXED_FILES=3
REMAINING=$((TOTAL_FILES - FIXED_FILES))
PERCENT=$((FIXED_FILES * 100 / TOTAL_FILES))

echo "📈 PROGRESS:"
echo "  Total files with violations: $TOTAL_FILES"
echo "  Fixed: $FIXED_FILES"
echo "  Remaining: $REMAINING"
echo "  Progress: $PERCENT%"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔒 SECURITY STATUS: 🚨 CRITICAL"
echo ""
echo "Next steps:"
echo "  1. Fix HIGH priority upload operations (5 files)"
echo "  2. Fix MEDIUM priority print operations (8 files)"
echo "  3. Migrate policy operations to Feathers client"
echo ""
echo "See TOKEN_SECURITY_MIGRATION.md for detailed instructions"
