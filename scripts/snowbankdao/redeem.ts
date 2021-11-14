import { Contract, Wallet } from "ethers"
import { ethers } from "hardhat"
import { contractName, contractAddress } from "./contract"
import * as dotenv from "dotenv"
dotenv.config()

const walletAddress: string = process.env['WALLET_ADDRESS']
const privateKey:string = process.env['PRIVATE_KEY']

const main = async(): Promise<any> => {
  console.log({ contractName, contractAddress, walletAddress })

  const contract: Contract = await ethers.getContractAt(contractName, contractAddress)

  const wallet: Wallet = await new Wallet(privateKey, ethers.provider)

  const pendingPayout: any = await contract.pendingPayoutFor(walletAddress)
  console.log({ pendingPayout: pendingPayout.toString() })

  const redeem: any = await contract.connect(wallet).redeem(walletAddress, true)
  console.log({ redeem })

  const receipt: any = await redeem.wait()
  console.log({ receipt })
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error)
  process.exit(1)
})