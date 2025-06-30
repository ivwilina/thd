#!/bin/bash
# Script to clean up development files

echo "🧹 Cleaning up development and test files..."

# Delete test files
echo "Deleting test files..."
rm -f testStaffInventory.js
rm -f testSimpleCRUD.js  
rm -f testAdminCRUD.js
rm -f backend/testStaffAPI.js
rm -f backend/testOrderAPI.js
rm -f backend/testInventoryData.js
rm -f backend/testInventoryAPI.js
rm -f backend/testImages.js
rm -f backend/testComprehensiveCRUD.js
rm -f backend/testAPI.js
rm -f backend/testAdminCRUD.js
rm -f backend/utils/testServices.js
rm -f backend/utils/testRoleSystem.js
rm -f backend/utils/testBackend.js

# Delete development reports
echo "Deleting development reports..."
rm -f *REPORT*.md
rm -f backend/*REPORT*.md

# Delete cache fix files
echo "Deleting cache fix files..."
rm -f BROWSER_CACHE_FIX.md
rm -f IMPORT_ERROR_FIX.md

# Delete temporary guides
echo "Deleting temporary guides..."
rm -f *_GUIDE.md
rm -f *_CHECKLIST.md
rm -f QUICK_START_READY.md

# Delete old staff inventory files
echo "Deleting old files..."
rm -f frontend/may_tinh_tran_anh/src/pages/StaffInventorySimple.jsx
rm -f frontend/may_tinh_tran_anh/src/components/TestApiService.jsx

# Delete old CSS files
echo "Deleting old CSS files..."
rm -f frontend/may_tinh_tran_anh/src/assets/adminDashboardScoped.css
rm -f frontend/may_tinh_tran_anh/src/assets/adminDashboard.css
rm -f frontend/may_tinh_tran_anh/src/assets/inventoryDashboard.css
rm -f frontend/may_tinh_tran_anh/src/assets/inventoryDashboardScoped.css

# Delete batch files
echo "Deleting batch files..."
rm -f backend/runTestSuite.bat

echo "✅ Cleanup completed!"
echo "Remaining files are production-ready."
