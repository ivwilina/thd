@echo off
title Hệ Thống Máy Tính Trần Anh - Quick Start

echo ===========================================
echo   Hệ Thống Máy Tính Trần Anh
echo   Quick Start Script
echo ===========================================
echo.

:: Kiểm tra Node.js
echo 🔍 Kiểm tra Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js không được tìm thấy!
    echo Vui lòng cài đặt Node.js từ: https://nodejs.org
    pause
    exit /b 1
)
echo ✅ Node.js đã cài đặt

:: Kiểm tra MongoDB
echo 🔍 Kiểm tra MongoDB...
mongosh --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB không được tìm thấy!
    echo Vui lòng cài đặt MongoDB từ: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo ✅ MongoDB đã cài đặt

:: Menu lựa chọn
echo.
echo Chọn hành động:
echo 1. Cài đặt dependencies (lần đầu)
echo 2. Setup dữ liệu mẫu
echo 3. Kiểm tra hệ thống
echo 4. Khởi chạy Backend + Frontend
echo 5. Dọn dẹp file test
echo 0. Thoát
echo.
set /p choice="Nhập lựa chọn (0-5): "

if "%choice%"=="1" goto install
if "%choice%"=="2" goto setup_data
if "%choice%"=="3" goto health_check
if "%choice%"=="4" goto start_system
if "%choice%"=="5" goto cleanup
if "%choice%"=="0" goto end
goto menu

:install
echo.
echo 📦 Cài đặt dependencies...
echo.

echo Cài đặt Backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi cài đặt backend dependencies!
    pause
    exit /b 1
)

echo.
echo Cài đặt Frontend dependencies...
cd ..\frontend\may_tinh_tran_anh
call npm install
if %errorlevel% neq 0 (
    echo ❌ Lỗi khi cài đặt frontend dependencies!
    pause
    exit /b 1
)

cd ..\..
echo ✅ Cài đặt dependencies thành công!
pause
goto menu

:setup_data
echo.
echo 🔧 Setup dữ liệu mẫu...
cd backend
call node setupComplete.js
cd ..
echo.
echo ✅ Setup dữ liệu hoàn thành!
pause
goto menu

:health_check
echo.
echo 🏥 Kiểm tra hệ thống...
cd backend
call node healthCheck.js
cd ..
pause
goto menu

:start_system
echo.
echo 🚀 Khởi chạy hệ thống...
echo.
echo Bước 1: Khởi động Backend Server...
cd backend
start "Backend Server" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul

echo Bước 2: Khởi động Frontend App...
cd ..\frontend\may_tinh_tran_anh
start "Frontend App" cmd /k "npm start"

cd ..\..
echo.
echo ✅ Hệ thống đang khởi động!
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo 🔑 Tài khoản mặc định:
echo    Admin: admin@maytinhrananh.com / admin123
echo    Staff: staff1@maytinhrananh.com / staff123
echo.
echo Nhấn phím bất kỳ để mở trình duyệt...
pause >nul
start http://localhost:3000
goto end

:cleanup
echo.
echo 🧹 Dọn dẹp file test và báo cáo...
call cleanup.bat
echo ✅ Dọn dẹp hoàn thành!
pause
goto menu

:menu
cls
goto start

:end
echo.
echo 👋 Cảm ơn bạn đã sử dụng hệ thống!
pause
exit
