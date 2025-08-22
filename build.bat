@echo off
REM Build script for Windows deployment

echo Building InnerSelf Backend...

REM Navigate to server directory
cd server

REM Install dependencies
echo Installing dependencies...
npm install

echo Build completed successfully!
