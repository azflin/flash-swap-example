const { expect } = require("chai");
const { ethers } = require("hardhat");
const hre = require("hardhat");

const ERC20_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
];

describe("LeverUp", function () {
  it("base case", async function () {
    await hre.network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl:
              "https://eth-mainnet.alchemyapi.io/v2/v3XEMoQKY-qHj1R_MLDYiJOUdm59r9nh",
            blockNumber: 15167913,
          },
        },
      ],
    });

    const LeverUp = await ethers.getContractFactory("LeverUp");
    let leverUp = await LeverUp.deploy();
    await leverUp.deployed();
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: ["0xEF330d6F0B4375c39D8eD3d0D690a5B69e9EcD0c"],
    });
    const signer = await ethers.getSigner(
      "0xEF330d6F0B4375c39D8eD3d0D690a5B69e9EcD0c"
    );
    leverUp = leverUp.connect(signer);
    console.log("leverUp.address", leverUp.address);

    let weth = new ethers.Contract(
      "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      ERC20_ABI,
      ethers.provider
    );
    weth = weth.connect(signer);

    const weth_etoken = new ethers.Contract(
      "0x1b808F49ADD4b8C6b5117d9681cF7312Fcf0dC1D",
      ERC20_ABI,
      ethers.provider
    );

    await weth.approve(leverUp.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");

    await leverUp.leverUp(
      "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
      // Deposit 1 WETH
      "1000000000000000000",
      // 100 USDC to borrow
      "100000000"
    );

    console.log("WETH EToken Balance: ", await weth_etoken.balanceOf("0xAe120F0df055428E45b264E7794A18c54a2a3fAF"));
    console.log("WETH Balance: ", await weth.balanceOf("0xAe120F0df055428E45b264E7794A18c54a2a3fAF"));
  });
});
