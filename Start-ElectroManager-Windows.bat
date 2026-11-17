@echo off
cd /d "%~dp0"
set NODE_OPTIONS=
start "" "%~dp0node_modules\electron\dist\electron.exe" .
