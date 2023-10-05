const { developmentChains } = require("../hardhat.helper.js");
const { deployments, getNamedAccounts, ethers } = require("hardhat");
// const { ethers } = require("ethers");
const { assert, expect } = require("chai");

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("Socialmedia Contract", () => {
      let socialMedia;
      beforeEach(async () => {
        console.log(ethers);
        const txresponse = await deployments.fixture("main");
        const { deployer } = await getNamedAccounts();

        console.log(provider);

        console.log(signer);

        const socialMediaFactory = await ethers.getContractFactory(
          "Socialmedia",
          signer
        );
        await socialMediaFactory.deploy();
      });

      describe("Constructor ", () => {
        it("Should it initialize correct value ", async () => {
          console.log(socialMedia);

          //   const val = await socialMedia.getTotalUsers();
          //   console.log(val);
          // console.log(txresponse)
          //   assert.equal(val.toString(), "1");
          // console.log(socialMedia)
        });
      });
    });
