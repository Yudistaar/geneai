import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const CONTRACT_ADDRESS = "0x9Aa6DE2EC72fb281896d848Fbb8A2F5569e2a662";
  const provider = new ethers.JsonRpcProvider("https://rpc.nexus.xyz/http");
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = await ethers.getContractAt("GenesisAI", CONTRACT_ADDRESS, signer);

  // Read addresses from file
  const data = fs.readFileSync("nexus_addresses.txt", "utf-8");
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

  // Progress tracking
  let successCount = 0;
  let retryCount = 0;
  const maxRetries = 5;
  const progressFile = "progress.json";

  // Load previous progress if exists
  let startIndex = 0;
  if (fs.existsSync(progressFile)) {
    const progress = JSON.parse(fs.readFileSync(progressFile, "utf-8"));
    startIndex = progress.lastProcessedIndex + 1;
    console.log(`Resuming from index ${startIndex}`);
  }

  for (let i = startIndex; i < entries.length; i++) {
    const entry = entries[i];
    let attempts = 0;
    let success = false;

    while (attempts <= maxRetries && !success) {
      try {
        console.log(`Processing ${i + 1}/${entries.length}: ${entry.address} (Attempt ${attempts + 1})`);

        // Use manual nonce management
        const nonce = await provider.getTransactionCount(signer.address, "latest");
        const tx = await contract.distribute([entry.address], [entry.amount], {
          nonce: nonce
        });

        await tx.wait();
        console.log(`Transaction ${i + 1} completed: ${tx.hash}`);
        successCount++;
        success = true;

        // Save progress after each successful transaction
        fs.writeFileSync(progressFile, JSON.stringify({ lastProcessedIndex: i }));

        // Dynamic delay based on success rate
        const baseDelay = 2000; // 2 seconds
        const jitter = Math.random() * 1000; // Random 0-1s
        await new Promise(resolve => setTimeout(resolve, baseDelay + jitter));

      } catch (error) {
        attempts++;
        retryCount++;
        console.error(`Error processing ${entry.address}:`, error.message);

        if (attempts > maxRetries) {
          console.error(`❌ Failed after ${maxRetries} attempts: ${entry.address}`);
          // Save failed address for later review
          fs.appendFileSync("failed.txt", `${entry.address},${entry.amount}\n`);
          break;
        }

        // Exponential backoff
        const backoffTime = Math.pow(2, attempts) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  }

  console.log(`
    ✅ Distribution complete.
    Success: ${successCount}
    Failed: ${entries.length - successCount}
    Retries: ${retryCount}
  `);
}

main().catch(console.error);