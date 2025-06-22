@echo off
echo Adding MySQL to Windows Firewall...
echo ===================================

echo.
echo This script will add MySQL to Windows Firewall exceptions.
echo You need to run this as Administrator.
echo.

echo Checking if running as Administrator...
net session >nul 2>&1
if %errorLevel% == 0 (
    echo ✅ Running as Administrator
) else (
    echo ❌ NOT running as Administrator
    echo Please right-click this file and select "Run as administrator"
    pause
    exit /b 1
)

echo.
echo Adding inbound rule for MySQL...
netsh advfirewall firewall add rule name="MySQL Inbound" dir=in action=allow protocol=TCP localport=3306

echo.
echo Adding outbound rule for MySQL...
netsh advfirewall firewall add rule name="MySQL Outbound" dir=out action=allow protocol=TCP localport=3306

echo.
echo Adding rule for XAMPP MySQL executable...
netsh advfirewall firewall add rule name="XAMPP MySQL" dir=in action=allow program="C:\xampp\mysql\bin\mysqld.exe"

echo.
echo ✅ Firewall rules added successfully!
echo.
echo Next steps:
echo 1. Restart XAMPP MySQL service
echo 2. Test connection: node simple-mysql-test.js
echo 3. Try phpMyAdmin: http://localhost/phpmyadmin
echo.
pause