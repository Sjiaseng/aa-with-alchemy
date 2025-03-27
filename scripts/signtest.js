const hre = require("hardhat");
require("dotenv").config(); 

const ACCOUNT_ADDRESS = process.env.ACCOUNT_ADDRESS;

async function main() {

    const account = await hre.ethers.getContractAt("Account", ACCOUNT_ADDRESS);
    const count = await account.count();
    console.log(count);
    
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});