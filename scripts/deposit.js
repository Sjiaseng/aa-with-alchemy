const hre = require("hardhat");
const { etherscan } = require("../hardhat.config");
require("dotenv").config(); 

const EP_ADDRESS = process.env.EP_ADDRESS;
const PM_ADDRESS = process.env.PM_ADDRESS;

async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  await entryPoint.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther(".2"),
  });

  console.log("Deposit Successful !");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});