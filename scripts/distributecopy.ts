import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const CONTRACT_ADDRESS = "0x9Aa6DE2EC72fb281896d848Fbb8A2F5569e2a662";
  const provider = new ethers.JsonRpcProvider("https://rpc.nexus.xyz/http"); // Change if needed
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = await ethers.getContractAt("GenesisAI", CONTRACT_ADDRESS, signer);

  // Read addresses from file
  const data = fs.readFileSync("nexus_addresses12.txt", "utf-8");
  const entries = data
    .split("\n")
    .filter(line => line.trim())
    .map(line => {
      const [address, amount] = line.split(",");
      return {
        address: address.trim(),
        amount: ethers.parseUnits(amount.trim(), 18)
      };
    });

  for (const [index, entry] of entries.entries()) {
    try {
      console.log(`Processing ${index + 1}/${entries.length}: ${entry.address}`);

      // Ensure distribute() gets an array if needed
      const tx = await contract.distribute([entry.address], [entry.amount]); 

      await tx.wait();
      console.log(`Transaction completed: ${tx.hash}`);

      // Prevent RPC overload (adjust delay if needed)
      await new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error(`Error processing ${entry.address}:`, error);
    }
  }

  console.log("✅ Distribution complete.");
}

main().catch(console.error);
