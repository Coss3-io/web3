// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

struct Slot {
    uint256 time;
    mapping(address => uint256) fees;
}

struct Stack {
    uint256 amount;
    uint256 slot;
    mapping(address => uint256) withdrawals; // to store until which slot the user have withdraw the tokens
}

/// @author sylar123abc
/// @title The coss3.io stacking contract
contract Stacking {
    uint256[] public stacked; // tracking the stacked amount over the slots
    Slot[] public slots;
    mapping(address => Stack[]) private myStack; // The stacks entries for every users
    ERC20 public cossToken;

    constructor(ERC20 _cossToken) {
        cossToken = _cossToken;
        slots.push().time = block.timestamp - 7 days;
        stacked.push();
    }

    /**
     * @dev Function used to deposit tokens into the stacking contract
     * @param amount - The amount the user which to stack
     */
    function depositStack(uint256 amount) external {
        cossToken.transferFrom(msg.sender, address(this), amount);
        uint slotId = slots.length - 1;

        if (slots[slotId].time - block.timestamp >= 7 days) {
            slots.push().time = block.timestamp;
            stacked.push(stacked[slotId] + amount);
        } else {
            stacked[slotId] += amount;
        }

        Stack storage stack = myStack[msg.sender].push();
        stack.amount = amount;
        stack.slot = slotId;
    }

    /**
     * Add the tokens to the earned tokens
     *
     * @dev Function called by the exchange contract in order to deposit the fees into the contract
     * @param amount - The amount to be deposited into the stacking contract
     * @param token - The token that is being deposited into the stacking contract
     */
    function depositFees(uint amount, ERC20 token) external {
        slots[slots.length - 1].fees[address(token)] += amount;
    }

    /**
     * @dev Function called by a user to withdraw the fees he gathered throught the stacking contract
     * @param tokens - An array of tokens the user want to withdraw his part
     */
    function withdrawFees(ERC20[] calldata tokens) external {
        uint stackedAmount = 0;
        uint startingSlot = 0;
        uint stackLength = myStack[msg.sender].length;
        uint slotId = slots.length - 1;
        uint[] memory toTransfer = new uint[](tokens.length);

        for (uint i = 0; i < stackLength; ++i) {
            stackedAmount = myStack[msg.sender][i].amount;
            startingSlot = myStack[msg.sender][i].slot;

            for (uint j = 0; j < tokens.length - 1; ++j) {
                uint withdrawSlot = myStack[msg.sender][i].withdrawals[
                    address(tokens[j])
                ];

                myStack[msg.sender][i].withdrawals[address(tokens[j])] = slotId;

                startingSlot = startingSlot < withdrawSlot
                    ? withdrawSlot
                    : startingSlot;

                for (uint k = 1; k < slotId - startingSlot; ++k) {
                    // k is one because you start gathering the fees one slot after the deposit
                    toTransfer[j] +=
                        (slots[k].fees[address(tokens[j])] * stackedAmount) /
                        stacked[k];
                }
            }
        }

        for (uint i = 0; i < tokens.length; ++i) {
            tokens[i].transfer(msg.sender, toTransfer[i]);
        }
    }

    /**
     * @dev Function used to withdraw all the stacked amount from the contract at once
     */
    function withdrawStack() external {
        uint toTransfer = 0;
        for (uint i = 0; i < myStack[msg.sender].length; ++i) {
            toTransfer += myStack[msg.sender][i].amount;
        }
        delete myStack[msg.sender];
        cossToken.transfer(msg.sender, toTransfer);
    }
}
