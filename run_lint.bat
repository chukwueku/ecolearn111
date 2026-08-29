@echo off
set PATH=C:\Program Files\nodejs;%PATH%
call npm run lint > lint_output.txt 2>&1
type lint_output.txt
