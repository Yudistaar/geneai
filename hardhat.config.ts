import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    nexus: {
      url: "https://rpc.nexus.xyz/http",
      chainId: 393,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      nexus: "nexus",
    },
    customChains: [
      {
        network: "nexus",
        chainId: 393,
        urls: {
          apiURL: "https://explorer.nexus.xyz/api",
          browserURL: "https://explorer.nexus.xyz",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};

export default config;