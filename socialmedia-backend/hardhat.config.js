/** @type import('hardhat/config').HardhatUserConfig */

require("hardhat-deploy");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("hardhat-deploy-ethers");
require("ethers");
require("solidity-coverage");

module.exports = {
    solidity: "0.8.18",
    networks: {
        sepolia: {
            url: "/*Enter your url*/",
            accounts: ["/*Enter your private key*/"],
            chainId: 11155111,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
    },
};
