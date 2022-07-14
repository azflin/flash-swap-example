require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
const { ethers } = require('hardhat')

async function main() {
  const LeverUp = await ethers.getContractFactory('LeverUp')
  const leverUp = await LeverUp.deploy()
  await leverUp.deployed()
  console.log(`leverUp deployed at ${leverUp.address}`)
}

main()
  // eslint-disable-next-line no-process-exit
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    // eslint-disable-next-line no-process-exit
    process.exit(1)
  })
