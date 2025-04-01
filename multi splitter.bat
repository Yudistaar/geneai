@echo off
setlocal enabledelayedexpansion

set "input_file=nexus_addresses.txt"
set lines_per_file=4892
set file_counter=1
set line_counter=0

for /f "tokens=*" %%a in (%input_file%) do (
    echo %%a >> "nexus_addresses_chunk_!file_counter!.txt"
    set /a line_counter+=1
    if !line_counter! equ %lines_per_file% (
        set /a file_counter+=1
        set line_counter=0
    )
)

endlocal
echo Files split successfully!