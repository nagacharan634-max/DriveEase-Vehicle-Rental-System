@echo off
title DriveEase - Vehicle Rental Management System
echo ========================================================
echo  DriveEase - Vehicle Rental Management System
echo  Relational DBMS Academic Platform (8 Tables)
echo ========================================================
echo.

if not exist node_modules (
    echo [1/2] Installing dependencies (first time setup)...
    call npm install
) else (
    echo [1/2] Dependencies already installed.
)

echo.
echo [2/2] Launching DriveEase web server...
echo Open your browser at: http://localhost:5173/
echo.
call npm run dev
pause
