import { ethers } from "ethers";
import { FunWallet, FunWalletConfig } from "@fun-wallet/sdk/wallet/index";
import { configureEnvironment } from "@fun-wallet/sdk/managers"
import { prefundWallet } from "../../../wallet-sdk-v1/utils"
import { Token } from "@fun-wallet/sdk/data"
// import { FunWallet } from "../../../wallet-sdk-v1/";


export const handleTransfer = async function (wallet, paymentToken, transferData, auth) {
  if (!transferData.to) {
    alert("No Receiver Address Specified")
    return { success: false }
  }

  console.log(wallet)
  console.log(await wallet.getAddress())
  console.log(transferData)
  
  // if(Token get balance ){
    // return { success: false }
  // }
  if(transferData.token.name!="ETH"){
    console.log("Transfering ERC")
    const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount, token: transferData.token.name})
    console.log(receipt)
    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
  }
  else{
    const receipt = await wallet.transfer(auth, { to: transferData.to, amount: transferData.amount })
    console.log(receipt)
    return { success: true, explorerUrl: `https://goerli.etherscan.io/tx/${receipt.txid}` }
  }
}