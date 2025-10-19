import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// 1. Import dotenv to read .env file
require("dotenv").config();

// 2. Pull the variables from your .env file
const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.24", // Or whatever your version is
  networks: {
    // 3. Add the new Sepolia testnet configuration
    sepolia: {
      url: SEPOLIA_RPC_URL || "", // Use the variable here
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [], // And here
    },
    // The localhost network is still here for local testing
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
