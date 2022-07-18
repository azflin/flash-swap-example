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
const DTOKEN_ABI = [
  {
    "inputs": [
      {
        "internalType": "bytes32",
        "name": "moduleGitCommit_",
        "type": "bytes32"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalBalances",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalBorrows",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint96",
        "name": "reserveBalance",
        "type": "uint96"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "poolSize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "interestAccumulator",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "int96",
        "name": "interestRate",
        "type": "int96"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "AssetStatus",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Borrow",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "delegate",
        "type": "address"
      }
    ],
    "name": "DelegateAverageLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Deposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "EnterMarket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "ExitMarket",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "Genesis",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "recipient",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "GovConvertReserves",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "eTokenAddress",
            "type": "address"
          },
          {
            "internalType": "bool",
            "name": "borrowIsolated",
            "type": "bool"
          },
          {
            "internalType": "uint32",
            "name": "collateralFactor",
            "type": "uint32"
          },
          {
            "internalType": "uint32",
            "name": "borrowFactor",
            "type": "uint32"
          },
          {
            "internalType": "uint24",
            "name": "twapWindow",
            "type": "uint24"
          }
        ],
        "indexed": false,
        "internalType": "struct Storage.AssetConfig",
        "name": "newConfig",
        "type": "tuple"
      }
    ],
    "name": "GovSetAssetConfig",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "chainlinkAggregator",
        "type": "address"
      }
    ],
    "name": "GovSetChainlinkPriceFeed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "interestRateModel",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bytes",
        "name": "resetParams",
        "type": "bytes"
      }
    ],
    "name": "GovSetIRM",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint16",
        "name": "newPricingType",
        "type": "uint16"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "newPricingParameter",
        "type": "uint32"
      }
    ],
    "name": "GovSetPricingConfig",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint32",
        "name": "newReserveFee",
        "type": "uint32"
      }
    ],
    "name": "GovSetReserveFee",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "moduleId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "moduleImpl",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bytes32",
        "name": "moduleGitCommit",
        "type": "bytes32"
      }
    ],
    "name": "InstallerInstallModule",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "newGovernorAdmin",
        "type": "address"
      }
    ],
    "name": "InstallerSetGovernorAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "newUpgradeAdmin",
        "type": "address"
      }
    ],
    "name": "InstallerSetUpgradeAdmin",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "violator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collateral",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "repay",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "yield",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "healthScore",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "baseDiscount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "discount",
        "type": "uint256"
      }
    ],
    "name": "Liquidation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "eToken",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "dToken",
        "type": "address"
      }
    ],
    "name": "MarketActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "pToken",
        "type": "address"
      }
    ],
    "name": "PTokenActivated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PTokenUnWrap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "PTokenWrap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "proxy",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "moduleId",
        "type": "uint256"
      }
    ],
    "name": "ProxyCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Repay",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestBorrow",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestBurn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestDeposit",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestDonate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "liquidator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "violator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "collateral",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "repay",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "minYield",
        "type": "uint256"
      }
    ],
    "name": "RequestLiquidate",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestMint",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestRepay",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "accountIn",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "accountOut",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlyingIn",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "underlyingOut",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "swapType",
        "type": "uint256"
      }
    ],
    "name": "RequestSwap",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestTransferDToken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestTransferEToken",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "RequestWithdraw",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "TrackAverageLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "UnTrackAverageLiquidity",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "underlying",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Withdraw",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subAccountId",
        "type": "uint256"
      },
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
    "name": "approveDebt",
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
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOfExact",
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
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subAccountId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "holder",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "debtAllowance",
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
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "flashLoan",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "moduleGitCommit",
    "outputs": [
      {
        "internalType": "bytes32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "moduleId",
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
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "subAccountId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "repay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
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
  {
    "inputs": [],
    "name": "totalSupplyExact",
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
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
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
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
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
    "inputs": [],
    "name": "underlyingAsset",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
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
    let usdc_dtoken = new ethers.Contract(
      "0x84721A3dB22EB852233AEAE74f9bC8477F8bcc42",
      DTOKEN_ABI,
      ethers.provider
    );
    usdc_dtoken = usdc_dtoken.connect(signer);
    // await usdc_dtoken.approveDebt(0, leverUp.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");

    await weth.approve(leverUp.address, "115792089237316195423570985008687907853269984665640564039457584007913129639935");

    await leverUp.leverUp(
      "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8",
      // Deposit 1 WETH
      "1000000000000000000",
      // 100 USDC to borrow
      "100000000"
    );

    console.log("WETH EToken Balance: ", await weth_etoken.balanceOf(leverUp.address));
    console.log("USDC DToken Balance: ", await usdc_dtoken.balanceOf(leverUp.address));
  });
});
