//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract RoundStaking {
    IERC20 public token;

    mapping(bytes32 => uint256) public roundStakes;
    mapping(bytes32 => uint256) public uniqueStakerCount;
    mapping(address => mapping(bytes32 => uint256)) public userStakes;

    event Staked(
        bytes32 round,
        address staker,
        uint256 amount
    );

    event Unstaked(
        bytes32 round,
        address staker,
        uint256 amount
    );

    constructor(IERC20 _token)
    {
        token = _token;
    }

    // stake
    // round: roundId + - + chainId
    function stake(bytes32 round, uint256 amount) public {
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "unable to stake amount"
        );

        if (userStakes[msg.sender][round] == 0) {
            uniqueStakerCount[round]++;
        }

        roundStakes[round] += amount;
        userStakes[msg.sender][round] += amount;

        emit Staked(round, msg.sender, amount);
    }

    // unstake
    function unstake(bytes32 round, uint256 amount) public {
        require(
            userStakes[msg.sender][round] >= amount,
            "insufficient staked amount"
        );

        roundStakes[round] -= amount;
        userStakes[msg.sender][round] -= amount;

        if (userStakes[msg.sender][round] == 0) {
            uniqueStakerCount[round]--;
        }

        require(token.transfer(msg.sender, amount), "unable to unstake amount");

        emit Unstaked(round, msg.sender, amount);
    }
}
