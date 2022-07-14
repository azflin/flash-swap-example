// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

// Import this file to use console.log
import "hardhat/console.sol";
import '@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import '@uniswap/v3-core/contracts/libraries/SafeCast.sol';

contract LeverUp is IUniswapV3SwapCallback {
    using SafeCast for uint256;

    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external override {
        console.logInt(amount0Delta);
        console.logInt(amount1Delta);
    }

    function leverUp(IUniswapV3Pool pool, uint256 amountUsdcSpecified) external {
        pool.swap(
            address(this),
            true,
            amountUsdcSpecified.toInt256(),
            TickMath.MIN_SQRT_RATIO + 1,
            ''
        );
    }
}
