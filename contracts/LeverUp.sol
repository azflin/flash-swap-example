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
address constant USDC_DTOKEN = 0x84721A3dB22EB852233AEAE74f9bC8477F8bcc42;
address constant WETH = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;
address constant USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
address constant EULER_MAINNET = 0x27182842E098f60e3D576794A5bFFb0777E025d3;
address constant EULER_EXEC = 0x59828FdF7ee634AaaD3f58B19fDBa3b03E2D9d80;

interface IEulerMarkets {
    function underlyingToEToken(address underlying) external view returns (address);
    function enterMarket(uint subAccountId, address newMarket) external;
}
interface IEulerEToken {
    function deposit(uint subAccountId, uint amount) external;
    function balanceOf(address account) external view returns (uint);
    function balanceOfUnderlying(address account) external view returns (uint);
    function withdraw(uint subAccountId, uint amount) external;
}
interface IEulerDToken {
    function borrow(uint subAccountId, uint amount) external;
    function balanceOf(address account) external view returns (uint);
}
interface IEulerExec {
    function deferLiquidityCheck(address account, bytes memory data) external;
}
interface IDeferredLiquidityCheck {
    function onDeferredLiquidityCheck(bytes memory data) external;
}

contract LeverUp is IUniswapV3SwapCallback, IDeferredLiquidityCheck {
    using SafeCast for uint256;

    function uniswapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external override {
        (address pool, address recipient) = abi.decode(data, (address, address));

        // Approve Euler to withdraw WETH
        IERC20(WETH).approve(EULER_MAINNET, type(uint).max);

        // Deposit all the WETH in this contract and get back eTokens
        IEulerEToken wethEToken = IEulerEToken(WETH_ETOKEN);
        wethEToken.deposit(0, IERC20(WETH).balanceOf(address(this)));

        // Enter WETH market
        IEulerMarkets markets = IEulerMarkets(EULER_MARKETS);
        markets.enterMarket(0, WETH);

        // Borrow <amount0Delta> USDC
        IEulerDToken usdcDToken = IEulerDToken(USDC_DTOKEN);
        usdcDToken.borrow(0, uint256(amount0Delta));

        // Send <amount0Delta> USDC back to v3 pool
        IERC20(USDC).transfer(pool, uint256(amount0Delta));

        IEulerExec(EULER_EXEC).deferLiquidityCheck(address(this), abi.encode(recipient));
    }

    function onDeferredLiquidityCheck(bytes calldata data) external override {
        address recipient = abi.decode(data, (address));
        IERC20(WETH_ETOKEN).transfer(recipient, IERC20(WETH_ETOKEN).balanceOf(address(this)));
        IERC20(USDC_DTOKEN).transfer(recipient, IERC20(USDC_DTOKEN).balanceOf(address(this)));
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
            abi.encode(pool, msg.sender)
        );
    }
}
