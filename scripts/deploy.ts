import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contract with account:", deployer.address);

  const GenesisAI = await ethers.getContractFactory("GenesisAI");
  const contract = await GenesisAI.deploy();
  
  console.log("GenesisAI deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});