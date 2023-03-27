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
  const address= await wallet.getAddress()
  console.log(wallet)
  console.log(transferData)
  let balance = 0;
  if(transferData.token.name=="ETH"){
    const provider = ethers.getDefaultProvider();
    balance = await provider.getBalance(address);
    // balance = (await Token.getBalance(transferData.token.name, address))
  }
  else{
    balance = (await Token.getBalance(transferData.token.name, address))
  }
  if(balance<transferData.amount){
    alert(`Insufficient ${transferData.token.name} to perform Transfer.`)
    return {success:false}
    // return { success: false }
  }
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