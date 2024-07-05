const Will = artifacts.require("Will");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
const { expect } = chai;

contract("Will", (accounts) => {
    let will;
    const owner = accounts[0];
    const beneficiary = accounts[1];
    const amountInETH = "1";
    const amountInWei = web3.utils.toWei(amountInETH, "ether");

    beforeEach(async () => {
        will = await Will.new({ from: owner, value: amountInWei });
    });

    it("should set the owner and fortune correctly", async () => {
        const contractOwner = await will.owner();
        const fortune = await web3.eth.getBalance(will.address);

        expect(contractOwner).to.equal(owner);
        expect(fortune).to.equal(amountInWei);
    });

    it("should allow the owner to set inheritance", async () => {
        await will.setInheritance(beneficiary, amountInWei, { from: owner });

        const inheritanceAmount = await will.inheritance(beneficiary);
        expect(inheritanceAmount.toString()).to.equal(amountInWei);
    });

    it("should not allow non-owner to set inheritance", async () => {
        await expect(will.setInheritance(beneficiary, amountInWei, { from: beneficiary }))
            .to.be.rejectedWith("only owner can execute the will");
    });

    it("should allow the owner to mark deceased and payout", async () => {
        await will.setInheritance(beneficiary, amountInWei, { from: owner });
        const initialBeneficiaryBalance = BigInt(await web3.eth.getBalance(beneficiary));

        await will.hasDeceased({ from: owner });

        const deceasedStatus = await will.deceased();
        const finalBeneficiaryBalance = BigInt(await web3.eth.getBalance(beneficiary));

        expect(deceasedStatus).to.be.true;
        expect(finalBeneficiaryBalance).to.be.above(initialBeneficiaryBalance);
    });

    it("should not allow payout if the owner is not deceased", async () => {
        await will.setInheritance(beneficiary, amountInWei, { from: owner });

        await expect(will.payout({ from: owner }))
            .to.be.rejectedWith("owner must be deceased to execute payouts");
    });
});
