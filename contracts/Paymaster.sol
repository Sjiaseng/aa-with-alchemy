// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

contract Paymaster is IPaymaster {

    function validatePaymasterUserOp(UserOperation calldata userOp, bytes32 userOpHash, uint256 maxCost)
    external pure returns (bytes memory context, uint256 validationData) {
       // 20 bytes should be paymester address
       // timePeriod
       // signature
       
       context = new bytes(0);
       validationData = 0;
       
    }

    function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external {
        // Implementation to be provided by derived contracts
    }
}