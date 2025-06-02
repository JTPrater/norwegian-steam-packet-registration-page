@echo off
echo Norwegian Steam Packet Company - Git Update Script
echo ================================================

cd /d "c:\Users\JTP20\OneDrive\Desktop\Congress Vote Counter"

echo Current directory: %CD%
echo.

echo Adding new files...
"C:\Program Files\Git\bin\git.exe" add .

echo.
echo Committing changes...
"C:\Program Files\Git\bin\git.exe" commit -m "CLEANUP: Remove old admin key combination references and unused modal code"

echo.
echo Pushing to GitHub...
"C:\Program Files\Git\bin\git.exe" push origin main

echo.
echo ================================================
echo Update complete! Your changes have been pushed to GitHub.
echo.
echo Next steps:
echo 1. Go to: https://github.com/JTPrater/norwegian-steam-packet-registration-page
echo 2. Click Settings → Pages
echo 3. Select "Deploy from a branch" → main → / (root)
echo 4. Click Save
echo.
echo Your site will be available at:
echo https://jtprater.github.io/norwegian-steam-packet-registration-page/
echo.
pause
