const hre = require("hardhat");
require("dotenv").config(); 

const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;
const EP_ADDRESS = process.env.EP_ADDRESS;
const PM_ADDRESS = process.env.PM_ADDRESS;

async function main() {

    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
    const count = await account.count();
    console.log(count);

    console.log("Account Balance: ", await hre.ethers.provider.getBalance(ACCOUNT_ADDRESS));
    const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS)
    console.log("Account Balance (EP): ", await ep.balanceOf(ACCOUNT_ADDRESS));
    console.log("PayMaster Account Balance (EP): ", await ep.balanceOf(PM_ADDRESS));
    
    // npx hardhat run scripts/sig.js --network hardhat
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});