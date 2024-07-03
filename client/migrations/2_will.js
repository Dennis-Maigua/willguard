const Will = artifacts.require("Will");

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(Will, accounts[0], accounts[1], 60);
};
