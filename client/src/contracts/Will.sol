// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Wills {
    address public owner;
    uint public fortune;
    bool public deceased;

    event InheritanceSet(address indexed wallet, uint amount);
    event PayoutExecuted(address indexed wallet, uint amount);
    event OwnerDeceased();

    constructor() payable {
        owner = msg.sender;
        fortune = msg.value;
        deceased = false;
    }

    modifier onlyOwner {
        require(msg.sender == owner, 'only owner can execute the will');
        _;
    }

    modifier mustBeDeceased {
        require(deceased == true, 'owner must be deceased to execute payouts');
        _;
    }

    address payable[] familyWallets;
    mapping(address => uint) inheritance;

    function setInheritance(address payable wallet, uint amount) public onlyOwner {
        // Check if the wallet is already in the familyWallets array
        bool walletExists = false;
        for (uint i = 0; i < familyWallets.length; i++) {
            if (familyWallets[i] == wallet) {
                walletExists = true;
                break;
            }
        }

        // Add wallet to the familyWallets array if it doesn't already exist
        if (!walletExists) {
            familyWallets.push(wallet);
        }
        inheritance[wallet] = amount;
        emit InheritanceSet(wallet, amount);
    }

    function payout() private mustBeDeceased {
        for (uint i = 0; i < familyWallets.length; i++) {
            familyWallets[i].transfer(inheritance[familyWallets[i]]);
            emit PayoutExecuted(familyWallets[i], inheritance[familyWallets[i]]);
        }
    }

    function hasDeceased() public onlyOwner {
        deceased = true;
        emit OwnerDeceased();
        payout();
    }
}
