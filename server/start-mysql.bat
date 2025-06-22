@echo off
echo Starting MySQL manually...
echo ========================

echo.
echo 1. Checking if XAMPP Control Panel is running as Administrator...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ NOT running as Administrator
    echo Please run this script as Administrator or run XAMPP Control Panel as Administrator
    pause
    exit /b 1
)

echo.
echo 2. Stopping any existing MySQL processes...
taskkill /f /im mysqld.exe >nul 2>&1
taskkill /f /im mysql.exe >nul 2>&1

echo.
echo 3. Starting MySQL service manually...
cd /d C:\xampp\mysql\bin
mysqld.exe --defaults-file=C:\xampp\mysql\bin\my.ini --standalone --console

echo.
echo If MySQL started successfully, you should see "ready for connections" message above.
echo Press any key to continue...
pause