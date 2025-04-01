@echo off
setlocal enabledelayedexpansion

for /L %%i in (1,1,20) do (
  start cmd /k "npx hardhat run scripts/distribute.ts --network nexus %%i && timeout 5"
  timeout 1 >nul
)

echo All 20 workers started with staggered launch
pause