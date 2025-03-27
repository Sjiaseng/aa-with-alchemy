require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "arb",
  networks: {
      // localhost: {
      //   chainId: 31337,
      //   url: 'http://127.0.0.1:8545',
      // },
      arb:{
        url: process.env.RPC_URL,
        accounts: [process.env.PRIVATE_KEY],
      }
  },
};

// npx hardhat run scripts/deploy.js --network localhost
// npx hardhat run scripts/execute.js --network localhost
// npx hardhat run scripts/test.js --network localhost
