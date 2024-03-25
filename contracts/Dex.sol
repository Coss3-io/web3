// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Stacking.sol";
import "hardhat/console.sol";

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
    uint64 chainId;
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
    mapping(uint => bool) public cancelledOrders;

    event NewTrade(
        address indexed _taker,
        uint _orderHash,
        uint _amount,
        uint _fees,
        bool _baseFees,
        Side _isSeller
    );
    event Cancel(uint _orderHash);

    constructor(Stacking _stackingContract) {
        stackingContract = _stackingContract;
    }

    /**
     * @dev Main function for trading within the dex
     * @param orders - The list of the orders that the sender wants to take
     * @param tradeDetails - the details of the trades going to be made
     *
     * Tokens traded have to be the same, orders have to be ordered by owners
     */
    function trade(
        Order[] calldata orders,
        TradeDetails calldata tradeDetails
    ) external {
        address owner = orders[0].owner;
        uint amountToOwner = 0;
        uint amountToSender = 0;
        uint tradeFees = 0;
        uint quoteAmount = 0;
        uint orderHash = 0;
        uint length = orders.length - 1;

        if (tradeDetails.side == Side.SELL) {
            for (uint i = 0; i < orders.length; ++i) {
                require(orders[i].baseToken == tradeDetails.baseToken);
                require(orders[i].quoteToken == tradeDetails.quoteToken);
                require(orders[i].expiry > block.timestamp);
                (quoteAmount, orderHash) = _verifyOrder(
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
                    owner = orders[i].owner;
                    amountToOwner = 0;
                    amountToSender = 0;
                    _triggerTradeEvent(
                        orders[i],
                        tradeDetails,
                        orderHash,
                        tradeFees
                    );
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
            _triggerTradeEvent(
                orders[length],
                tradeDetails,
                orderHash,
                tradeFees
            );
        } else {
            for (uint i = 0; i < orders.length; ++i) {
                require(orders[i].baseToken == tradeDetails.baseToken);
                require(orders[i].quoteToken == tradeDetails.quoteToken);
                require(orders[i].expiry > block.timestamp);
                (quoteAmount, orderHash) = _verifyOrder(
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
                    owner = orders[i].owner;
                    amountToOwner = 0;
                    amountToSender = 0;
                    _triggerTradeEvent(
                        orders[i],
                        tradeDetails,
                        orderHash,
                        tradeFees
                    );
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
            _triggerTradeEvent(
                orders[length],
                tradeDetails,
                orderHash,
                tradeFees
            );
        }

        _handleFees(tradeDetails, tradeFees);
    }

    function tradeNotOptimised(
        Order[] calldata orders,
        TradeDetails[] calldata tradeDetails
    ) external {
        uint tradeFees = 0;
        uint quoteAmount = 0;
        uint orderHash = 0;

        for (uint i = 0; i < orders.length; ++i) {
            require(orders[i].baseToken == tradeDetails[i].baseToken);
            require(orders[i].quoteToken == tradeDetails[i].quoteToken);
            require(orders[i].expiry > block.timestamp);
            (quoteAmount, orderHash) = _verifyOrder(
                orders[i],
                tradeDetails[i].side
            );
            if (tradeDetails[i].side == Side.SELL) {
                tradeFees = _createTrade(
                    orders[i].takerAmount,
                    quoteAmount,
                    tradeDetails[i].baseToken,
                    tradeDetails[i].quoteToken,
                    orders[i].owner,
                    msg.sender,
                    tradeDetails[i].baseFee,
                    false
                );
            } else {
                tradeFees = _createTrade(
                    orders[i].takerAmount,
                    quoteAmount,
                    tradeDetails[i].baseToken,
                    tradeDetails[i].quoteToken,
                    msg.sender,
                    orders[i].owner,
                    tradeDetails[i].baseFee,
                    true
                );
            }
            _triggerTradeEvent(
                orders[i],
                tradeDetails[i],
                orderHash,
                tradeFees
            );
            _handleFees(tradeDetails[i], tradeFees);
        }
    }

    /**
     * @dev Function used to cancel a list of orders, only the owner can cancel its orders
     * @param orders[] - the list of the orders the user wants to cancel
     */
    function cancelOrders(Order[] calldata orders) external {
        for (uint i = 0; i < orders.length; ++i) {
            bytes memory data = _encodeOrder(orders[i]);
            uint orderHash = uint(keccak256(data));
            uint256 chainId;
            assembly {
                chainId := chainid()
            }
            require(chainId == chainId);
            require(orders[i].owner == msg.sender);
            require(!cancelledOrders[orderHash]);
            cancelledOrders[orderHash] = true;
            emit Cancel(orderHash);
        }
    }

    /**
     * @dev Function used to send the fees to the stacking contract for future distribution
     * @param tradeDetails - The details of the trade (baseToken, quoteToken needed)
     * @param tradeFees - The fees for the current trade
     */
    function _handleFees(
        TradeDetails calldata tradeDetails,
        uint tradeFees
    ) private {
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
     * @return quoteAmount - The amount being traded
     */
    function _checkReplaceOrder(
        Order calldata order,
        uint orderHash,
        Side senderSide
    ) private returns (uint quoteAmount, uint newOrderHash) {
        uint price = 0;
        require(
            order.lowerBound <= order.price && order.price <= order.upperBound
        );
        if (order.makerFees > 2000) {
            if (senderSide == Side.BUY) {
                price =
                    order.lowerBound +
                    order.step *
                    order.mult +
                    order.makerFees;
            } else {
                price =
                    order.lowerBound +
                    order.step *
                    order.mult -
                    order.makerFees;
            }
        } else {
            if (senderSide == Side.BUY) {
                price =
                    ((order.lowerBound + order.step * order.mult) *
                        (order.makerFees + 1000)) /
                    1000;
            } else {
                price =
                    ((order.lowerBound + order.step * order.mult) * 1000) /
                    (order.makerFees + 1000);
            }
        }

        newOrderHash = uint(
            keccak256(
                abi.encodePacked(
                    orderHash,
                    order.lowerBound + order.step * order.mult
                )
            )
        );
        quoteAmount = (price * order.takerAmount) / 1e18;
        require(order.lowerBound <= price && price <= order.upperBound);

        if (price <= order.price) {
            if (senderSide == Side.SELL) {
                hashToFilledAmount[newOrderHash] += order.takerAmount;
                require(hashToFilledAmount[newOrderHash] <= order.amount);
            } else {
                hashToFilledAmount[newOrderHash] -= order.takerAmount;
            }
        } else {
            if (senderSide == Side.BUY) {
                hashToFilledAmount[newOrderHash] += order.takerAmount;
                require(hashToFilledAmount[newOrderHash] <= order.amount);
            } else {
                hashToFilledAmount[newOrderHash] -= order.takerAmount;
            }
        }
    }

    /**
     * @dev Verifies that the orderis valid and returns the exchanged amount
     * @param order - The order data to verify
     * @param senderSide - The side the sender is taking
     * @return quoteAmount - The amount of quote being exchanged
     */
    function _verifyOrder(
        Order calldata order,
        Side senderSide
    ) private returns (uint quoteAmount, uint orderHash) {
        bytes memory data = _encodeOrder(order);

        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        require(chainId == order.chainId);

        orderHash = uint(keccak256(data));
        require(!cancelledOrders[orderHash]);

        if (order.replaceOrder) {
            (quoteAmount, orderHash) = _checkReplaceOrder(
                order,
                orderHash,
                senderSide
            );
        } else {
            require(order.side != senderSide);
            quoteAmount = (order.takerAmount * order.price) / 1e18;
            hashToFilledAmount[orderHash] += order.takerAmount;
            require(hashToFilledAmount[orderHash] <= order.amount);
        }
        if (Address.isContract(order.owner)) {
            require(
                Ownable(order.owner).owner() ==
                    ECDSA.recover(
                        ECDSA.toEthSignedMessageHash(data),
                        order.signature
                    ),
                "Invalid signature"
            );
        } else {
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

    /**
     * @notice - Function used to encode the orders as bytes
     * to avoid having a too deep stack
     * @param order - The order to encode
     * @return data - The encoded order
     */
    function _encodeOrder(
        Order calldata order
    ) private pure returns (bytes memory data) {
        data = abi.encodePacked(
            order.owner,
            order.amount,
            order.price,
            order.step,
            order.makerFees,
            order.upperBound,
            order.lowerBound,
            order.baseToken,
            order.quoteToken,
            order.expiry,
            order.chainId,
            order.side,
            order.replaceOrder
        );
    }

    /**
     * @notice - Function used to emit the new trade event
     * the event emitter is inside a function to avoid too
     * deep stack
     * @param _order - the maker order of the trade
     * @param _taker - The taker trade details of the trade
     * @param _orderHash - The order hash of the trade
     * @param _fees - The fees paid by the taker
     */
    function _triggerTradeEvent(
        Order calldata _order,
        TradeDetails calldata _taker,
        uint _orderHash,
        uint _fees
    ) private {
        emit NewTrade(
            msg.sender,
            _orderHash,
            _order.takerAmount,
            _fees,
            _taker.baseFee,
            _taker.side
        );
    }
}
