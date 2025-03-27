const hre = require("hardhat");
const { etherscan } = require("../hardhat.config");
require("dotenv").config(); 

const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS; 
const EP_ADDRESS = process.env.EP_ADDRESS;
const PM_ADDRESS = process.env.PM_ADDRESS;

async function main() {

  const entryPoint = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  const [signer0, signer1] = await hre.ethers.getSigners();

  const address0 = await signer0.getAddress();
  const address1 = await signer1.getAddress();

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");
  let initCode = FACTORY_ADDRESS + AccountFactory.interface.encodeFunctionData("createAccount", [address0]).slice(2);


  let sender;

  try{
    await entryPoint.getSenderAddress(initCode);
  } catch (error) {
    console.log(error.data);
    sender = "0x" + error.data.slice(-40);
  }

   const code = await etherscan.provider.getCode(sender);
   if(code !== "0x"){
    initCode = "0x";
   }

//   prefund
//   await entryPoint.depositTo(PM_ADDRESS, {
//     value: hre.ethers.parseEther("100"),
//   });

  const Account = await hre.ethers.getContractFactory("Account");

  const userOp = {
    sender,
    nonce: "0x" + await entryPoint.getNonce(sender, 0).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    // callGasLimit: 400_000,
    // verificationGasLimit: 400_000,
    // preVerificationGas: 100_000,
    // maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    // maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    paymasterAndData: PM_ADDRESS,
    // signature: signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("Hello World"))), // signer 1 cannot sign only owner can sign
    //signature: "0x",
    signature: "0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c",
  };

    const {preVerificationGas, verificationGasLimit, callGasLimit} = await ethers.provider.send("eth_astimateUserOperationGas", [
        userOp,
        EP_ADDRESS,
    ]);

    userOp.preVerificationGas = preVerificationGas;
    userOp.verificationGasLimit = verificationGasLimit;
    userOp.callGasLimit = callGasLimit;

    const { maxFeePerGas } = await ethers.provider.getFeeData();
    userOp.maxFeePerGas = "0x" + maxFeePerGas.toString(16);

    const maxPriorityFeePerGas = await ethers.provider.send("rundler_maxPriorityFeePerGas");
    userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

    const userOpHash = await entryPoint.getUserOpHash(userOp);
    userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

    const opHash = await ethers.provider.send("eth_sendUserOperation", [userOp, EP_ADDRESS]);

    console.log(opHash);

    setTimeout(async () => {
        const { transactionHash } = await ethers.provider.send("eth_getUserOperationByHash", [opHash, EP_ADDRESS]);
        console.log(transactionHash);
    }, 5000);

    // const signature = signer0.signMessage(
    //     hre.ethers.getBytes(hre.ethers.id("Hello World"))
    // );

    // const tx = await entryPoint.handleOps([userOp], address0);
    // const receipt = await tx.wait();
    // console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});