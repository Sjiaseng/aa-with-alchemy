const hre = require("hardhat");

async function main() {
  const accountFactory = await hre.ethers.deployContract("AccountFactory"); // af

  await accountFactory.waitForDeployment();

  console.log(`Account Factory deployed to ${accountFactory.target}`);

  // const entryPoint = await hre.ethers.deployContract("EntryPoint"); // ep

  // await entryPoint.waitForDeployment();

  // console.log(`EntryPoint deployed to ${entryPoint.target}`);

  const payMaster = await hre.ethers.deployContract("Paymaster"); // pm

  await payMaster.waitForDeployment();

  console.log(`PayMaster deployed to ${payMaster.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


