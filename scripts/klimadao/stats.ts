import { Contract } from "ethers"
import { ethers } from "hardhat"
import {
  depositoryContractName, depositoryContractAddress,
  tokenContractName, tokenContractAddress,
  stakedTokenContractName, stakedTokenContractAddress,
} from "./contract"
import * as dotenv from "dotenv"
dotenv.config()

// i would prefer to call this script `info`, but `yarn info` was taken
// but this is fine

const walletAddress: string = process.env['WALLET_ADDRESS']

const main = async(): Promise<any> => {
  const depositoryContract: Contract = await ethers.getContractAt(depositoryContractName, depositoryContractAddress)
  const tokenContract: Contract = await ethers.getContractAt(tokenContractName, tokenContractAddress)
  const stakedTokenContract: Contract = await ethers.getContractAt(stakedTokenContractName, stakedTokenContractAddress)

  const bondInfo: any = await depositoryContract.bondInfo(walletAddress)

  console.log({
    payout: bondInfo.payout.toString(),
    pricePaid: bondInfo.pricePaid.toString(),
    lastTime: bondInfo.lastTime,
    vesting: bondInfo.vesting
  })

  const pendingPayout: any = await depositoryContract.pendingPayoutFor(walletAddress)
  console.log({ pendingPayout: pendingPayout.toString() })

  const percentVested: any = await depositoryContract.percentVestedFor(walletAddress)
  console.log({ percentVested: percentVested.toString() })

  console.log()
  console.log('Vested bond balance:', pendingPayout.toNumber()/10e8)

  // const stakeBalance: any = await stakingContract.balanceOf(walletAddress)

  const tokenBalance: any = await tokenContract.balanceOf(walletAddress)
  console.log('KLIMA balance:', tokenBalance.toNumber()/10e8)

  const stakedTokenBalance: any = await stakedTokenContract.balanceOf(walletAddress)
  console.log('sKLIMA balance:', stakedTokenBalance.toNumber()/10e8)





}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})
