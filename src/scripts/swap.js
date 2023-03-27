import { ethers } from "ethers";
import { configureEnvironment } from "@fun-wallet/sdk/managers"
import { prefundWallet} from "@fun-wallet/sdk/utils"
import { Token } from "@fun-wallet/sdk/data"

export const handleSwap = async function(wallet, paymentToken, swapData, auth){
  const walletAddress= await wallet.getAddress()
  console.log(walletAddress)
  console.log('usdc',swapData)
  const ins = swapData.token1.name.toLowerCase()
  const out = swapData.token2.name.toLowerCase()

  //Tells frontend that funwallet must be funded  
  //return {mustFund: true} 
  
  console.log(`swapping ${ins} for ${out}`)
  const receipt = await wallet.swap(auth, {
      in: ins,
      amount: swapData.amount,
      out: out
  })

  //Tells frontend swap was success
  return {success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}`} 

  

  //Tells frontend that funwallet token sponsor must be approved
  //return {mustApprove: true} 

}
