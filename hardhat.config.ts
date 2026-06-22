import "@nomicfoundation/hardhat-toolbox";
import { config as loadEnv } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";

loadEnv({ path: ".env.local" });
loadEnv();

const privateKey = process.env.PRIVATE_KEY;
const accounts = privateKey
  ? [privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`]
  : [];

const config: HardhatUserConfig = {
  networks: {
    celo: {
      accounts,
      chainId: 42220,
      url: "https://forno.celo.org",
    },
    celoSepolia: {
      accounts,
      chainId: 11142220,
      url: "https://forno.celo-sepolia.celo-testnet.org",
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
