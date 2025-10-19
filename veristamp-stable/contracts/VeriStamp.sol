// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol"; // <-- 1. Import Ownable

/**
 * @title VeriStamp
 * @dev Inherits from OpenZeppelin's Ownable contract to add an ownership layer.
 * Includes a pausable mechanism for emergency stops.
 */
contract VeriStamp is Ownable { // <-- 2. Inherit from Ownable

    // A structure to hold the details of the certification
    struct Certificate {
        address owner;
        uint256 timestamp;
    }

    // A mapping from the file's hash to its Certificate
    mapping(bytes32 => Certificate) public certificates;

    // A boolean to control the paused state of the contract
    bool public paused; // <-- 3. Add a paused state variable

    // Event for when a certificate is created
    event CertificateCreated(
        bytes32 indexed fileHash,
        address indexed owner,
        uint256 timestamp
    );
    
    // Event for when the contract is paused or unpaused
    event PausedStateChanged(bool isPaused);

    // The constructor automatically sets the deployer of the contract as the owner.
    constructor() Ownable(msg.sender) {}

    /**
     * @dev Modifier to ensure the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!paused, "Pausable: contract is paused");
        _;
    }

    /**
     * @dev Certifies a file. Can only be called when the contract is not paused.
     */
    function certify(bytes32 _fileHash) public whenNotPaused { // <-- 4. Add the modifier
        require(_fileHash != bytes32(0), "VeriStamp: File hash cannot be empty");
        require(certificates[_fileHash].timestamp == 0, "VeriStamp: This file has already been certified");

        certificates[_fileHash] = Certificate({
            owner: msg.sender,
            timestamp: block.timestamp
        });

        emit CertificateCreated(_fileHash, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Toggles the paused state of the contract.
     * Can only be called by the owner.
     */
    function setPaused(bool _isPaused) public onlyOwner { // <-- 5. Add owner-only function
        paused = _isPaused;
        emit PausedStateChanged(_isPaused);
    }
}