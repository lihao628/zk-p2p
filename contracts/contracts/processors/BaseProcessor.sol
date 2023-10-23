//SPDX-License-Identifier: MIT

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { IKeyHashAdapter } from "./keyHashAdapters/IKeyHashAdapter.sol";

pragma solidity ^0.8.18;

contract BaseProcessor is Ownable {

    /* ============ Modifiers ============ */
    modifier onlyRamp() {
        require(msg.sender == ramp, "Only Ramp can call this function");
        _;
    }

    /* ============ State Variables ============ */
    address public immutable ramp;
    IKeyHashAdapter public mailserverKeyHashAdapter;
    bytes public emailFromAddress;

    /* ============ Constructor ============ */
    constructor(
        address _ramp,
        IKeyHashAdapter _mailserverKeyHashAdapter,
        string memory _emailFromAddress
    )
        Ownable()
    {
        ramp = _ramp;
        mailserverKeyHashAdapter = _mailserverKeyHashAdapter;
        emailFromAddress = bytes(_emailFromAddress);
    }

    /* ============ External Functions ============ */

    function setMailserverKeyHashAdapter(IKeyHashAdapter _mailserverKeyHashAdapter) external onlyOwner {
        mailserverKeyHashAdapter = _mailserverKeyHashAdapter;
    }

    /**
     * @notice ONLY OWNER: Sets the from email address for validated emails. Check that email address is properly
     * padded (if necessary). Padding will be dependent on if unpacking functions cut trailing 0s or not.
     *
     * @param _emailFromAddress    The from email address for validated emails, MUST BE PROPERLY PADDED
     */
    function setEmailFromAddress(string memory _emailFromAddress) external onlyOwner {
        emailFromAddress = bytes(_emailFromAddress);
    }

    /* ============ External Getters ============ */

    function getEmailFromAddress() external view returns (bytes memory) {
        return emailFromAddress;
    }

    function getMailserverKeyHash() public view returns (bytes32) {
        return IKeyHashAdapter(mailserverKeyHashAdapter).mailserverKeyHash();
    }
}
