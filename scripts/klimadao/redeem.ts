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

  // requires an ERC20 approval first - maybe for KLIMA token?
  // i'm not clear if that is for the target wallet or the signing wallet
  // see also: KlimaStaking https://polygonscan.com/address/0x25d28a24ceb6f81015bb0b2007d795acac411b4d#code
  // and KlimaToken https://polygonscan.com/address/0x4e78011ce80ee02d2c3e649fb657e45898257815#code

  const redeem: any = await contract.connect(wallet).redeem(walletAddress, true)
  // const redeem: any = await contract.connect(wallet).redeem(walletAddress, false)
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