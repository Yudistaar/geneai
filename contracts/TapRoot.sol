// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GenesisAI is ERC20 {
    address public owner;

    constructor() ERC20("GenesisAI", "AI") {
        owner = msg.sender;
        _mint(owner, 100_000_000_000 * 10 ** decimals()); // 100B tokens
    }

    function distribute(address[] calldata recipients, uint256[] calldata amounts) external {
        require(msg.sender == owner, "Unauthorized");
        require(recipients.length == amounts.length, "Array length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            _transfer(owner, recipients[i], amounts[i]);
        }
    }
}