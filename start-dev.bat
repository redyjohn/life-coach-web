@echo off
echo Starting Life Coach Web Development Environment...
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version

echo.
echo Installing dependencies...
call npm install

echo.
echo Starting backend server on port 3000...
start "Backend Server" cmd /k "npm run server"

echo Waiting for backend server to start...
timeout /t 3 /nobreak >nul

echo.
echo Starting frontend development server on port 5173...
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting up...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit this window...
pause >nul

