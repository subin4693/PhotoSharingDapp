const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  await deploy("Socialmedia", {
    from: deployer,
    log: true,
    args: [],
  });
};

module.exports.tags = ["main"];
