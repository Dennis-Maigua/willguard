const Will = artifacts.require("Will");

module.exports = function (deployer) {
  deployer.deploy(Will, { value: web3.utils.toWei("1", "ether") });
};
