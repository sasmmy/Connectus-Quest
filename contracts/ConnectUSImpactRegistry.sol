// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ConnectUSImpactRegistry is Ownable {
    struct ImpactRecord {
        address user;
        string missionTitle;
        uint256 xpReward;
        uint256 userLevel;
        uint256 timestamp;
    }

    uint256 public recordCount;

    mapping(uint256 recordId => ImpactRecord record) private records;

    event ImpactRegistered(
        uint256 indexed recordId,
        address indexed user,
        string missionTitle,
        uint256 xpReward,
        uint256 userLevel,
        uint256 timestamp
    );

    constructor() Ownable(msg.sender) {}

    function registerImpact(
        string calldata missionTitle,
        uint256 xpReward,
        uint256 userLevel
    ) external returns (uint256 recordId) {
        recordId = ++recordCount;
        uint256 timestamp = block.timestamp;

        records[recordId] = ImpactRecord({
            user: msg.sender,
            missionTitle: missionTitle,
            xpReward: xpReward,
            userLevel: userLevel,
            timestamp: timestamp
        });

        emit ImpactRegistered(
            recordId,
            msg.sender,
            missionTitle,
            xpReward,
            userLevel,
            timestamp
        );
    }

    function getRecord(uint256 recordId)
        external
        view
        returns (ImpactRecord memory)
    {
        return records[recordId];
    }
}
