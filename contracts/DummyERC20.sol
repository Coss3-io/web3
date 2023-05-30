// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract DummyERC20 is ERC20 {
    constructor(string memory name, string memory ticker) ERC20(name, ticker) {
        _mint(msg.sender, 5000000 * 10 ** 18);
    }
}
