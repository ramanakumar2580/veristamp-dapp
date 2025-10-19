import { ethers } from "hardhat";

async function main() {
  // Get the contract factory for "VeriStamp"
  const VeriStamp = await ethers.getContractFactory("VeriStamp");

  // Start the deployment and wait for it to complete
  console.log("Deploying VeriStamp contract...");
  const veriStamp = await VeriStamp.deploy();

  // The 'deploy' function now waits for the deployment to be mined.
  // We no longer need 'await veriStamp.deployed();'

  // Get the contract's address using the new getAddress() method
  const contractAddress = await veriStamp.getAddress();

  // Print the contract's address to the console
  console.log(`VeriStamp contract deployed to: ${contractAddress}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
