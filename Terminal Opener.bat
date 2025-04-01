@echo off

rem Start 20 terminals, each running the respective distributeX.ts script
start cmd /k "npx hardhat run scripts/distribute1.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute2.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute3.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute4.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute5.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute6.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute7.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute8.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute9.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute10.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute11.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute12.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute13.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute14.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute15.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute16.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute17.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute18.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute19.ts --network nexus"
start cmd /k "npx hardhat run scripts/distribute20.ts --network nexus"

echo All terminals started!
pause
