const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT deployed to:", nft.address);

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log("Marketplace deployed to:", marketplace.address);

  // Example: mint one NFT and approve marketplace (optional)
  const tx = await nft.mint("https://example.com/metadata/1.json");
  await tx.wait();
  console.log("Minted tokenId 1 to deployer");

  const approveTx = await nft.approve(marketplace.address, 1);
  await approveTx.wait();
  console.log("Approved tokenId 1 for marketplace");
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
