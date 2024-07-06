const Will = artifacts.require("Will");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(Will, { value: web3.utils.toWei("1", "ether"), from: accounts[0] });
};
