@echo off
REM Regenerates cards.js (the deck the browser app loads) from cards.json.
REM Double-click this file. The printable deck was retired on 2026-08-28.
REM It resolves its own folder, so it stays correct if the vault moves.
REM Everything it prints is also written to build_log.txt beside it.
REM It touches nothing outside this folder, reaches no network, and runs no git.
setlocal
set "HERE=%~dp0"
set "LOG=%HERE%build_log.txt"

set "PY="
where python >nul 2>&1
if not errorlevel 1 set "PY=python"
if not defined PY (
  where py >nul 2>&1
  if not errorlevel 1 set "PY=py"
)
if not defined PY (
  >"%LOG%" echo Python was not found on this machine's PATH.
  >>"%LOG%" echo Install it from python.org, then double-click this file again.
  type "%LOG%"
  echo.
  pause
  exit /b 1
)

>"%LOG%"  echo Build started %DATE% %TIME%
>>"%LOG%" echo Folder: %HERE%
>>"%LOG%" echo Python: %PY%
>>"%LOG%" echo.
%PY% "%HERE%build_vragenspel.py" >>"%LOG%" 2>&1
set "RC=%ERRORLEVEL%"
>>"%LOG%" echo.
>>"%LOG%" echo Exit code: %RC%

type "%LOG%"
echo.
if not "%RC%"=="0" echo BUILD FAILED - nothing was written. Read build_log.txt above.
pause
endlocal & exit /b %RC%
