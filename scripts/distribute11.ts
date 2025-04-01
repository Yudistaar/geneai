import { ethers } from "hardhat";
import * as fs from "fs";

async function main() {
  const CONTRACT_ADDRESS = "0x9Aa6DE2EC72fb281896d848Fbb8A2F5569e2a662";
  const provider = new ethers.JsonRpcProvider("https://rpc.nexus.xyz/http");
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);
  const contract = await ethers.getContractAt("GenesisAI", CONTRACT_ADDRESS, signer);

  // Get initial nonce
  let nonce = await provider.getTransactionCount(signer.address, "latest");
  console.log(`Initial nonce: ${nonce}`);

  const data = fs.readFileSync("nexus_addresses_chunk_11.txt", "utf-8");
  const entries = data
    .split("\n")
    .filter(line => line.trim())
    .map(line => {
      const parts = line.split(",");
      if (parts.length !== 2) return null;
      const [address, amount] = parts;
      return {
        address: address.trim(),
        amount: ethers.parseUnits(amount.trim(), 18)
      };
    })
    .filter(entry => entry !== null) as { address: string; amount: bigint }[];

  for (const [index, entry] of entries.entries()) {
    try {
      console.log(`Processing ${index + 1}/${entries.length}: ${entry.address}`);

      // Get current fee data
      const feeData = await provider.getFeeData();

      // Manually set nonce and gas parameters
      const tx = await contract.distribute.populateTransaction(
        [entry.address],
        [entry.amount]
      );

      const sentTx = await signer.sendTransaction({
        ...tx,
        nonce: nonce++,
        maxFeePerGas: feeData.maxFeePerGas || undefined,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas || undefined,
        gasLimit: 200000
      });

      console.log(`Transaction sent: ${sentTx.hash}`);
      await sentTx.wait();
      console.log(`Confirmed: ${sentTx.hash}`);

      // Increased delay between transactions
      await new Promise(resolve => setTimeout(resolve, 2000));

    } catch (error) {
      console.error(`Error processing ${entry.address}:`, error);
      // Reset nonce if transaction failed
      nonce = await provider.getTransactionCount(signer.address, "latest");
      console.log(`Reset nonce to: ${nonce}`);
    }
  }

  console.log("✅ Distribution complete.");
}

main().catch(console.error);