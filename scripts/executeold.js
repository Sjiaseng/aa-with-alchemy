const hre = require("hardhat");
require("dotenv").config(); 

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS; 
const EP_ADDRESS = process.env.EP_ADDRESS;
const PM_ADDRESS = process.env.PM_ADDRESS;

async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE
  });

  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  // const initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);
  const initCode = "0x";

  console.log("Sender Address: " + sender);

  // prefund
  // await entryPoint.depositTo(PM_ADDRESS, {
  //   value: hre.ethers.parseEther("100"),
  // });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender,
    nonce: await entryPoint.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    callGasLimit: 400_000,
    verificationGasLimit: 400_000,
    preVerificationGas: 100_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    // signature: signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("Hello World"))), // signer 1 cannot sign only owner can sign
    signature: "0x",
  };

  const userOpHash = await entryPoint.getUserOpHash(userOp);
  userOp.signature = signer0.signMessage(hre.ethers.getBytes(userOpHash));

  // const signature = signer0.signMessage(
  //   hre.ethers.getBytes(hre.ethers.id("Hello World"))
  // );

  const tx = await entryPoint.handleOps([userOp], address0);
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});