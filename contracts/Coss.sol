// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


contract Coss is ERC20 {
    constructor () ERC20("Coss", "COSS") {
        _mint(msg.sender, 5000000 * 10**18);
    }
}