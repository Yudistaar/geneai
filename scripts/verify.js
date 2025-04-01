const hre = require("hardhat");

async function main() {
  await hre.run("verify:verify", {
    address: "0xE96eC0133E9A543067d364fA85ed40D4F7f1A999",
    constructorArguments: [],
    network: "nexus",
    force: true
  });
}

main().catch(console.error);