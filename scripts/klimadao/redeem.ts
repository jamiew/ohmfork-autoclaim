import { Contract, Wallet } from "ethers"
import { ethers } from "hardhat"
import {
  depositoryContractName, depositoryContractAddress,
  stakingContractName, stakingContractAddress,
  tokenContractName, tokenContractAddress,
} from "./contract"
import * as dotenv from "dotenv"
dotenv.config()

const walletAddress: string = process.env['WALLET_ADDRESS']
const pkAddress: string = process.env['PK_ADDRESS']
const privateKey:string = process.env['PRIVATE_KEY']

const main = async(): Promise<any> => {
  const depositoryContract: Contract = await ethers.getContractAt(depositoryContractName, depositoryContractAddress)
  const stakingContract: Contract = await ethers.getContractAt(stakingContractName, stakingContractAddress)
  const tokenContract: Contract = await ethers.getContractAt(tokenContractName, tokenContractAddress)

  const wallet: Wallet = await new Wallet(privateKey, ethers.provider)

  const pendingPayout: any = await depositoryContract.pendingPayoutFor(walletAddress)
  console.log({ pendingPayout: pendingPayout.toString() })

  // automatic staking alongside bond redemption appears to require an ERC20 approval first - maybe for KLIMA or sKLIMA token?
  // i'm not clear if that is for the target wallet or the signing wallet, or if a second-party can even use this autostaking
  // const redeemTxn: any = await depositoryContract.connect(wallet).redeem(walletAddress, true)

  // in the meantime, let's just do two txns
  const redeemTxn: any = await depositoryContract.connect(wallet).redeem(walletAddress, false)
  console.log("tx hash =>", redeemTxn?.hash, "gasPrice =>", redeemTxn?.gasPrice?.toNumber())

  const redeemReceipt: any = await redeemTxn.wait()
  console.log("receipt block =>", redeemReceipt?.blockNumber, "hash =>", redeemReceipt?.transactionHash)

  // inspect our idle balance
  const tokenBalance: any = await tokenContract.balanceOf(walletAddress)
  console.log('KLIMA balance:', tokenBalance.toNumber(), tokenBalance.toNumber()/10e8)

  // and now stake it
  const stakeTxn = await stakingContract.connect(wallet).stake(tokenBalance)
  console.log("tx hash =>", stakeTxn?.hash, "gasPrice =>", stakeTxn?.gasPrice?.toNumber())

  const stakeReceipt: any = await stakeTxn.wait()
  console.log("receipt block =>", stakeReceipt?.blockNumber, "hash =>", stakeReceipt?.transactionHash)


}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})
