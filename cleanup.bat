@echo off
REM Windows batch version of cleanup script

echo 🧹 Cleaning up development and test files...

REM Delete test files
echo Deleting test files...
if exist testStaffInventory.js del testStaffInventory.js
if exist testSimpleCRUD.js del testSimpleCRUD.js
if exist testAdminCRUD.js del testAdminCRUD.js
if exist backend\testStaffAPI.js del backend\testStaffAPI.js
if exist backend\testOrderAPI.js del backend\testOrderAPI.js
if exist backend\testInventoryData.js del backend\testInventoryData.js
if exist backend\testInventoryAPI.js del backend\testInventoryAPI.js
if exist backend\testImages.js del backend\testImages.js
if exist backend\testComprehensiveCRUD.js del backend\testComprehensiveCRUD.js
if exist backend\testAPI.js del backend\testAPI.js
if exist backend\testAdminCRUD.js del backend\testAdminCRUD.js
if exist backend\utils\testServices.js del backend\utils\testServices.js
if exist backend\utils\testRoleSystem.js del backend\utils\testRoleSystem.js
if exist backend\utils\testBackend.js del backend\utils\testBackend.js

REM Delete development reports
echo Deleting development reports...
for %%f in (*REPORT*.md) do del "%%f"
for %%f in (backend\*REPORT*.md) do del "%%f"

REM Delete additional specific files
if exist IMAGE_FIX_COMPLETE.md del IMAGE_FIX_COMPLETE.md
if exist IMAGE_FLICKERING_FIX.md del IMAGE_FLICKERING_FIX.md
if exist PROJECT_COMPLETION_SUMMARY.md del PROJECT_COMPLETION_SUMMARY.md
if exist ROLE_BASED_ROUTING_COMPLETION.md del ROLE_BASED_ROUTING_COMPLETION.md
if exist STAFF_INVENTORY_SIMPLE_VERIFICATION.md del STAFF_INVENTORY_SIMPLE_VERIFICATION.md

REM Delete cache fix files
echo Deleting cache fix files...
if exist BROWSER_CACHE_FIX.md del BROWSER_CACHE_FIX.md
if exist IMPORT_ERROR_FIX.md del IMPORT_ERROR_FIX.md

REM Delete temporary guides
echo Deleting temporary guides...
for %%f in (*_GUIDE.md) do del "%%f"
for %%f in (*_CHECKLIST.md) do del "%%f"
if exist QUICK_START_READY.md del QUICK_START_READY.md

REM Delete old staff inventory files
echo Deleting old files...
if exist frontend\may_tinh_tran_anh\src\pages\StaffInventorySimple.jsx del frontend\may_tinh_tran_anh\src\pages\StaffInventorySimple.jsx
if exist frontend\may_tinh_tran_anh\src\components\TestApiService.jsx del frontend\may_tinh_tran_anh\src\components\TestApiService.jsx

REM Delete old CSS files
echo Deleting old CSS files...
if exist frontend\may_tinh_tran_anh\src\assets\adminDashboardScoped.css del frontend\may_tinh_tran_anh\src\assets\adminDashboardScoped.css
if exist frontend\may_tinh_tran_anh\src\assets\adminDashboard.css del frontend\may_tinh_tran_anh\src\assets\adminDashboard.css
if exist frontend\may_tinh_tran_anh\src\assets\inventoryDashboard.css del frontend\may_tinh_tran_anh\src\assets\inventoryDashboard.css
if exist frontend\may_tinh_tran_anh\src\assets\inventoryDashboardScoped.css del frontend\may_tinh_tran_anh\src\assets\inventoryDashboardScoped.css

REM Delete batch files
echo Deleting batch files...
if exist backend\runTestSuite.bat del backend\runTestSuite.bat

echo ✅ Cleanup completed!
echo Remaining files are production-ready.
pause
