// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";
const mainnetChainId = "1";

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  const { ADMIN_ADDRESS, USER_ADDRESS } = process.env;

  if (!ADMIN_ADDRESS) {
    throw Error("Must define ADMIN_ADDRESS in the env");
  }

  let TokenDeployment;
  if (chainId === mainnetChainId) {
    TokenDeployment = { address: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F" };
  } else {
    TokenDeployment = await deploy("Token", {
      from: deployer,
      log: true,
      waitConfirmations: 5,
    });
    if (USER_ADDRESS) {
      const Token = await ethers.getContract("Token", deployer);
      let tx = await Token.mint();
      await tx.wait();
      tx = await Token.transfer(USER_ADDRESS, ethers.utils.parseEther("100"));
      await tx.wait();
    }
  }

  const stakingArgs = [TokenDeployment.address];

  await deploy("RoundStaking", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    args: stakingArgs,
    log: true,
    waitConfirmations: 5,
  });

  // Getting a previously deployed contract
  const RoundStaking = await ethers.getContract("RoundStaking", deployer);

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here...
  // You don't want to verify on localhost
  try {
    if (chainId !== localChainId) {
      await run("verify:verify", {
        address: RoundStaking.address,
        contract: "contracts/RoundStaking.sol:RoundStaking",
        constructorArguments: stakingArgs,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
module.exports.tags = ["RoundStaking", "Token"];
