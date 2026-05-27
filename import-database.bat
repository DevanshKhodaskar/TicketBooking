@echo off
REM Database import script for Windows
REM Update the password and path if needed

setlocal enabledelayedexpansion

set MYSQL_PATH=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe
set SCHEMA_FILE=database\schema.sql
set MYSQL_USER=root
set MYSQL_PASSWORD=root

echo Importing database schema...
echo.

REM Run mysql with the schema file
"%MYSQL_PATH%" -u %MYSQL_USER% -p%MYSQL_PASSWORD% < "%SCHEMA_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Database schema imported successfully!
) else (
    echo.
    echo ✗ Error importing database schema
    echo Check your MySQL credentials and try again
)

pause
