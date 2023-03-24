import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk/wallet/index";
import { configureEnvironment } from "@fun-wallet/sdk/managers"

const options = {
  chain: 31337,
  apiKey: "localtest",
}

export const handleSwap = async function(wallet, paymentToken, swapData){
  // await configureEnvironment(options)
  // auth = new Eoa({ privateKey: TEST_PRIVATE_KEY })
  // salt = await auth.getUniqueId()
  // wallet = new FunWallet({ salt, index: 0 })
  // await prefundWallet(auth, wallet, 10)
  // const tokenBalanceBefore = (await Token.getBalance(testToken, walletAddress))
  // const receipt = await wallet.swap(auth, {
  //     in: "eth",
  //     amount: .1,
  //     out: testToken
  // })
  // const tokenBalanceAfter = (await Token.getBalance(testToken, walletAddress))

  // console.log('before',tokenBalanceBefore)
  // console.log('after',tokenBalanceAfter)


  console.log("SWAP")
  console.log(wallet);
  console.log(paymentToken)
  console.log(swapData.token1);
  console.log(swapData.amount)
  console.log(swapData.token2);

  //Tells frontend swap was success
  return {success: true, explorerUrl: "https://goerli.etherscan.io/tx/"} 

  //Tells frontend that funwallet must be funded  
  //return {mustFund: true} 

  //Tells frontend that funwallet token sponsor must be approved
  //return {mustApprove: true} 

}
