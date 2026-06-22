import hre from "hardhat";

const { ethers, network } = hre;

function getExplorerAddressUrl(networkName: string, contractAddress: string) {
  if (networkName === "celo") {
    return `https://celoscan.io/address/${contractAddress}`;
  }

  if (networkName === "celoSepolia") {
    return `https://celo-sepolia.blockscout.com/address/${contractAddress}`;
  }

  return "";
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const ImpactRegistry = await ethers.getContractFactory(
    "ConnectUSImpactRegistry",
  );
  const registry = await ImpactRegistry.deploy();

  await registry.waitForDeployment();

  const contractAddress = await registry.getAddress();
  const explorerLink = getExplorerAddressUrl(network.name, contractAddress);

  console.log("ConnectUSImpactRegistry deployed");
  console.log(`Network: ${network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Contract address: ${contractAddress}`);

  if (explorerLink) {
    console.log(`Explorer: ${explorerLink}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
