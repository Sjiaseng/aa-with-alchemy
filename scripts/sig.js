const hre = require("hardhat");

async function main() {

    const [signer0] = await hre.ethers.getSigners();
    const signature = signer0.signMessage(hre.ethers.getBytes(hre.ethers.id("Hello World")));

    const Test = await hre.ethers.getContractFactory("Test");
    const test = await Test.deploy();

    console.log("address0", await signer0.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});