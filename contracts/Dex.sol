// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./Stacking.sol";

// TODO The price field of a replacement order represents the price of the highest buy order
// TODO add the order cancellation
// TODO add an arbitrage function
// TODO allow contract to send orders

enum Side {
    BUY,
    SELL
}

struct Order {
    uint amount;
    uint takerAmount; //sender
    uint price;
    uint step;
    uint makerFees;
    uint mult; // sender
    uint upperBound;
    uint lowerBound;
    bytes signature;
    ERC20 baseToken;
    ERC20 quoteToken;
    address owner;
    uint64 expiry;
    Side side;
    bool replaceOrder;
}

struct TradeDetails {
    ERC20 baseToken;
    ERC20 quoteToken;
    Side side;
    bool baseFee;
}

/// @author sylar123abc
/// @title The coss3.io exchange contract
contract Dex {
    uint constant fees = 1e15;
    Stacking public stackingContract;
    mapping(uint => uint) public hashToFilledAmount;

    constructor(Stacking _stackingContract) {
        stackingContract = _stackingContract;
    }

    // TODO Create a trade event base on accurate price fees and stuff

    /**
     * @dev Main function for trading within the dex
     * @param orders - The list of the orders that the sender wants to take
     * @param tradeDetails - the details of the trades going to be made
     *
     * Tokens traded have to be the same, orders have to be ordered by owners
     */
    function trade(
        Order[] calldata orders,
        TradeDetails memory tradeDetails
    ) external {
        address owner = orders[0].owner;
        uint amountToOwner = 0;
        uint amountToSender = 0;
        uint tradeFees = 0;
        uint price = 0;
        uint quoteAmount = 0;

        if (tradeDetails.side == Side.SELL) {
            for (uint i = 0; i < orders.length; ++i) {
                require(orders[i].baseToken == tradeDetails.baseToken);
                require(orders[i].quoteToken == tradeDetails.quoteToken);
                require(orders[i].expiry > block.timestamp);
                (price, quoteAmount) = _verifyOrder(
                    orders[i],
                    tradeDetails.side
                );

                if (owner != orders[i].owner) {
                    tradeFees += _createTrade(
                        amountToOwner,
                        amountToSender,
                        tradeDetails.baseToken,
                        tradeDetails.quoteToken,
                        owner,
                        msg.sender,
                        tradeDetails.baseFee,
                        false
                    );
                    amountToOwner = 0;
                    amountToSender = 0;
                }
                amountToSender += quoteAmount;
                amountToOwner += orders[i].takerAmount;
            }

            // Last trade of the batch creation
            tradeFees += _createTrade(
                amountToOwner,
                amountToSender,
                tradeDetails.baseToken,
                tradeDetails.quoteToken,
                owner,
                msg.sender,
                tradeDetails.baseFee,
                false
            );
        } else {
            for (uint i = 0; i < orders.length; ++i) {
                require(orders[i].baseToken == tradeDetails.baseToken);
                require(orders[i].quoteToken == tradeDetails.quoteToken);
                require(orders[i].expiry > block.timestamp);
                (price, quoteAmount) = _verifyOrder(
                    orders[i],
                    tradeDetails.side
                );

                if (owner != orders[i].owner) {
                    tradeFees += _createTrade(
                        amountToSender,
                        amountToOwner,
                        tradeDetails.baseToken,
                        tradeDetails.quoteToken,
                        msg.sender,
                        owner,
                        tradeDetails.baseFee,
                        true
                    );
                    amountToOwner = 0;
                    amountToSender = 0;
                }
                amountToOwner += quoteAmount;
                amountToSender += orders[i].takerAmount;
            }

            // Last trade of the batch creation
            tradeFees += _createTrade(
                amountToSender,
                amountToOwner,
                tradeDetails.baseToken,
                tradeDetails.quoteToken,
                msg.sender,
                owner,
                tradeDetails.baseFee,
                true
            );
        }

        _handleFees(tradeDetails, tradeFees);
    }

    function tradeNotOptimised(Order[] calldata orders) external pure {}

    /**
     * @dev Function used to send the fees to the stacking contract for future distribution
     * @param tradeDetails - The details of the trade (baseToken, quoteToken needed) 
     * @param tradeFees - The fees for the current trade
     */
    function _handleFees(TradeDetails memory tradeDetails, uint tradeFees) private {
        if (tradeDetails.baseFee) {
            tradeDetails.baseToken.transferFrom(
                msg.sender,
                address(stackingContract),
                tradeFees
            );
            stackingContract.depositFees(tradeFees, tradeDetails.baseToken);
        } else {
            tradeDetails.quoteToken.transferFrom(
                msg.sender,
                address(stackingContract),
                tradeFees
            );
            stackingContract.depositFees(tradeFees, tradeDetails.quoteToken);
        }
    }

    /**
     *
     * @param amountToOwner -
     * @param amountToSender -
     * @param baseToken -
     * @param quoteToken -
     * @param owner -
     * @param sender -
     * @param baseFee -
     * @param isBuying -
     */
    function _createTrade(
        uint amountToOwner, // find other reprensentative name
        uint amountToSender,
        ERC20 baseToken,
        ERC20 quoteToken,
        address owner,
        address sender,
        bool baseFee,
        bool isBuying
    ) private returns (uint tradeFees) {
        if (baseFee) {
            tradeFees = (amountToOwner * fees) / 1e18 / 2;
            if (isBuying) {
                amountToOwner -= tradeFees;
            } else {
                amountToOwner += tradeFees;
            }
        } else {
            tradeFees = (amountToSender * fees) / 1e18 / 2;
            if (isBuying) {
                amountToSender += tradeFees;
            } else {
                amountToSender -= tradeFees;
            }
        }
        baseToken.transferFrom(sender, owner, amountToOwner);
        quoteToken.transferFrom(owner, sender, amountToSender);
    }

    /**
     * @dev Checks the replacement order is well formed
     * @param order - The replacement order to check
     * @param senderSide - The side the sender is taking
     * @param orderHash - The hash of the order being operated on
     * @return price - The price of this trade
     * @return quoteAmount - The amount being traded
     */
    function _checkReplaceOrder(
        Order memory order,
        uint orderHash,
        Side senderSide
    ) private returns (uint price, uint quoteAmount) {
        require(order.lowerBound <= order.price && order.price <= order.upperBound);
        if (order.makerFees > 2000) {
            if (senderSide == Side.BUY) {
                price = order.lowerBound + order.step * order.mult + order.makerFees;
            } else {
                price = order.lowerBound + order.step * order.mult - order.makerFees;
            }
        } else {
            if (senderSide == Side.BUY) {
                price = (order.lowerBound + order.step * order.mult) * (order.makerFees + 1000) / 1000;
            } else {
                price = (order.lowerBound + order.step * order.mult) * 1000 / (order.makerFees + 1000);
            }
        }

        orderHash = uint(keccak256(abi.encodePacked(orderHash,price)));
        quoteAmount = (price * order.takerAmount) / 1e18;
        require(order.lowerBound <= price && price <= order.upperBound);
        
        if (price <= order.price) {
            if (senderSide == Side.SELL) {
                hashToFilledAmount[orderHash] += order.takerAmount;
                require(hashToFilledAmount[orderHash] <= order.amount);
            } else {
                hashToFilledAmount[orderHash] -= order.takerAmount;
            }
        } else {
            if (senderSide == Side.BUY) {
                hashToFilledAmount[orderHash] += order.takerAmount;
                require(hashToFilledAmount[orderHash] <= order.amount);
            } else {
                hashToFilledAmount[orderHash] -= order.takerAmount;
            }
        }
    }

    /**
     * @dev Verifies that the orderr have been signed by order.owner
     * @param order - The order data to verify
     * @param senderSide - The side the sender is taking
     * @return price - the price of this trade
     * @return quoteAmount - The amount of quote being exchanged
     */
    function _verifyOrder(
        Order memory order,
        Side senderSide
    ) private returns (uint price, uint quoteAmount) {
        bytes memory data = abi.encodePacked(
            order.amount,
            order.price,
            order.step,
            order.makerFees,
            order.upperBound,
            order.lowerBound,
            order.baseToken,
            order.quoteToken,
            order.expiry,
            order.side,
            order.replaceOrder
        );

        uint orderHash = uint(keccak256(data));
        if (order.replaceOrder) {
            (price, quoteAmount) = _checkReplaceOrder(
                order,
                orderHash,
                senderSide
            );
        } else {
            require(order.side != senderSide);
            price = order.price;
            quoteAmount = (order.takerAmount * order.price) / 1e18;
            hashToFilledAmount[orderHash] += order.takerAmount;
            require(hashToFilledAmount[orderHash] <= order.amount);
        }
        require(
            order.owner ==
                ECDSA.recover(
                    ECDSA.toEthSignedMessageHash(data),
                    order.signature
                ),
            "Invalid signature"
        );
    }
}
