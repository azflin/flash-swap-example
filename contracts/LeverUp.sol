// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.7.6;

// Import this file to use console.log
import "hardhat/console.sol";
import '@uniswap/v3-core/contracts/interfaces/callback/IUniswapV3SwapCallback.sol';
import '@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol';
import '@uniswap/v3-core/contracts/libraries/TickMath.sol';
import '@uniswap/v3-core/contracts/libraries/SafeCast.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

address constant EULER_MARKETS = 0x3520d5a913427E6F0D6A83E07ccD4A4da316e4d3;
address constant WETH_ETOKEN = 0x1b808F49ADD4b8C6b5117d9681cF7312Fcf0dC1D;
address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
address constant EULER_MAINNET = 0x27182842E098f60e3D576794A5bFFb0777E025d3;

interface IEulerMarkets {
    function underlyingToEToken(address underlying) external view returns (address);
}

interface IEulerEToken {
    function deposit(uint subAccountId, uint amount) external;
    function balanceOf(address account) external view returns (uint);
    function balanceOfUnderlying(address account) external view returns (uint);
    function withdraw(uint subAccountId, uint amount) external;
}

contract LeverUp is IUniswapV3SwapCallback {
    using SafeCast for uint256;

    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external override {
        IERC20(WETH).approve(EULER_MAINNET, type(uint).max);
//        IEulerEToken(WETH_ETOKEN).deposit(0, )
    }

    function leverUp(IUniswapV3Pool pool, uint256 amountWeth, uint256 amountUsdcSpecified) external {
        // Pull <amountWeth> out of caller's account
        IERC20(WETH).transferFrom(msg.sender, address(this), amountWeth);
        // Swap <amountUsdcSpecified> USDC for WETH
        pool.swap(
            address(this),
            true,
            amountUsdcSpecified.toInt256(),
            TickMath.MIN_SQRT_RATIO + 1,
            ''
        );
    }
}
