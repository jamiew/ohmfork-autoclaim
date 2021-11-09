import { Contract } from "ethers"
import { ethers } from "hardhat"
import { contractName, contractAddress } from "./contract"
import * as dotenv from "dotenv"
dotenv.config()

// i would prefer to call this script `info`, but `yarn info` was taken
// but this is fine

const walletAddress: string = process.env['WALLET_ADDRESS']

const main = async(): Promise<any> => {
  console.log({ contractName, contractAddress, walletAddress })

  const contract: Contract = await ethers.getContractAt(contractName, contractAddress)

  const bondInfo: any = await contract.bondInfo(walletAddress)
  console.log({
    payout: bondInfo.payout.toString(),
    pricePaid: bondInfo.pricePaid.toString(),
    lastTime: bondInfo.lastTime,
    vesting: bondInfo.vesting
  })

  const pendingPayout: any = await contract.pendingPayoutFor(walletAddress)
  console.log({ pendingPayout: pendingPayout.toString() })

  const percentVested: any = await contract.percentVestedFor(walletAddress)
  console.log({ percentVested: percentVested.toString() })

  console.log(`\nCongrats, you have vested ${Number(pendingPayout)/10e8} SB`)
  console.log("\nRun `yarn redeem` to claim\n")

}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})