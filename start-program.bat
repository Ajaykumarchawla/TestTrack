@echo off
set PORT=5000
echo ============================================
echo Starting MCQ Platform on http://localhost:%PORT%
echo ============================================

:: Open browser in default system browser
start http://localhost:%PORT%

:: Start the server and block until user closes
npx serve dist -l %PORT%

echo Server stopped. Port %PORT% is now free.
pause
